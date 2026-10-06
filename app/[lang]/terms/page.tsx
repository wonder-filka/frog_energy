import type { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';

export async function generateMetadata({ params }: PageProps<'/[lang]/terms'>): Promise<Metadata> {
  const { lang } = await params
	const canonicalUrl = `https://frog-energy.com/${lang}/terms`;

  return {
    title: 'Terms of Service | User Agreement & Rules | Frog Energy',
    description: 'Review the official Frog Energy Terms of Service. This document governs usage rules, content guidelines, payment conditions, and refunds.',
    robots: { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Static text only, so a Server Component (temp used a Client Component just for useI18n)
export default async function TermsPage() {
	const t = await getDictionary()

	return (
		<main className="max-w-screen-lg mx-auto px-6 py-10 text-muted-foreground">
			<header className="mb-2 ">
				<h1 className="text-md font-bold tracking-tight">
					{t.terms.title}
				</h1>
				<p className="text-sm text-muted-foreground">{t.terms.intro}</p>
			</header>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.operator.title}</h2>
				<p>{t.terms.operator.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.age.title}</h2>
				<p>{t.terms.age.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.public.title}</h2>
				<p>{t.terms.public.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.content.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.terms.content.i1}</li>
					<li>{t.terms.content.i2}</li>
					<li>{t.terms.content.i3}</li>
					<li>{t.terms.content.i4}</li>
					<li>{t.terms.content.i5}</li>
				</ul>
				<p className="text-xs text-muted-foreground">{t.terms.content.note}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.booking.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.terms.booking.i1}</li>
					<li>{t.terms.booking.i2}</li>
					<li>{t.terms.booking.i3}</li>
				</ul>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.pricing.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.terms.pricing.i1}</li>
					<li>{t.terms.pricing.i2}</li>
					<li>{t.terms.pricing.i3}</li>
				</ul>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.streams.title}</h2>
				<p>{t.terms.streams.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.refunds.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.terms.refunds.i1}</li>
					<li>{t.terms.refunds.i2}</li>
					<li>{t.terms.refunds.i3}</li>
				</ul>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.disclaimer.title}</h2>
				<p>{t.terms.disclaimer.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.ip.title}</h2>
				<p>{t.terms.ip.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.complaints.title}</h2>
				<p>{t.terms.complaints.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.terms.law.title}</h2>
				<p>{t.terms.law.body}</p>
			</section>

			<footer className="pt-4 text-xs text-muted-foreground">
				{t.terms.changes}
			</footer>
		</main>
	)
}
