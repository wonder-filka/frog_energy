import type { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';

export async function generateMetadata({ params }: PageProps<'/[lang]/privacy'>): Promise<Metadata> {
  const { lang } = await params
	const canonicalUrl = `https://frog-energy.com/${lang}/privacy`;

  return {
    title: 'Privacy Policy | Data Protection & User Rights | Frog Energy',
    description: 'Read the official Frog Energy Privacy Policy. Learn how we collect, use, and protect your personal data, including information related to purchases and board posts.',
    robots: { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl, 
    },
  };
}

// Static text only, so a Server Component (temp used a Client Component just for useI18n)
export default async function PrivacyPage() {
	const t = await getDictionary()

	return (
		<main className="max-w-screen-lg mx-auto px-6 py-10 text-muted-foreground">
			<header className="mb-2">
				<h1 className="text-md font-bold tracking-tight">{t.privacy.title}</h1>
				<p className="text-sm text-muted-foreground">{t.privacy.intro}</p>
			</header>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.controller.title}</h2>
				<p>{t.privacy.controller.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.scope.title}</h2>
				<p>{t.privacy.scope.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.data.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.privacy.data.i1}</li>
					<li>{t.privacy.data.i2}</li>
					<li>{t.privacy.data.i3}</li>
					<li>{t.privacy.data.i4}</li>
					<li>{t.privacy.data.i5}</li>
				</ul>
				<p className="text-xs text-muted-foreground">{t.privacy.data.note}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.purpose.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.privacy.purpose.i1}</li>
					<li>{t.privacy.purpose.i2}</li>
					<li>{t.privacy.purpose.i3}</li>
					<li>{t.privacy.purpose.i4}</li>
					<li>{t.privacy.purpose.i5}</li>
					<li>{t.privacy.purpose.i6}</li>
					<li>{t.privacy.purpose.i7}</li>
				</ul>
				<p className="text-xs text-muted-foreground">{t.privacy.purpose.bases}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.cookies.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.privacy.cookies.i1}</li>
					<li>{t.privacy.cookies.i2}</li>
					<li>{t.privacy.cookies.i3}</li>
					<li>{t.privacy.cookies.i4}</li>
					<li>{t.privacy.cookies.i5}</li>
				</ul>
				<p className="text-xs text-muted-foreground">{t.privacy.cookies.note}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.sharing.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.privacy.sharing.i1}</li>
					<li>{t.privacy.sharing.i2}</li>
					<li>{t.privacy.sharing.i3}</li>
					<li>{t.privacy.sharing.i4}</li>
					<li>{t.privacy.sharing.i5}</li>
				</ul>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.transfers.title}</h2>
				<p>{t.privacy.transfers.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.retention.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.privacy.retention.i1}</li>
					<li>{t.privacy.retention.i2}</li>
					<li>{t.privacy.retention.i3}</li>
					<li>{t.privacy.retention.i4}</li>
				</ul>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.rights.title}</h2>
				<ul className="list-disc list-inside">
					<li>{t.privacy.rights.i1}</li>
					<li>{t.privacy.rights.i2}</li>
					<li>{t.privacy.rights.i3}</li>
					<li>{t.privacy.rights.i4}</li>
					<li>{t.privacy.rights.i5}</li>
					<li>{t.privacy.rights.i6}</li>
				</ul>
				<p className="text-xs text-muted-foreground">{t.privacy.rights.note}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.children.title}</h2>
				<p>{t.privacy.children.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.security.title}</h2>
				<p>{t.privacy.security.body}</p>
			</section>

			<section className="text-xs">
				<h2 className="text-xs font-semibold">{t.privacy.contact.title}</h2>
				<p>{t.privacy.contact.body}</p>
			</section>

			<footer className="pt-4 text-xs text-muted-foreground">
				{t.privacy.changes}
			</footer>
		</main>
	)
}
