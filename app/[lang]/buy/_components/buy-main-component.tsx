'use client'

import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, LoaderCircle } from "lucide-react";
import { ConflictItem, SlotItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { translateBuyMessage, type BuyDict } from "../_dict";
import type { AuthDict } from "@/lib/auth-dict";
import type { Locale } from "@/i18n-config";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Alert, AlertTitle } from "../../components/ui/alert";
import { createHolds } from "../_actions";
import { LogOrReg } from "./log-or-reg";
import { SlotOrderForm } from "./slot-order-form";
import { DetailsComponent, type Totals } from "./details-component";
import { VARIANTS } from "./variant-colors";

interface BuyMainComponentProps {
	userIdServer: string | null,
	showAuthForm: boolean,
	initialItems: SlotItem[]
	t: BuyDict
	authT: AuthDict
	locale: Locale
}

const TOTAL_KEY = { money: 'tm', love: 'tl', luck: 'tlk', soul: 'ts', dream: 'td' } as const

export const BuyMainComponent = ({ userIdServer, showAuthForm: showAuthFormProp, initialItems, t, authT, locale }: BuyMainComponentProps) => {
	const [showAuthForm] = useState(showAuthFormProp);
	const router = useRouter()
	const [pending, startTransition] = useTransition()
	const [rootError, setRootError] = useState<string | null>(null);
	const [isTermsChecked, setIsTermsChecked] = useState(false);
	const [showTermsError, setShowTermsError] = useState(false);

	const [totals, setTotals] = useState<Totals>({ totalUSD: 0 });

	const [userId, setUserId] = useState<string | null>(userIdServer);
	const [conflicts, setConflicts] = useState<ConflictItem[]>([])

	const [items, setItems] = useState<SlotItem[]>(initialItems)
	const [step, setStep] = useState<0 | 1>(items.length > 0 ? 1 : 0)

	const onSubmit = async (values: SlotItem[]) => {
		if (!userId) return
		startTransition(async () => {
			try {
				const result = await createHolds(values);
				if ('message' in result) {
					if (result.message === 'buyForm.numberTaken' && result.conflicts && result.conflicts.length > 0) {
						setConflicts(result.conflicts)
						return;
					}
					setConflicts([{ variant: 'root', message: result.message === 'buyForm.noUserId' ? result.message : 'buyForm.unknownError' }])
					return;
				}
				const itemsIds = result.map(order => order.id);
				const response = await fetch('/api/create-payment', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ itemsIds, locale }),
				});
				const res = await response.json();

				if (!response.ok || res.errCode || !res.pageUrl) {
					toast.error(t.messages.error)
					return
				}
				router.push(res.pageUrl)
			} catch (error) {
				console.error("Holds creation failed:", error);
				setConflicts([{ variant: 'root', message: 'buyForm.unknownError' }])
			}
		})
	}

	if (pending) return (
		<div className="flex justify-center items-center space-x-2 min-h-100 col-span-2 xl:col-span-5">
			<LoaderCircle size={25} className="text-violet-400 animate-spin" />
		</div>
	)

	return (
		step === 0 || items.length === 0 ?
			<SlotOrderForm items={items} setItems={setItems} setStep={setStep} t={t} locale={locale} />
			:
			<div className="flex flex-col justify-center mt-6 gap-4 w-full md:w-auto">
				<div className="flex flex-col md:flex-row md:gap-4">
					<DetailsComponent
						userId={userId}
						items={items}
						conflicts={conflicts}
						setItems={setItems}
						onSubmit={onSubmit}
						setStep={setStep}
						onRootError={setRootError}
						isTermsChecked={isTermsChecked}
						onTermsChange={setIsTermsChecked}
						onTermsNotAccepted={() => setShowTermsError(true)}
						showTermsError={showTermsError}
						onTotalsChange={setTotals}
						t={t}
						locale={locale}
					/>
					{
						showAuthForm && <div>
							<LogOrReg userId={userId} setUserId={setUserId} error={rootError === 'buyForm.noUserId'} t={t} authT={authT} />
						</div>
					}
				</div>

				{/* Мобильный блок суммы + чекбокс */}
				<div className="md:hidden flex flex-col gap-3">
					<div className="flex flex-col text-right text-xs text-muted-foreground">
						{VARIANTS.map((v) => {
							const days = totals[TOTAL_KEY[v]]
							return days ? <div key={v}>{t.variants[v]}: {days} {t.labels.daysSumm} = {days}$</div> : null
						})}
					</div>
					<div className="text-right text-lg font-bold">
						{t.labels.sum}: {totals.totalUSD} USD
					</div>

					<div>
						<label className="flex items-end justify-end gap-2 text-sm w-full">
							<span>
								{t.labels.termsPrefix}{' '}
								<Link href={`/${locale}/terms`} className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">
									{t.labels.termsLink}
								</Link>
							</span>
							<Checkbox
								className={cn(showTermsError && !isTermsChecked ? 'border border-red-800 outline-red-800' : '')}
								checked={isTermsChecked}
								onCheckedChange={(checked) => {
									setIsTermsChecked(!!checked);
									setShowTermsError(prev => prev || !checked);
									setRootError(null);
								}}
							/>
						</label>
						{showTermsError && !isTermsChecked && (
							<div className="text-red-800 text-xs text-right">
								{t.messages['buyForm.termsRequired']}
							</div>
						)}
					</div>
					{rootError && rootError !== 'buyForm.termsRequired' && (
						<Alert variant="destructive">
							<AlertCircleIcon />
							<AlertTitle>{translateBuyMessage(t.messages, rootError)}</AlertTitle>
						</Alert>
					)}
				</div>
				<div className="flex md:hidden flex-col gap-4 w-full md:w-148">
					<div className="flex flex-col-reverse md:flex-row gap-6 my-2 w-full">
						<Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>
							{t.labels.back}
						</Button>
						<Button
							type="submit"
							form="buyForm"
							className="flex-1 bg-amber-400 text-black hover:opacity-90"
						>
							{t.labels.bookCells}
						</Button>
					</div>
				</div>
			</div>
	)
}
