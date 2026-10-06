'use client'

import { MoveUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

export const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false)

	const toggleVisibility = () => {
		setIsVisible(window.scrollY > 300)
	}

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility)

		return () => window.removeEventListener('scroll', toggleVisibility)
	}, [])

	return (
		<div className='fixed bottom-24 md:bottom-12 right-4'>
			{isVisible && (
				<Button size='icon' className='rounded-full shadow-md bg-transparent border border-white' onClick={scrollToTop}>
					<MoveUp />
				</Button>
			)}
		</div>
	)
}
