import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { hasLocale } from "@/i18n-config";

const PLATA_API_BASE_URL = process.env.PLATA_API_BASE_URL;
const PLATA_BY_MONO_TOKEN = process.env.PLATA_BY_MONO_TOKEN;
const USD_CCY_CODE = 840; // ISO 4217 для USD

interface CreatePaymentBody {
	itemsIds: string[];
	locale?: string;
}

interface MonoCreateInvoiceResponse {
	invoiceId: string;
	pageUrl: string; // URL для редиректа
	status: string;
}

export async function POST(request: NextRequest) {
	// Проверка токена
	if (!PLATA_BY_MONO_TOKEN || !PLATA_API_BASE_URL) {
		return NextResponse.json(
			{ error: "Missing environment variables (Token or Base URL)" },
			{ status: 500 }
		);
	}

	const userId = await getSessionUserId();
	if (!userId) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const data = (await request.json()) as CreatePaymentBody;
		const itemsIds = Array.isArray(data.itemsIds) ? data.itemsIds : [];
		if (itemsIds.length === 0) {
			return NextResponse.json({ error: "No items" }, { status: 400 });
		}
		// Route handlers can't read the [lang] segment, so the page sends it
		const locale = data.locale && hasLocale(data.locale) ? data.locale : "en";

		const holds = await prisma.slotHold.findMany({
			where: {
				id: { in: itemsIds },
				userId,
				status: "active",
				orderId: null,
			},
		});

		if (holds.length !== itemsIds.length) {
			return NextResponse.json(
				{ error: "Invalid or already used items" },
				{ status: 400 }
			);
		}

		const totalAmountUSD = holds.reduce((sum, hold) => sum + hold.days * 1.0, 0);

		const order = await prisma.order.create({
			data: {
				userId,
				amount: totalAmountUSD,
				currency: "USD",
				status: "PENDING",
				slotHold: {
					connect: holds.map((hold) => ({ id: hold.id })),
				},
			},
		});
		const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL!;

		const redirectUrl = `${origin}/${locale}/payment-return?orderId=${order.id}`;

		const amountInCents = Math.round(totalAmountUSD * 100);

		const requestBody = {
			amount: amountInCents,
			ccy: USD_CCY_CODE,
			redirectUrl,
			// locale is only used for the confirmation email language
			webHookUrl: `${origin}/api/plata-webhook?locale=${locale}`,
			validity: 600,
			paymentType: "debit",
			merchantPaymInfo: {
				reference: String(order.id),
				destination: "Оплата цифрового товару",
			},
		};

		// Запрос на создание счета в Plata by mono
		const monoResponse = await fetch(
			`${PLATA_API_BASE_URL}/api/merchant/invoice/create`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Token": PLATA_BY_MONO_TOKEN,
				},
				body: JSON.stringify(requestBody),
			}
		);

		if (!monoResponse.ok) {
			const errorText = await monoResponse.text();
			console.error("Mono API error:", errorText);
			return NextResponse.json(
				{ error: "Mono API failed", details: errorText },
				{ status: 500 }
			);
		}

		const monoData: MonoCreateInvoiceResponse = await monoResponse.json();
		await prisma.order.update({
			where: { id: order.id },
			data: {
				paymentId: monoData.invoiceId,
			},
		});

		return NextResponse.json({
			success: true,
			pageUrl: monoData.pageUrl,
		});
	} catch (error) {
		console.error("Error in create-payment:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
