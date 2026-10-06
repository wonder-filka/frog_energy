import type { Metadata } from 'next';
import { Mail, Send, Music2 } from 'lucide-react';
import { getDictionary } from '@/get-dictionary';
import { CONTACTS } from '@/lib/constants';
import { InstagramIcon } from '../components/icons/instagram';
import { ContactCard } from './_components/contact-card';
import { ContactTelegramClient } from './_components/contact-client';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
	const { lang } = await params
	const canonicalUrl = `https://frog-energy.com/${lang}/contact`;
	return {
		title: 'Contacts | Frog Energy',
		description: 'Get in touch with Frog Energy. Contact us via email, Telegram, TikTok, or Instagram.',
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title: 'Contacts | Frog Energy',
			description: 'Get in touch with Frog Energy',
			url: canonicalUrl,
		},
	};
}

export default async function ContactsPage() {
	const t = await getDictionary()

	return (
		<main className="flex flex-col gap-6 p-6 md:p-8 max-w-screen-xl mx-auto w-full">
			<header className="flex items-center justify-between">
				<div className='flex flex-col gap-2'>
					<h1 className="text-3xl font-bold">
						{t.footer.links.contact}
					</h1>
					<p className='font-semibold text-muted-foreground text-md'>
						{t.contact.description}
					</p>
				</div>
			</header>

			<section className='border p-4 rounded-xl' aria-labelledby="contact-heading">
				<h2 id="contact-heading" className="text-2xl font-bold mb-6">
					{t.contact.getInTouch}
				</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<ContactCard
						title="Telegram Admin"
						value={`${CONTACTS.telegram}`}
						Icon={Send}
						href={`https://t.me/${CONTACTS.telegram}`}
					/>
					<ContactCard
						title="E‑mail"
						value={CONTACTS.email}
						Icon={Mail}
						href={`mailto:${CONTACTS.email}`}
					/>
				</div>
			</section>

			<section className='border p-4 rounded-xl' aria-labelledby="social-heading">
				<h2 id="social-heading" className="text-2xl font-bold mb-6">
					{t.footer.sections.social.title}
				</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<ContactCard
						title="TikTok"
						value={`${CONTACTS.tiktok}`}
						Icon={Music2}
						href={`https://www.tiktok.com/@${CONTACTS.tiktok}`}
					/>
					<ContactCard
						title="Instagram"
						value={`${CONTACTS.instagram}`}
						Icon={InstagramIcon}
						href={`https://www.instagram.com/${CONTACTS.instagram}`}
					/>
					<ContactTelegramClient />
				</div>
			</section>
		</main>
	);
}
