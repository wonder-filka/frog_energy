import type { Metadata } from 'next'
import { BoardPage, boardMetadata } from '../_components/board-page'

export async function generateMetadata({ params }: PageProps<'/[lang]/dream'>): Promise<Metadata> {
  const { lang } = await params
  return boardMetadata('dream', lang, {
    title: 'Dream Board: Visualize & Manifest Your Goals | Frog Energy',
    description: 'Turn your dreams and goals into reality. Post your future desires on the Dream Board and utilize Frog Energy to manifest your highest intentions.',
  })
}

export default function Page() {
  return <BoardPage variant='dream' />
}
