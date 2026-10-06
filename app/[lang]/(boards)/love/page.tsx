import type { Metadata } from 'next'
import { BoardPage, boardMetadata } from '../_components/board-page'

export async function generateMetadata({ params }: PageProps<'/[lang]/love'>): Promise<Metadata> {
  const { lang } = await params
  return boardMetadata('love', lang, {
    title: 'Love Energy Board: Harmony, Relationships & Romance | Frog Energy',
    description: 'Find or strengthen love, harmony, and meaningful relationships. Share your intentions on the Love Energy Board and invite positive romance into your life.',
  })
}

export default function Page() {
  return <BoardPage variant='love' />
}
