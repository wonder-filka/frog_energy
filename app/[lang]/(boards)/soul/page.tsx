import type { Metadata } from 'next'
import { BoardPage, boardMetadata } from '../_components/board-page'

export async function generateMetadata({ params }: PageProps<'/[lang]/soul'>): Promise<Metadata> {
  const { lang } = await params
  return boardMetadata('soul', lang, {
    title: 'Soul Board: Inner Balance, Purpose & Gratitude | Frog Energy',
    description: 'Focus on spiritual well-being, inner balance, and finding purpose. Use the Soul Board to express gratitude and achieve deep emotional peace.',
  })
}

export default function Page() {
  return <BoardPage variant='soul' />
}
