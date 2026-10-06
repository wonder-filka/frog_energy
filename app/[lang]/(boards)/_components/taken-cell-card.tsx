'use client'

import { Assignment, Variant } from "@/lib/types"
import { VariantStyle } from "@/lib/constants"
import type { BoardDict } from "../_dict"
import type { Locale } from "@/i18n-config"
import { cn } from "@/lib/utils"
import { HeartIcon } from "lucide-react"
import { useState, useTransition } from "react"
import {
	Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../../components/ui/dialog'
import { Button } from "../../components/ui/button"
import { useRouter } from "next/navigation"
import { toggleLike } from "../../_actions"

interface TakenCellCardProps {
	n: number
	a: Assignment
	isMine: boolean
	styles: VariantStyle
	userId?: string | null
	variant: Variant
	t: BoardDict
	locale: Locale
}

export const TakenCellCard = ({
	n,
	a,
	isMine,
	styles,
	userId,
	variant,
	t,
	locale,
}: TakenCellCardProps) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [like, setLike] = useState({ likedByMe: a.likedByMe, likes: a.likes })

	const handleToggleLike = (slotId: string) => {
		if (!userId) {
			setShowAuthModal(true)
			return
		}
		startTransition(async () => {
			const res = await toggleLike(slotId, variant)
			if (!res.ok) {
				setShowAuthModal(true)

				return
			}
			setLike({ likedByMe: res.liked, likes: res.likes })
		})
	}


	return (
		<div
			id={`cell-${n}`}
			className={cn(
				(a || isMine) && styles.glowCls,
				'relative p-4 flex flex-col items-center justify-center gap-2 rounded-md h-auto min-h-42 md:h-42 border transition',
				isMine && 'cursor-pointer',
				!a && styles.arrKey
			)}
			onClick={(e) => {
				e.stopPropagation()
				if (isMine) router.push(`/${locale}/home`);
			}}
		>
			<div className="text-pretty break-all text-center">
				{n}
				{a ? `. ${a?.userName ?? ''}` : ''}
			</div>


			<div className="text-sm text-pretty break-all text-center">{a?.userText ?? ''}</div>

			<div className="absolute bottom-2 right-2 w-full flex justify-end">
				<Button
					variant="ghost"
					disabled={isPending}
					aria-pressed={like.likedByMe}
					onClick={(e) => {
						e.stopPropagation()
						handleToggleLike(a.id)
					}
					}
					className={cn(
						'p-0 inline-flex items-center gap-1',
						'rounded  text-xs select-none transition',
						'hover:bg-white/10 focus:outline-none cursor-pointer'
					)}
					title={like.likedByMe ? t.unlike : t.like}
				>
					<HeartIcon
						className={cn(
							'h-4 w-4',
							like.likedByMe ? `fill-current ${styles.sort2}` : styles.sort2
						)}
					/>
					<span>{like.likes}</span>
				</Button>
			</div>
			<Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t.authRequired}</DialogTitle>
						<DialogDescription>
							{t.likeNeedsLogin}
						</DialogDescription>
					</DialogHeader>

					<DialogFooter className="gap-4">
						<Button onClick={() => router.push(`/${locale}/login`)} variant="outline">
							{t.login}
						</Button>
						<Button onClick={() => router.push(`/${locale}/registration`)}>
							{t.register}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
