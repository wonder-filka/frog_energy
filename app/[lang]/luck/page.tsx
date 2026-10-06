import type { Metadata } from 'next'
import { BoardPage, boardMetadata } from '../_components/board-page'

export async function generateMetadata({ params }: PageProps<'/[lang]/luck'>): Promise<Metadata> {
  const { lang } = await params
  return boardMetadata('luck', lang, {
    title: 'Luck Board: Attract Good Fortune & Serendipity | Frog Energy',
    description: 'Boost your luck and attract favorable coincidences. Place your message on the Luck Board to increase your chances of success and happy outcomes.',
  })
}

export default function Page() {
  return <BoardPage variant='luck' />
}
