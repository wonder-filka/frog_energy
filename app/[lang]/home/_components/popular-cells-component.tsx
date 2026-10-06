'use client'

import { PopularCell } from "@/lib/types"
import type { HomeDict } from "@/lib/home-dict"
import type { Locale } from "@/i18n-config"
import { PopularCellComponent } from "./popular-cell"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../../components/ui/carousel"

export interface PopularCellsProps {
	cells: PopularCell[]
	userId?: string | null
	t: HomeDict["popular"]
	locale: Locale
}

export const PopularCellsComponent = ({ cells, userId, t, locale }: PopularCellsProps) => {
	if (cells.length === 0) return (
		<div className="text-sm text-muted-foreground">
			{t.empty}
		</div>
	)
	return (
		<section aria-labelledby="popular-cells-title" className="flex flex-col gap-4 w-full h-full rounded">
			<h2 id="popular-cells-title" className="text-2xl font-bold mb-4">{t.title}</h2>
			<div className="px-12">
				<Carousel opts={{ align: "start" }} className="w-full h-full">
					<CarouselContent className="h-full">
						{cells.map((cell) => (
							<CarouselItem key={cell.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 h-full " >
								<PopularCellComponent cell={cell} userId={userId} t={t} locale={locale} />
							</CarouselItem>

						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</section >
	)
}
