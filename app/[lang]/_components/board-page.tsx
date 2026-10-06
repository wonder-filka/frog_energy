import type { Metadata } from 'next'
import { getDictionary, getLocale } from '@/get-dictionary'
import { boardDict } from '@/lib/board-dict'
import { getSessionUserId } from '@/lib/session'
import type { Variant } from '@/lib/types'
import { getBoardAssignments } from '../_actions'
import { DashboardComponents } from './dashboard-component'

// Shared by /money, /love, /luck, /soul and /dream
export const BoardPage = async ({ variant }: { variant: Variant }) => {
  const [t, locale, userId, assignments] = await Promise.all([
    getDictionary(),
    getLocale(),
    getSessionUserId(),
    getBoardAssignments(variant),
  ])

  return (
    <DashboardComponents
      userId={userId}
      assignments={assignments}
      variant={variant}
      t={boardDict(t, variant)}
      locale={locale}
    />
  )
}

export const boardMetadata = (
  variant: Variant,
  lang: string,
  { title, description }: { title: string, description: string }
): Metadata => ({
  title,
  description,
  alternates: {
    canonical: `https://frog-energy.com/${lang}/${variant}`,
  },
})
