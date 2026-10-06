'use client'

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlotCard } from "./slot-card";
import { AnySlot, Variant } from "@/lib/types";
import type { HomeDict } from "../_dict";
import type { Locale } from "@/i18n-config";
import { Button } from "../../components/ui/button";

type SlotItem = AnySlot & { variant: Variant }

export interface SlotsProps {
  length: number
  active: SlotItem[]
  expired: SlotItem[]
  t: HomeDict["slots"]
  locale: Locale
}

const PAGE_SIZE = 3;

export const SlotsComponent = ({ length, active, expired, t, locale }: SlotsProps) => {
  // сортируем истёкшие по дате окончания (самые последние сверху)
  const expiredSorted = useMemo(
    () =>
      [...expired].sort(
        (a, b) =>
          new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime()
      ),
    [expired]
  )

  // сколько истёкших сейчас показываем
  const [visibleExpired, setVisibleExpired] = useState(PAGE_SIZE)

  // если список обновился (например, пришли новые данные) — сбрасываем пагинацию
  // (во время рендера, а не в эффекте — без лишнего рендера)
  const [prevExpiredCount, setPrevExpiredCount] = useState(expiredSorted.length)
  if (expiredSorted.length !== prevExpiredCount) {
    setPrevExpiredCount(expiredSorted.length)
    setVisibleExpired(PAGE_SIZE)
  }

  const expiredSlice = useMemo(
    () => expiredSorted.slice(0, visibleExpired),
    [expiredSorted, visibleExpired]
  )

  const canShowMore = visibleExpired < expiredSorted.length

  const handleShowMore = () => {
    setVisibleExpired((v) => Math.min(v + PAGE_SIZE, expiredSorted.length))
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className='text-2xl font-bold '>
        {t.title}
      </div>

      {(length === 0 || active.length === 0) && (
        <div className="p-12 border rounded-xl flex gap-4 flex-col justify-center items-center min-h-84">
          <div className='text-2xl font-semibold'>{t.empty}</div>
          <p className="text-sm text-muted-foreground">{t.emptySubtitle}</p>
          <Button variant="default" className="my-2 text-black" nativeButton={false} render={<Link href={`/${locale}/buy`} />}>
            {t.newCell}
          </Button>
        </div>
      )}

      {/* Активные */}
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {active.length > 0 && active.map((s) => (
          <SlotCard
            key={s.id}
            slot={s}
            variant={s.variant}
            active={true}
            t={t}
            locale={locale}
          />
        ))}
      </div>

      {/* мини-индикатор: показано X из Y */}
      {expiredSorted.length > 0 && (
        <div className="flex items-center justify-between">
          <div className='text-2xl font-bold'>{t.expired}</div>
          <div className="text-sm text-muted-foreground">
            {t.shown} {expiredSlice.length} {t.of} {expiredSorted.length}
          </div>
        </div>
      )}

      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {expiredSlice.length > 0 && expiredSlice.map((s) => (
          <SlotCard
            key={s.id}
            slot={s}
            variant={s.variant}
            active={false}
            t={t}
            locale={locale}
          />
        ))}
        {canShowMore && (
          <div className="flex justify-center items-center  h-full min-h-36">
            <Button onClick={handleShowMore} variant="link">
              {t.showMore}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
