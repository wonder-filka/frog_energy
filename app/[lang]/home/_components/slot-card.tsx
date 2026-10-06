'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HeartIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { Button } from '../../components/ui/button'
import { cn } from '@/lib/utils'
import { AnySlot, Variant } from '@/lib/types'
import { VARIANT_STYLES } from '@/lib/constants'
import type { HomeDict } from '@/lib/home-dict'
import type { Locale } from '@/i18n-config'
import { useHydrated } from '@/hooks/use-hydrated'


function msToParts(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSec / (24 * 3600))
  const hours = Math.floor((totalSec % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return { days, hours, minutes, seconds }
}

const TimeBox = ({ label, value }: { label: string; value: number }) => {
  // до гидрации показываем 00, чтобы разметка совпала с серверной
  const hydrated = useHydrated()
  const display = hydrated ? String(value).padStart(2, '0') : '00'

  return (
    <div className="rounded-xl border text-muted-foreground  px-2 py-1.5 text-center">
      <div className="font-mono text-xs tabular-nums leading-none">
        {display}
      </div>
      <div className="text-[10px] uppercase tracking-widest opacity-70">{label}</div>
    </div>
  )
}

const BORDER_BY_VARIANT: Record<Variant, string> = {
  money: "border-amber-400/30",
  love: "border-rose-400/30",
  luck: "border-emerald-400/30",
  dream: "border-violet-400/30",
  soul: "border-sky-400/30",
}

interface SlotCardProps {
  slot: AnySlot,
  variant: Variant,
  active: boolean,
  t: HomeDict["slots"]
  locale: Locale
}

export const SlotCard = ({ slot, variant, active, t, locale }: SlotCardProps) => {
  const router = useRouter()
  const styles = VARIANT_STYLES[variant]
  const hydrated = useHydrated()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const { remainingMs, progressPct, isExpired, hasExpiry } = useMemo(() => {
    const start = new Date(slot.createdAt).getTime()
    const end = slot.expiresAt ? new Date(slot.expiresAt).getTime() : NaN

    if (!Number.isFinite(end)) {
      return { remainingMs: 0, progressPct: 0, isExpired: false, hasExpiry: false }
    }

    // до гидрации считаем, как будто времени ещё не прошло (стабильный SSR)
    const effectiveNow = hydrated ? now : start

    const total = Math.max(1, end - start)
    const rem = Math.max(0, end - effectiveNow)
    const elapsed = Math.max(0, effectiveNow - start)
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100))

    return { remainingMs: rem, progressPct: pct, isExpired: rem === 0, hasExpiry: true }
  }, [slot.createdAt, slot.expiresAt, now, hydrated])

  const parts = hasExpiry ? msToParts(remainingMs) : null
  const canOpenPopover = !active && !slot.deletedAt

  return (
    <Popover open={canOpenPopover ? undefined : false}>
      <PopoverTrigger>
        <Card
          className={cn(
            'p-2 bg-transparent rounded-md border transition cursor-pointer h-full min-h-36',
            BORDER_BY_VARIANT[variant],
            isExpired ? "opacity-45" : "",
            slot.deletedAt && "border border-red-800 rounded-md"
          )}
          onClick={() => active ? router.push(`/${locale}/${variant}?searchNum=${slot.personalNum}`) : null}
        >
          <CardHeader className="relative z-10 p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex-1 flex items-center gap-2 text-base font-semibold">
                {styles.icon}
                <span className="opacity-80">№</span>
                <span className="tabular-nums">{slot.personalNum}</span>
              </CardTitle>
              <span className="flex gap-1 justify-end items-center m-2 text-xs text-muted-foreground">
                <HeartIcon
                  className='h-4 w-4'
                />
                <span>{slot.likes.length}</span>
              </span>
              <span className={cn('rounded-full px-2 py-0.5 text-xs', slot.deletedAt ? "border border-red-800 text-red-800" : styles.badgeCls)}>
                {slot.deletedAt ? "block" : hasExpiry ? (isExpired ? t.ended : t.inprocess) : t.nolimit}
              </span>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 p-4 pt-0 space-y-3 flex flex-col justify-between h-full">
            <p className="min-h-10 text-sm text-pretty break-all ">
              {slot.userText || '—'}
            </p>
            {(hasExpiry || slot.deletedAt) && (
              <div className="space-y-4">
                {/* таймер (у заблокированной ячейки — нули) */}
                <div className="grid grid-cols-4 gap-2">
                  <TimeBox label={t.days} value={slot.deletedAt ? 0 : parts!.days} />
                  <TimeBox label={t.hours} value={slot.deletedAt ? 0 : parts!.hours} />
                  <TimeBox label={t.minutes} value={slot.deletedAt ? 0 : parts!.minutes} />
                  <TimeBox label={t.seconds} value={slot.deletedAt ? 0 : parts!.seconds} />
                </div>

                {/* прогресс */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn('h-full rounded-full', styles.gradient)}
                    style={{ width: hydrated && !slot.deletedAt ? `${progressPct}%` : '0%', transition: 'width 1s linear' }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverTrigger>
      {canOpenPopover && <PopoverContent className="w-auto">
        <Button variant="link" size="sm" onClick={() => router.push(`/${locale}/buy?variant=${variant}&slotId=${slot.id}`)}>
          {t.buyAgain}
        </Button>
      </PopoverContent>}
    </Popover>
  )
}
