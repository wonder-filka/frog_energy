'use client'

import { PopularCell, Variant } from "@/lib/types"
import { VARIANT_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { HomeDict } from "@/lib/home-dict"
import type { Locale } from "@/i18n-config"
import { HeartIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
	Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../../components/ui/dialog'
import { Button } from "../../components/ui/button"
import { useState, useTransition } from "react"
import { toggleMoneyLike } from "../../_actions"


export interface PopularCellsProps {
	cell: PopularCell
	userId?: string | null
	t: HomeDict["popular"]
	locale: Locale
}

export const PopularCellComponent = ({ cell, userId, t, locale }: PopularCellsProps) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [showAuthModal, setShowAuthModal] = useState(false)
	// Updated from the action result so the heart and count change right away
	const [like, setLike] = useState({ likedByMe: cell.likedByMe, likes: cell.likes })

	const handleToggleLike = (id: string, variant: Variant) => {
		if (!userId) {
			setShowAuthModal(true)
			return
		}
		startTransition(async () => {
			const res = await toggleMoneyLike(id, variant)
			if (!res.ok) {
				setShowAuthModal(true)
				return
			}
			setLike({ likedByMe: res.liked, likes: res.likes })
		})
	}
	const styles = VARIANT_STYLES[cell.variant as Variant]
	return (
		<>
			<div
				onClick={() => router.push(`/${locale}/${cell.variant}?searchNum=${cell.personalNum}`)}
				className={cn("h-full min-h-[200px] cursor-pointer relative p-4 border rounded flex flex-col", styles.arrKey
				)}>
				<div className="flex items-center gap-2 text-base font-semibold">
					{styles.icon}
					<span className="opacity-80">№</span>
					<span className="tabular-nums">{cell.personalNum}</span>
				</div>
				<div className="text-center flex-1 flex flex-col justify-center gap-2 mt-0 mb-2">
					<span className="text-center text-muted-foreground">{cell.userName}</span>
					<p className="min-h-10 text-center text-sm  text-pretty break-all ">
						{cell.userText || '—'}
					</p>
				</div>

				<div className="absolute bottom-0 right-0 flex justify-end">
					<Button
						variant="ghost"
						disabled={isPending}
						aria-pressed={like.likedByMe}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							handleToggleLike(cell.id, cell.variant as Variant)
						}
						}
						className={cn(
							'inline-flex items-center gap-1 cursor-pointer',
							'rounded  text-xs select-none transition',
							'hover:bg-white/10 focus:outline-none'
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
						<Button onClick={() => router.push(`/${locale}/registration`)} className="text-black">
							{t.register}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
