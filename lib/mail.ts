// lib/mail.ts
import nodemailer, { type Transporter } from "nodemailer";
import type { Locale } from "@/i18n-config";
import type { SlotKind } from "@/app/generated/prisma/client";

let transporter: Transporter | null = null;

function getTransporter() {
	if (transporter) return transporter;

	const host = process.env.SMTP_HOST!;
	const port = Number(process.env.SMTP_PORT || 465);
	const user = process.env.SMTP_USER!;
	const pass = process.env.SMTP_PASS!;
	const secure = port === 465 || process.env.SMTP_SECURE === "true";

	transporter = nodemailer.createTransport({
		host,
		port,
		secure,
		auth: { user, pass },
		authMethod: "LOGIN",
		requireTLS: true,
		tls: {
			servername: process.env.SMTP_HOST,
		},
		name: "frog-energy.com",
		logger: process.env.NODE_ENV !== "production",
		debug: process.env.NODE_ENV !== "production",
	});

	return transporter;
}

function buildTemplates(code: string, locale: Locale) {
	const dict = {
		ru: {
			subject: "Код для сброса пароля",
			intro: "Ваш код для сброса пароля:",
			validity: "Код действителен 10 минут.",
			ignore: "Если вы не запрашивали сброс, просто игнорируйте это письмо.",
		},
		en: {
			subject: "Password reset code",
			intro: "Your password reset code:",
			validity: "The code is valid for 10 minutes.",
			ignore: "If you did not request a reset, please ignore this email.",
		},
		es: {
			subject: "Código para restablecer la contraseña",
			intro: "Tu código para restablecer la contraseña:",
			validity: "El código es válido durante 10 minutos.",
			ignore:
				"Si no solicitaste el restablecimiento, simplemente ignora este correo.",
		},
		pt: {
			subject: "Código de redefinição de senha",
			intro: "Seu código para redefinir a senha:",
			validity: "O código é válido por 10 minutos.",
			ignore: "Se você não solicitou a redefinição, ignore este e-mail.",
		},
		de: {
			subject: "Code zum Zurücksetzen des Passworts",
			intro: "Ihr Code zum Zurücksetzen des Passworts:",
			validity: "Der Code ist 10 Minuten lang gültig.",
			ignore:
				"Wenn Sie kein Zurücksetzen angefordert haben, ignorieren Sie bitte diese E-Mail.",
		},
		ua: {
			subject: "Код для скидання пароля",
			intro: "Ваш код для скидання пароля:",
			validity: "Код дійсний 10 хвилин.",
			ignore: "Якщо ви не запитували скидання, просто проігноруйте цей лист.",
		},
		fr: {
			subject: "Code pour réinitialiser le mot de passe",
			intro: "Votre code de réinitialisation de mot de passe :",
			validity: "Le code est valable 10 minutes.",
			ignore:
				"Si vous n'avez pas demandé de réinitialisation, veuillez ignorer cet e-mail.",
		},
	} as const;

	const t = dict[locale] ?? dict.ru;

	const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#0f172a; max-width:520px; margin:0 auto;">
    <h2 style="font-weight:600; margin:0 0 12px">${t.subject}</h2>
    <p style="margin:0 0 16px">${t.intro}</p>
    <div style="font-size:32px; letter-spacing:6px; font-weight:700; padding:12px 16px; text-align:center; border:1px solid #e2e8f0; border-radius:12px; background:#f8fafc; color:#111827;">
      ${code}
    </div>
    <p style="margin:16px 0 0">${t.validity}</p>
    <p style="margin:6px 0 0; color:#475569">${t.ignore}</p>
  </div>`.trim();

	const text = `${t.subject}\n\n${t.intro} ${code}\n${t.validity}\n${t.ignore}`;

	return { subject: t.subject, html, text };
}

export async function sendPasswordResetCode(
	email: string,
	code: string,
	locale: Locale
): Promise<boolean> {
	const from = process.env.SMTP_FROM || "Frog Energy <support@frog-energy.com>";
	const { subject, html, text } = buildTemplates(code, locale);

	try {
		await getTransporter().sendMail({
			from,
			to: email,
			subject,
			html,
			text,
		});
		return true;
	} catch (err) {
		console.error("sendPasswordResetCode error:", err);
		return false;
	}
}

type OrderItem = {
	variant: SlotKind;
	num?: number | null;
	days?: number | null;
	userText?: string | null;
	expiresAt?: string | Date | null;
};

const VARIANT_LABELS: Record<Locale, Record<OrderItem["variant"], string>> = {
	ru: {
		MONEY: "Достаток",
		LOVE: "Любовь",
		LUCK: "Удача",
		SOUL: "Душа",
		DREAM: "Желания",
	},
	en: {
		MONEY: "Prosperity",
		LOVE: "Love",
		LUCK: "Luck",
		SOUL: "Soul",
		DREAM: "Wishes",
	},
	es: {
		MONEY: "Prosperidad",
		LOVE: "Amor",
		LUCK: "Suerte",
		SOUL: "Alma",
		DREAM: "Deseos",
	},
	pt: {
		MONEY: "Prosperidade",
		LOVE: "Amor",
		LUCK: "Sorte",
		SOUL: "Alma",
		DREAM: "Desejos",
	},
	de: {
		MONEY: "Wohlstand",
		LOVE: "Liebe",
		LUCK: "Glück",
		SOUL: "Seele",
		DREAM: "Wünsche",
	},
	ua: {
		MONEY: "Достаток",
		LOVE: "Кохання",
		LUCK: "Удача",
		SOUL: "Душа",
		DREAM: "Бажання",
	},
	fr: {
		MONEY: "Prospérité",
		LOVE: "Amour",
		LUCK: "Chance",
		SOUL: "Âme",
		DREAM: "Souhaits",
	},
};

const ORDER_I18N: Record<
	Locale,
	{
		subject: (orderId: string) => string;
		thanks: string;
		details: string;
		total: string;
		cell: string;
		days: string;
		until: string;
		goBoards: string;
	}
> = {
	ru: {
		subject: (id) => `Оплата подтверждена · Заказ ${id}`,
		thanks: "Спасибо! Оплата прошла успешно.",
		details: "Детали заказа:",
		total: "Итого",
		cell: "Ячейка",
		days: "дн.",
		until: "до",
		goBoards: "Перейти к доскам",
	},
	en: {
		subject: (id) => `Payment confirmed · Order ${id}`,
		thanks: "Thank you! Your payment was successful.",
		details: "Order details:",
		total: "Total",
		cell: "Cell",
		days: "days",
		until: "until",
		goBoards: "Go to boards",
	},
	es: {
		subject: (id) => `Pago confirmado · Pedido ${id}`,
		thanks: "¡Gracias! El pago se realizó con éxito.",
		details: "Detalles del pedido:",
		total: "Total",
		cell: "Celda",
		days: "días",
		until: "hasta",
		goBoards: "Ir a los tableros",
	},
	pt: {
		subject: (id) => `Pagamento confirmado · Pedido ${id}`,
		thanks: "Obrigado! Pagamento realizado com sucesso.",
		details: "Detalhes do pedido:",
		total: "Total",
		cell: "Célula",
		days: "dias",
		until: "até",
		goBoards: "Ir para os quadros",
	},
	de: {
		subject: (id) => `Zahlung bestätigt · Bestellung ${id}`,
		thanks: "Danke! Ihre Zahlung war erfolgreich.",
		details: "Bestelldetails:",
		total: "Gesamt",
		cell: "Zelle",
		days: "Tage",
		until: "bis",
		goBoards: "Zu den Boards",
	},
	ua: {
		subject: (id) => `Оплату підтверджено · Замовлення ${id}`,
		thanks: "Дякуємо! Оплата пройшла успішно.",
		details: "Деталі замовлення:",
		total: "Разом",
		cell: "Комірка",
		days: "дн.",
		until: "до",
		goBoards: "Перейти до дощок",
	},
	fr: {
		subject: (id) => `Paiement confirmé · Commande ${id}`,
		thanks: "Merci ! Votre paiement a été effectué avec succès.",
		details: "Détails de la commande :",
		total: "Total",
		cell: "Cellule",
		days: "jours",
		until: "jusqu'au",
		goBoards: "Aller aux tableaux",
	},
};

function fmtUSD(n: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(n);
}

function safeDate(d?: string | Date | null) {
	if (!d) return "";
	const date = typeof d === "string" ? new Date(d) : d;
	if (isNaN(date.getTime())) return "";
	return date.toLocaleString();
}

function buildOrderSuccessTemplate(
	params: {
		orderId: string;
		amountUSD: number;
		items: OrderItem[];
		siteUrl?: string;
	},
	locale: Locale
) {
	const L = ORDER_I18N[locale] ?? ORDER_I18N.ru;
	const VAR = VARIANT_LABELS[locale] ?? VARIANT_LABELS.ru;

	const rows = params.items
		.map((it) => {
			const variant = VAR[it.variant];
			const num = it.num ?? "";
			const days = it.days ?? 1;
			const text = it.userText ? ` — ${it.userText}` : "";
			return `<li>${variant}: <strong>${L.cell} №${
				num || "—"
			}</strong>, ${days} ${L.days}${text}</li>`;
		})
		.join("");

	const subject = L.subject(params.orderId);

	const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#0f172a; max-width:620px; margin:0 auto;">
    <h2 style="font-weight:700; margin:0 0 10px">${subject}</h2>
    <p style="margin:0 0 12px">${L.thanks}</p>

    <h3 style="font-weight:600; margin:18px 0 8px">${L.details}</h3>
    <ul style="padding-left:18px; margin:0 0 12px; line-height:1.5">
      ${rows}
    </ul>

    <p style="margin:10px 0 0"><strong>${L.total}:</strong> ${fmtUSD(
		params.amountUSD
	)}</p>

    ${
			params.siteUrl
				? `<p style="margin:14px 0 0">
      <a href="${params.siteUrl}" style="display:inline-block; padding:10px 14px; background:#fbbf24; color:#111827; border-radius:10px; text-decoration:none; font-weight:600;">
        ${L.goBoards}
      </a>
    </p>`
				: ""
		}
  </div>`.trim();

	const text = [
		subject,
		"",
		L.thanks,
		"",
		L.details,
		...params.items.map((it) => {
			const variant = VAR[it.variant];
			const num = it.num ?? "";
			const days = it.days ?? 1;
			const until = safeDate(it.expiresAt);
			const text = it.userText ? ` — ${it.userText}` : "";
			const untilPart = until ? ` · ${L.until} ${until}` : "";
			return `- ${variant}: ${L.cell} №${num || "—"}, ${days} ${
				L.days
			}${untilPart}${text}`;
		}),
		"",
		`${L.total}: ${fmtUSD(params.amountUSD)}`,
		params.siteUrl ? `\n${L.goBoards}: ${params.siteUrl}` : "",
	].join("\n");

	return { subject, html, text };
}

export async function sendOrderSuccess(
	email: string,
	params: {
		orderId: string;
		amountUSD: number;
		items: OrderItem[];
		siteUrl?: string;
	},
	locale: Locale
): Promise<boolean> {
	const from = process.env.SMTP_FROM || "Frog Energy <support@frog-energy.com>";
	const { subject, html, text } = buildOrderSuccessTemplate(params, locale);

	try {
		await getTransporter().sendMail({ from, to: email, subject, html, text });
		return true;
	} catch (err) {
		console.error("sendOrderSuccess error:", err);
		return false;
	}
}
