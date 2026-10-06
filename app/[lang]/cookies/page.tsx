import type { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';

export async function generateMetadata({ params }: PageProps<'/[lang]/cookies'>): Promise<Metadata> {
  const { lang } = await params
  const canonicalUrl = `https://frog-energy.com/${lang}/cookies`;
  return {
    title: 'Cookie Policy | Frog Energy',
    description: 'Read our policy on how Frog Energy uses cookies and other tracking technologies to provide the best service and functionality.',
    robots: { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Static text only, so a Server Component (temp used a Client Component just for useI18n)
export default async function CookiesPage() {
	const t = await getDictionary()

	return (
		<main className="max-w-screen-lg mx-auto px-6 py-10 text-muted-foreground">
			<header className="mb-2">
				<h1 className="text-md font-bold tracking-tight">{t.cookies.title}</h1>
				<p className="text-sm text-muted-foreground">{t.cookies.intro}</p>
			</header>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.cookies.what.title}</h2>
				<p>{t.cookies.what.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.cookies.types.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.cookies.types.i1}</li>
					<li>{t.cookies.types.i2}</li>
					<li>{t.cookies.types.i3}</li>
					<li>{t.cookies.types.i4}</li>
				</ul>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.cookies.list.title}</h2>
				<p>{t.cookies.list.body}</p>
				<ul className="list-disc list-inside">
					<li>{t.cookies.list.i1}</li>
					<li>{t.cookies.list.i2}</li>
					<li>{t.cookies.list.i3}</li>
					<li>{t.cookies.list.i4}</li>
					<li>{t.cookies.list.i5}</li>
				</ul>
				<p className="text-xs text-muted-foreground">{t.cookies.list.note}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.cookies.consent.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.cookies.consent.i1}</li>
					<li>{t.cookies.consent.i2}</li>
					<li>{t.cookies.consent.i3}</li>
				</ul>
				<p className="text-xs text-muted-foreground">{t.cookies.consent.note}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.cookies.manage.title}</h2>
				<p>{t.cookies.manage.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.cookies.thirdparty.title}</h2>
				<p>{t.cookies.thirdparty.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.cookies.retention.title}</h2>
				<p>{t.cookies.retention.body}</p>
			</section>

			<footer className="pt-4 text-xs text-muted-foreground">
				<p>{t.cookies.updates}</p>
				<p className="mt-1">{t.cookies.contact}</p>
			</footer>
		</main>
	)
}
