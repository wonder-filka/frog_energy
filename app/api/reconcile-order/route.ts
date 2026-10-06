import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { completePaidOrder } from "@/lib/orders";
import { getSessionUserId } from "@/lib/session";
import { hasLocale } from "@/i18n-config";

type MonoStatus =
	| "created"
	| "processing"
	| "hold"
	| "success"
	| "failure"
	| "reversed"
	| "expired";

type MonoStatusResponse = {
	invoiceId: string;
	status: MonoStatus;
	amount?: number; // в минимальных единицах (центы для USD)
	ccy?: number; // ISO 4217 (840 для USD)
	createdDate?: string;
	modifiedDate?: string;
	reference?: string;
	destination?: string;
};

// Manual "check payment" from /payment-return, for when the webhook is late
export async function POST(req: NextRequest) {
	try {
		const { orderId, locale } = await req.json();
		if (!orderId) {
			return NextResponse.json({ error: "orderId required" }, { status: 400 });
		}

		const userId = await getSessionUserId();
		const order = await prisma.order.findUnique({ where: { id: orderId } });

		// Only the buyer can reconcile their order
		if (!order?.paymentId || order.userId !== userId) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		// Если уже оплачено — считаем идемпотентно успешным
		if (order.status === "PAID") {
			return NextResponse.json({ status: "success" });
		}

		const monoRes = await fetch(
			`${process.env.PLATA_API_BASE_URL}/api/merchant/invoice/status?invoiceId=${order.paymentId}`,
			{
				headers: { "X-Token": process.env.PLATA_BY_MONO_TOKEN! },
				cache: "no-store",
			}
		);

		if (!monoRes.ok) {
			const txt = await monoRes.text().catch(() => "");
			return NextResponse.json(
				{
					error: "Mono status fetch failed",
					details: txt || monoRes.statusText,
				},
				{ status: 502 }
			);
		}

		const data: MonoStatusResponse = await monoRes.json();

		if (data.status === "success") {
			// Проводим покупку (превращаем holds в активные слоты) и закрываем заказ
			await completePaidOrder(order.id, hasLocale(locale ?? "") ? locale : "en");
			return NextResponse.json({ status: data.status });
		}

		if (
			data.status === "failure" ||
			data.status === "expired" ||
			data.status === "reversed"
		) {
			// Отмечаем заказ отменённым; при необходимости — освободи брони
			await prisma.order.update({
				where: { id: order.id },
				data: { status: "CANCELED" },
			});
			// TODO: releaseHolds(order.slotHold)
			return NextResponse.json({ status: data.status });
		}

		// Промежуточные статусы — просто синхронизируемся
		if (data.status === "processing" || data.status === "hold") {
			if (order.status !== "PROCESSING") {
				await prisma.order.update({
					where: { id: order.id },
					data: { status: "PROCESSING" },
				});
			}
			return NextResponse.json({ status: data.status });
		}

		// created (ожидание оплаты) — возвращаем как есть
		if (data.status === "created") {
			if (order.status !== "PENDING") {
				await prisma.order.update({
					where: { id: order.id },
					data: { status: "PENDING" },
				});
			}
			return NextResponse.json({ status: data.status });
		}

		// На всякий случай: неизвестный статус
		return NextResponse.json({ status: data.status ?? "unknown" });
	} catch (e) {
		console.error("reconcile-order error", e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
