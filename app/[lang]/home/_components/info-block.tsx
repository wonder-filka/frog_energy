import Link from 'next/link'
import { Mail, Music2, Send } from 'lucide-react'
import { InstagramIcon } from '../../components/icons/instagram'
import { Button } from '../../components/ui/button'
import { ContactTelegramClient } from '../../contact/_components/contact-client'
import { ContactCard } from '../../contact/_components/contact-card'
import { CONTACTS } from '@/lib/constants'
import type { HomeDict } from '../_dict'
import type { Locale } from '@/i18n-config'

export interface InfoComponentProps {
  nextBroadcast: string
  prevBroadcast: string
  weekTopic: string
  t: HomeDict["info"]
  locale: Locale
}

export const InfoComponent = ({ nextBroadcast, prevBroadcast, weekTopic, t, locale }: InfoComponentProps) => {
  return (
    <section className="w-full text-white mt-6 pb-12 max-w-3xl">
      <div className="space-y-10">
        {/* Announcements */}
        <section aria-labelledby="announcements-title">
          <h2 id="announcements-title" className="text-2xl font-bold mb-4">
            {t.announcementsTitle}
          </h2>
          <ul className="space-y-2 text-gray-300 list-none pl-0">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t.nextBroadcast} <span className='font-bold'>{nextBroadcast}</span></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t.prevBroadcast} <span className='font-bold'>{prevBroadcast}</span></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t.weekTopic} <span className='font-bold'>{weekTopic}</span></span>
            </li>
          </ul>
        </section>

        {/* Energy & Shop */}
        <section aria-labelledby="energy-title" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 id="energy-title" className="text-2xl font-bold mb-4">
              {t.energyTitle}
            </h2>
            <p className="text-gray-300 mb-4">{t.energyBody}</p>
            <Button variant="link" className="text-blue-400 underline hover:text-blue-300 p-0">
              {t.comingSoon}
            </Button>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">{t.shopTitle}</h2>
            <p className="text-gray-300 mb-4">{t.shopBody}</p>
            <Button variant="link" className="text-blue-400 underline hover:text-blue-300 p-0">
              {t.comingSoon}
            </Button>
          </div>
        </section>

        {/* Community */}
        <section aria-labelledby="community-title" className='flex flex-col gap-4'>
          <h2 id="community-title" className="text-2xl font-bold mb-2">
            {t.communityTitle}
          </h2>
          <ContactTelegramClient />
          <ContactCard title="Instagram" value={`${CONTACTS.instagram}`} Icon={InstagramIcon} href={`https://www.instagram.com/${CONTACTS.instagram}`} />
          <ContactCard title="TikTok" value={`${CONTACTS.tiktok}`} Icon={Music2} href={`https://www.tiktok.com/@${CONTACTS.tiktok}`} />
        </section>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            {t.getInTouch}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ContactCard title="Telegram Admin" value={`${CONTACTS.telegram}`} Icon={Send} href={`https://t.me/${CONTACTS.telegram}`} />
            <ContactCard title="E‑mail" value={CONTACTS.email} Icon={Mail} href={`mailto:${CONTACTS.email}`} />
          </div>
        </div>
        {/* Settings */}
        <section aria-labelledby="settings-title">
          <h2 id="settings-title" className="text-xl font-semibold mb-4">
            {t.settingsTitle}
          </h2>
          <Link href={`/${locale}/settings`} className="underline hover:text-blue-300 text-muted-foreground">
            {t.settingsLink}
          </Link>
        </section>
      </div>
    </section>
  )
}
