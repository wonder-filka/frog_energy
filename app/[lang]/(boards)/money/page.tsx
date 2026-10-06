import type { Metadata } from 'next'
import { BoardPage, boardMetadata } from '../_components/board-page'

export async function generateMetadata({ params }: PageProps<'/[lang]/money'>): Promise<Metadata> {
  const { lang } = await params
  return boardMetadata('money', lang, {
    title: 'Prosperity Board: Attract Money, Career & Income | Frog Energy',
    description: 'Manifest financial success, career growth, and new income streams on the public Prosperity Board. Post your intentions and let the Frog Energy charge your goals.',
  })
}

export default function Page() {
  return <BoardPage variant='money' />
}
