import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { completePaidOrder } from "@/lib/orders";
import { verifyPlataWebhookSignature } from "@/lib/plata";
import { hasLocale } from "@/i18n-config";

type WebhookBody = {
	invoiceId: string;
	status: "created" | "processing" | "success" | "failure" | "expired" | string;
	amount?: number;
	modifiedDate?: number; // unix ms — можно использовать для идемпотентности
	merchantPaymInfo?: { reference?: string };
};

export async function POST(req: NextRequest) {
	try {
		const rawBody = await req.text();
		const signature = req.headers.get("x-sign");

		const isValid = await verifyPlataWebhookSignature(rawBody, signature);
		if (!isValid) {
			console.error("Webhook signature verification failed");
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const body = JSON.parse(rawBody) as WebhookBody;
		const { invoiceId, status } = body;

		if (!invoiceId || !status) {
			return NextResponse.json({ ok: true }); // игнорим мусор
		}

		const order = await prisma.order.findFirst({
			where: { paymentId: invoiceId },
			include: { slotHold: true },
		});

		if (!order) {
			return NextResponse.json({ ok: true });
		}

		// Идемпотентность: если уже PAID — просто ОК
		if (order.status === "PAID") {
			return NextResponse.json({ ok: true });
		}

		if (status === "hold" || status === "processing") {
			await prisma.order.update({
				where: { id: order.id },
				data: { status: "PROCESSING" },
			});
			return NextResponse.json({ ok: true });
		}

		if (status === "success") {
			// Set by create-payment; picks the confirmation email language
			const localeParam = req.nextUrl.searchParams.get("locale") ?? "";
			await completePaidOrder(order.id, hasLocale(localeParam) ? localeParam : "en");
			return NextResponse.json({ ok: true });
		}

		if (
			status === "failure" ||
			status === "expired" ||
			status === "reversed" ||
			status === "canceled"
		) {
			await prisma.order.update({
				where: { id: order.id },
				data: { status: "CANCELED" },
			});
			await prisma.slotHold.deleteMany({
				where: { id: { in: order.slotHold.map((h) => h.id) } },
			});

			return NextResponse.json({ ok: true });
		}

		return NextResponse.json({ ok: true });
	} catch (e) {
		console.error("Webhook error", e);

		return NextResponse.json({ ok: true });
	}
}
