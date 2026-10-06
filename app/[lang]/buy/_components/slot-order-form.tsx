'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Check, Plus } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { Button } from '../../components/ui/button'
import { cn } from '@/lib/utils'
import { SlotItem, Variant } from '@/lib/types'
import type { BuyDict } from '@/lib/buy-dict'
import type { Locale } from '@/i18n-config'
import { BuySlotVariantFormInput, BuySlotVariantFormOutput, BuySlotVariantSchema } from '@/lib/schemas'
import { VARIANT_COLORS, VARIANTS } from './variant-colors'

interface SlotOrderFormProps {
  items: SlotItem[],
  setItems: Dispatch<SetStateAction<SlotItem[]>>,
  setStep: Dispatch<SetStateAction<0 | 1>>
  t: BuyDict
  locale: Locale
}

const FLAG_BY_VARIANT: Record<Variant, keyof BuySlotVariantFormOutput> = {
  money: 'isMoney',
  love: 'isLove',
  luck: 'isLuck',
  soul: 'isSoul',
  dream: 'isDream',
}

export const SlotOrderForm = ({
  items,
  setItems,
  setStep,
  t,
  locale,
}: SlotOrderFormProps) => {
  const router = useRouter()
  const itemDef = (v: Variant) => items.find(i => i.variant === v)
  const form = useForm<BuySlotVariantFormInput, unknown, BuySlotVariantFormOutput>({
    resolver: zodResolver(BuySlotVariantSchema),
    defaultValues: {
      isMoney: Boolean(itemDef('money')),
      isLove: Boolean(itemDef('love')),
      isLuck: Boolean(itemDef('luck')),
      isSoul: Boolean(itemDef('soul')),
      isDream: Boolean(itemDef('dream')),
    },
    mode: 'onChange',
  })

  const selected = form.watch()

  const toggle = (flag: keyof BuySlotVariantFormOutput) => {
    const next = !form.getValues(flag)
    form.setValue(flag, next, { shouldValidate: true })
    form.clearErrors()
  }

  const submit: SubmitHandler<BuySlotVariantFormOutput> = (values) => {
    if (!values.isMoney && !values.isLove && !values.isLuck && !values.isSoul && !values.isDream) {
      form.setError('isMoney', { type: 'manual', message: t.messages['buyForm.pickAny'] })
      return
    }

    setItems((prev) => {
      const next: SlotItem[] = [];
      for (const v of VARIANTS) {
        const exists = prev.find((i) => i.variant === v);
        const need = Boolean(values[FLAG_BY_VARIANT[v]]);
        if (need && exists) {
          next.push(exists);
        } else if (need && !exists) {
          next.push({ variant: v, days: 1, text: '' });
        }
      }
      return next;
    });
    setStep(1)
  }

  return (
    <div className="grid gap-4 w-full md:w-148 mt-6">
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">

        {/* Переключатели */}
        <div className="grid grid-cols-1 gap-4">
          {VARIANTS.map((v) => {
            const isOn = Boolean(selected[FLAG_BY_VARIANT[v]])
            return (
              <div
                key={v}
                role="checkbox"
                aria-checked={isOn}
                tabIndex={0}
                className={cn('cursor-pointer select-none p-4 flex justify-between items-center rounded border font-bold transition',
                  isOn ? VARIANT_COLORS[v].toggleOn : VARIANT_COLORS[v].toggleOff)}
                onClick={() => toggle(FLAG_BY_VARIANT[v])}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    toggle(FLAG_BY_VARIANT[v])
                  }
                }}
              >
                {t.variants[v]} {isOn ? <Check /> : <Plus />}
              </div>
            )
          })}
        </div>

        <div className="text-red-600 text-center">
          {form.formState.errors.isMoney?.message}
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-6 w-full mt-14">
          <Button type="button" variant="outline" className="flex-1" onClick={() => {
            router.push(`/${locale}/home`)
          }
          } >
            {t.labels.back}
          </Button>
          <Button type="submit" className="flex-1 bg-amber-400 text-black hover:opacity-90">
            {t.labels.selectCells}
          </Button>
        </div>
      </form>
    </div>
  )
}
