'use client'

import { Button } from "../components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
	page: number
	totalPages: number
	onPrev: () => void
	onNext: () => void
	onGo: (p: number) => void
	activeClass?: string
	outlineClass?: string
}

export const Pagination = ({
	page,
	totalPages,
	onPrev,
	onNext,
	onGo,
	activeClass,
	outlineClass,
}: PaginationProps) => {
	return (
		<div className="flex items-center flex-wrap justify-center gap-2 mt-4">
			<Button type="button" variant="outline" className="cursor-pointer" disabled={page === 1} onClick={onPrev}>
				Prev
			</Button>


			{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
				<Button
					key={p}
					type="button"
					variant={p === page ? 'default' : 'outline'}
					className={p === page ? cn('text-black cursor-pointer', activeClass) : cn('cursor-pointer', outlineClass)}
					onClick={() => onGo(p)}
				>
					{p}
				</Button>
			))}


			<Button
				type="button"
				variant="outline"
				className="cursor-pointer"
				disabled={page === totalPages}
				onClick={onNext}
			>
				Next
			</Button>
		</div>
	)
}