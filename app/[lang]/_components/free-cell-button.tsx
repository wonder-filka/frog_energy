'use client'

import { Button } from "../components/ui/button"
import { cn } from "@/lib/utils"

interface FreeCellButtonProps {
	n: number
	arrKey: string
	onClick: (n: number) => void
}

export const FreeCellButton = ({ n, arrKey, onClick }: FreeCellButtonProps) => {
	return (
		<Button
			variant="link"
			id={`cell-${n}`}
			className={cn(
				'p-2 flex flex-col items-center justify-center gap-2 rounded-md h-auto min-h-42 md:h-42 border transition cursor-pointer hover:no-underline text-white',
				arrKey
			)}
			onClick={() => onClick(n)}
		>
			<div className="text-pretty break-all text-center">{n}</div>
		</Button>
	)
}