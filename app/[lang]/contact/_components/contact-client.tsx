'use client'

import Link from 'next/link'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../components/ui/select"
import { useState } from 'react'
import { CopyButton } from '../../components/copy-button'
import { Send } from 'lucide-react'

const TELEGRAM_CHANNELS = {
	en: { url: 'https://t.me/frog_energyy', handle: '@frog_energyy' },
	fr: { url: 'https://t.me/frog_energy_fr', handle: '@frog_energy_fr' },
	es: { url: 'https://t.me/frog_energy_es', handle: '@frog_energy_es' },
	pt: { url: 'https://t.me/frog_energy_pt', handle: '@frog_energy_pt' },
	de: { url: 'https://t.me/frog_energy_de', handle: '@frog_energy_de' },
	ua: { url: 'https://t.me/frog_energy_ua', handle: '@frog_energy_ua' },
	ru: { url: 'https://t.me/frog_energy_ru', handle: '@frog_energy_ru' },
} as const

// Base UI's SelectValue shows labels from `items` (otherwise it would show "en")
const CHANNEL_LABELS: Record<keyof typeof TELEGRAM_CHANNELS, string> = {
	en: 'Telegram: English',
	fr: 'Telegram: Français',
	es: 'Telegram: Español',
	pt: 'Telegram: Português',
	de: 'Telegram: Deutsch',
	ua: 'Telegram: Українська',
	ru: 'Telegram: Русский',
}

export const ContactTelegramClient = () => {
	const [selectedLanguage, setSelectedLanguage] = useState<string>("en")

	const selectedChannel = TELEGRAM_CHANNELS[selectedLanguage as keyof typeof TELEGRAM_CHANNELS]
	return (
		<div className="flex items-start flex-col group">
			<Select items={CHANNEL_LABELS} onValueChange={(value) => value && setSelectedLanguage(value)} value={selectedLanguage}>
				<SelectTrigger className="text-sm !min-h-0 !h-6 border-0 text-slate-500 dark:text-slate-400 bg-transparent p-0 w-auto min-w-[150px] hover:text-white hover:bg-transparent dark:hover:bg-transparent cursor-pointer focus:ring-0">
					<Send className="h-4 w-4 " />
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{Object.entries(CHANNEL_LABELS).map(([value, label]) => (
							<SelectItem key={value} value={value}>{label}</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{selectedChannel && (
				<div className="text-md font-semibold p-0 flex items-center gap-1 text-blue-400">
					<Link href={selectedChannel.url} target="_blank" className="underline hover:text-blue-300">
						{selectedChannel.url.replace('https://t.me/', '')}
					</Link>
					<CopyButton text={selectedChannel.handle} ariaLabel={`Copy ${selectedLanguage} Telegram channel link`} />
				</div>
			)}
		</div>
	)
}
