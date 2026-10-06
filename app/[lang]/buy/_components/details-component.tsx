'use client'

import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircleIcon, RefreshCcw, Star } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Checkbox } from '../../components/ui/checkbox'
import { Alert, AlertTitle } from '../../components/ui/alert'
import { Field, FieldDescription, FieldError, FieldLabel } from '../../components/ui/field'
import type { ConflictItem, SlotItem, Variant } from '@/lib/types'
import type { Locale } from '@/i18n-config'
import { cn } from '@/lib/utils'
import { translateBuyMessage, type BuyDict } from '@/lib/buy-dict'
import { BuySlotFormInput, BuySlotFormKey, BuySlotFormOutput, BuySlotSchema, MAX_LEN } from '@/lib/schemas'
import { VARIANT_COLORS, VARIANTS } from './variant-colors'

export type Totals = { tm?: number; tl?: number; tlk?: number; ts?: number; td?: number; totalUSD: number }

interface DetailsComponentProps {
	items: SlotItem[];
	setItems: (arg: SlotItem[] | ((prev: SlotItem[]) => SlotItem[])) => void;
	onSubmit: (values: SlotItem[]) => Promise<void>
	setStep: Dispatch<SetStateAction<0 | 1>>
	conflicts: ConflictItem[]
	userId: string | null
	onRootError?: (msg: string | null) => void,
	isTermsChecked: boolean
	onTermsChange: Dispatch<SetStateAction<boolean>>
	onTermsNotAccepted: () => void
	showTermsError: boolean
	onTotalsChange: (totals: Totals) => void
	t: BuyDict
	locale: Locale
}

// Intl locale tags; our "ua" segment is Ukrainian, which Intl calls "uk"
const INTL_LOCALE: Record<Locale, string> = { en: 'en', de: 'de', es: 'es', fr: 'fr', pt: 'pt', ru: 'ru', ua: 'uk' }

const KEY_BY_VARIANT: Record<Variant, BuySlotFormKey> = {
	money: 'tm',
	love: 'tl',
	luck: 'tlk',
	soul: 'ts',
	dream: 'td',
}

export const DetailsComponent = ({
	items,
	setItems,
	onSubmit,
	setStep,
	conflicts,
	userId,
	onRootError,
	isTermsChecked,
	onTermsChange,
	onTermsNotAccepted,
	showTermsError,
	onTotalsChange,
	t,
	locale,
}: DetailsComponentProps) => {
	const [saveItems,] = useState(items || [])
	const has = (v: Variant) => saveItems.some(i => i.variant === v)
	const itemDef = (v: Variant) => saveItems.find(i => i.variant === v)
	const defaultsFor = (v: Variant) =>
		has(v) ? { days: itemDef(v)?.days, text: itemDef(v)?.text, pn: itemDef(v)?.personalNum } : undefined

	const [showPN, setShowPN] = useState<Record<BuySlotFormKey, boolean>>({
		tm: Boolean(itemDef('money')?.personalNum),
		tl: Boolean(itemDef('love')?.personalNum),
		tlk: Boolean(itemDef('luck')?.personalNum),
		ts: Boolean(itemDef('soul')?.personalNum),
		td: Boolean(itemDef('dream')?.personalNum),
	})
	// A taken-number conflict opens the number field so its error is visible
	const conflictKeys = new Set(
		conflicts.filter((c) => c.variant && c.variant !== 'root').map((c) => KEY_BY_VARIANT[c.variant as Variant])
	)
	const isPNShown = (key: BuySlotFormKey) => showPN[key] || conflictKeys.has(key)

	// "Reserved until {time}": the hold's end in the buyer's own time zone
	const numberError = (variant: Variant, message?: string) => {
		const text = translateBuyMessage(t.messages, message)
		if (message !== 'buyForm.numberHeld' || !text) return text
		const heldUntil = conflicts.find((c) => c.variant === variant)?.heldUntil
		const time = heldUntil
			? new Date(heldUntil).toLocaleTimeString(INTL_LOCALE[locale], { hour: '2-digit', minute: '2-digit' })
			: ''
		return text.replace('{time}', time)
	}

	const form = useForm<BuySlotFormInput, unknown, BuySlotFormOutput>({
		resolver: zodResolver(BuySlotSchema),
		defaultValues: {
			tm: defaultsFor('money'),
			tl: defaultsFor('love'),
			tlk: defaultsFor('luck'),
			ts: defaultsFor('soul'),
			td: defaultsFor('dream'),
		},
		mode: 'onChange',
	})

	const rootMsg = form.formState.errors.root?.message as string | undefined;
	useEffect(() => {
		onRootError?.(rootMsg ?? null);
	}, [rootMsg, onRootError]);

	const togglePN = (key: BuySlotFormKey) => setShowPN(s => ({ ...s, [key]: !isPNShown(key) }))
	const handlePNClick = (key: BuySlotFormKey) => {
		const fieldPath = `${key}.pn` as const
		if (!isPNShown(key)) {
			togglePN(key)
			const current = form.getValues(fieldPath) as number | undefined
			if (current == null || Number.isNaN(current)) {
				form.setValue(fieldPath, 1, { shouldValidate: true, shouldDirty: true })
			}
			return
		}
		togglePN(key)
		form.setValue(fieldPath, undefined, { shouldValidate: true, shouldDirty: true })
	}

	const watched = form.watch()
	const daysOf = (key: BuySlotFormKey) => {
		const section = watched[key]
		return section ? Number(section.days ?? 1) : undefined
	}

	const totalUSD = (Object.keys(KEY_BY_VARIANT) as Variant[])
		.map((v) => daysOf(KEY_BY_VARIANT[v]))
		.reduce<number>((sum, days) => sum + (days ?? 0), 0)

	const tm = daysOf('tm'), tl = daysOf('tl'), tlk = daysOf('tlk'), ts = daysOf('ts'), td = daysOf('td')
	useEffect(() => {
		onTotalsChange?.({ tm, tl, tlk, ts, td, totalUSD });
	}, [tm, tl, tlk, ts, td, totalUSD, onTotalsChange]);

	const submit: SubmitHandler<BuySlotFormOutput> = async (values) => {
		form.clearErrors();
		if (!isTermsChecked) {
			form.setError('root', { type: 'manual', message: 'buyForm.termsRequired' });
			onTermsNotAccepted?.();
			return;
		}

		if (!userId) {
			form.setError('root', { type: 'manual', message: 'buyForm.noUserId' })
			return;
		}

		const payload: SlotItem[] = VARIANTS
			.filter((v) => values[KEY_BY_VARIANT[v]] !== undefined)
			.map((v) => {
				const section = values[KEY_BY_VARIANT[v]]
				return {
					variant: v,
					days: section?.days ?? 1,
					text: section?.text ?? undefined,
					personalNum: section?.pn,
				}
			});

		if (payload.length === 0) {
			form.setError('root', { type: 'manual', message: 'buyForm.noSelected' })
			return;
		}
		setItems(payload)
		onSubmit(payload)
	}

	// Server conflicts: banner for general errors, field error for a taken number
	useEffect(() => {
		form.clearErrors()
		if (!conflicts || conflicts.length === 0) return

		conflicts.forEach((c) => {
			if (!c.variant || c.variant === 'root') {
				form.setError('root', { type: 'server', message: c.message })
				return
			}
			const fieldPath = `${KEY_BY_VARIANT[c.variant]}.pn` as const
			if (typeof c.personalNum === 'number') {
				form.setValue(fieldPath, c.personalNum, { shouldDirty: true })
			}
			form.setError(fieldPath, { type: 'server', message: c.message })
		})
	}, [conflicts, form])

	const renderSection = (variant: Variant) => {
		if (!has(variant)) return null
		const key = KEY_BY_VARIANT[variant]
		const colors = VARIANT_COLORS[variant]
		return (
			<div key={key} className="space-y-2 border p-4 w-full rounded-2xl">
				<div className="text-sm font-medium">
					{t.labels.textN} — {t.variants[variant]}
				</div>

				<div className='flex flex-col gap-2'>
					<Controller
						control={form.control}
						name={`${key}.text` as const}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<Textarea
									value={typeof field.value === 'string' ? field.value : ''}
									onChange={(e) => field.onChange((e.target.value || '').slice(0, MAX_LEN))}
									onBlur={field.onBlur}
									placeholder={t.labels.textPlaceholder}
									maxLength={MAX_LEN}
									aria-label={`${t.labels.textN} — ${t.variants[variant]}`}
									className={cn(colors.border, colors.focus)}
								/>
								<div className="text-[11px] text-accent">
									{t.labels.limit}. {t.labels.left}:{' '}
									{MAX_LEN - String(field.value ?? '').length}
								</div>
							</Field>
						)}
					/>

					<div className="flex flex-col items-start gap-4">
						<Controller
							control={form.control}
							name={`${key}.days` as const}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="w-auto items-start">
									<FieldLabel htmlFor={`${key}-days`} className="text-xs opacity-70">{t.labels.days}</FieldLabel>
									<Input
										id={`${key}-days`}
										inputMode="numeric"
										type="number"
										min={1}
										value={field.value == null ? '' : String(field.value)}
										onChange={(e) => { field.onChange(e.target.value === '' ? undefined : Number(e.target.value)) }}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
										className={cn(colors.border, colors.focus)}
									/>
									<FieldDescription className="text-xs text-muted-foreground">
										{t.labels.daysChoose}
									</FieldDescription>
									<FieldError>{translateBuyMessage(t.messages, fieldState.error?.message)}</FieldError>
								</Field>
							)}
						/>

						<div className='flex flex-col items-start gap-2'>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => handlePNClick(key)}
								className="cursor-pointer text-xs text-muted-foreground"
							>
								{isPNShown(key) ? t.labels.pickRandomNumber : t.labels.pickNumber}
								{isPNShown(key) ? <RefreshCcw /> : <Star />}
							</Button>
							{isPNShown(key) && (
								<Controller
									control={form.control}
									name={`${key}.pn` as const}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid} className="w-auto items-start">
											<FieldLabel htmlFor={`${key}-pn`} className="text-xs opacity-70 text-foreground">
												{t.labels.preferredNumber}
											</FieldLabel>
											<Input
												id={`${key}-pn`}
												inputMode="numeric"
												type="number"
												min={1}
												value={field.value == null ? '' : String(field.value)}
												onChange={(e) => { field.onChange(Number(e.target.value)) }}
												onBlur={field.onBlur}
												aria-invalid={fieldState.invalid}
												className={cn(colors.border, colors.focus)}
											/>
											<FieldError>{numberError(variant, fieldState.error?.message)}</FieldError>
										</Field>
									)}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		)
	}

	const rootError = form.formState.errors?.root?.message

	return (
		<div className="flex flex-col justify-center w-full md:w-148">
			<form id="buyForm" onSubmit={form.handleSubmit(submit)} className="space-y-4 w-full">
				<div className="grid grid-cols-1 gap-4">
					{VARIANTS.map(renderSection)}
				</div>

				{rootError && rootError !== 'buyForm.termsRequired' && (
					<Alert variant="destructive" className="hidden md:flex">
						<AlertCircleIcon />
						<AlertTitle>{translateBuyMessage(t.messages, rootError)}</AlertTitle>
					</Alert>
				)}

				<div className="hidden md:flex flex-col">
					<div className="flex flex-col text-right text-xs text-muted-foreground mb-2">
						{VARIANTS.map((v) => {
							const days = daysOf(KEY_BY_VARIANT[v])
							return days ? <div key={v}>{t.variants[v]}: {days} {t.labels.daysSumm} = {days}$</div> : null
						})}
					</div>
					<div className="text-right text-lg font-bold">
						{t.labels.sum}: {totalUSD} USD
					</div>
				</div>

				<div className="hidden md:flex flex-col gap-2 text-right text-lg font-bold">
					<label className="flex items-end justify-end gap-2 text-sm w-full">
						<span>
							{t.labels.termsPrefix}{' '}
							<Link href={`/${locale}/terms`} className="underline hover:no-underline" target="_blank"
								rel="noopener noreferrer">
								{t.labels.termsLink}
							</Link>
						</span>
						<Checkbox
							className={cn(showTermsError && !isTermsChecked ? 'border border-red-800 outline-red-800' : '')}
							checked={isTermsChecked}
							onCheckedChange={(checked) => {
								onTermsChange(!!checked);
								form.clearErrors('root');
							}}
						/>
					</label>
					{showTermsError && !isTermsChecked && (
						<div className="text-red-800 text-xs">
							{t.messages['buyForm.termsRequired']}
						</div>
					)}
				</div>

				<div className="hidden md:flex flex-col-reverse md:flex-row gap-6 w-full">
					<Button type="button" variant="outline" className="flex-1" onClick={() => {
						setStep(0)
					}
					} >
						{t.labels.back}
					</Button>
					<Button type="submit" className="flex-1 bg-amber-400 text-black hover:opacity-90">
						{t.labels.bookCells}
					</Button>
				</div>
			</form>
		</div>
	)
}
