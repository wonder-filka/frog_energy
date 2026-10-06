'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import type { Dictionary } from '@/get-dictionary'
import type { Locale } from '@/i18n-config'
import { LoaderCircle, CheckCircle2, XCircle, Clock } from 'lucide-react'

type OrderStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELED' | 'UNKNOWN'

type PaymentReturnDict = Dictionary['paymentReturn'] & { back: string }
type MessageKey = 'noOrder' | 'notFound' | 'fetchError'

interface PaymentReturnClientProps {
	t: PaymentReturnDict
	locale: Locale
}

export const PaymentReturnClient = ({ t, locale }: PaymentReturnClientProps) => {
	const router = useRouter()
	const params = useSearchParams()
	const orderId = params.get('orderId')

	const [status, setStatus] = useState<OrderStatus>('UNKNOWN')
	const [error, setError] = useState<MessageKey | null>(null)
	const [checking, setChecking] = useState(false)
	const pollerRef = useRef<ReturnType<typeof setInterval> | null>(null)

	const title = useMemo(() => {
		switch (status) {
			case 'PENDING':
			case 'PROCESSING':
				return t.waitTitle
			case 'PAID':
				return t.successTitle
			case 'CANCELED':
				return t.failTitle
			default:
				return t.title
		}
	}, [status, t])


	const mapMonoToLocal = (mono: string): OrderStatus => {
		const map: Record<string, OrderStatus> = {
			success: 'PAID',
			failure: 'CANCELED',
			expired: 'CANCELED',
			reversed: 'CANCELED',
			processing: 'PROCESSING',
			hold: 'PROCESSING',
			created: 'PENDING',
		}
		return map[mono] ?? 'UNKNOWN'
	}

	const reconcileNow = useCallback(async () => {
		if (!orderId) {
			setError('noOrder')
			return
		}
		setChecking(true)
		try {
			const res = await fetch('/api/reconcile-order', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ orderId, locale }),
				cache: 'no-store',
			})

			const data = await res.json()

			if (!res.ok) {
				if (res.status === 404) {
					setStatus('UNKNOWN')
					setError('notFound')
				} else {
					setError('fetchError')
				}
				return
			}

			// ожидаем что API вернёт { status: 'success' | 'failure' | ... }
			const next = mapMonoToLocal(data.status)
			setStatus(next)

			// если финальный — останавливаем автопуллинг
			if (next === 'PAID' || next === 'CANCELED') {
				if (pollerRef.current) {
					clearInterval(pollerRef.current)
					pollerRef.current = null
				}
			}
		} catch {
			setError('fetchError')
		} finally {
			setChecking(false)
		}
	}, [orderId, locale])



	// Единая функция проверки статуса — используется и в опросе, и в кнопке
	const checkNow = useCallback(async () => {
		if (!orderId) {
			setError('noOrder')
			return
		}
		setChecking(true)
		try {
			const res = await fetch(`/api/order-status?orderId=${orderId}`, { cache: 'no-store' })
			if (!res.ok) {
				if (res.status === 404) {
					setStatus('UNKNOWN')
					setError('notFound')
					// No such order (or not this user's): polling won't change that
					if (pollerRef.current) {
						clearInterval(pollerRef.current)
						pollerRef.current = null
					}
				} else {
					setError('fetchError')
				}
				return
			}
			const data = await res.json()
			const next: OrderStatus = (data.status as OrderStatus) ?? 'UNKNOWN'
			setStatus(next)

			// Если статус финальный — останавливаем опрос
			if (next === 'PAID' || next === 'CANCELED') {
				if (pollerRef.current) {
					clearInterval(pollerRef.current)
					pollerRef.current = null
				}
			}
		} catch {
			setError('fetchError')
		} finally {
			setChecking(false)
		}
	}, [orderId])

	useEffect(() => {
		// Missing ?orderId= is shown via `shownError` below, nothing to poll
		if (!orderId) return

		// первый запрос сразу (через таймер, чтобы не менять state синхронно в эффекте)
		const first = setTimeout(checkNow, 0)

		// затем — опрос каждые 2 секунды
		pollerRef.current = setInterval(checkNow, 2000)

		return () => {
			clearTimeout(first)
			if (pollerRef.current) clearInterval(pollerRef.current)
			pollerRef.current = null
		}
	}, [orderId, checkNow])

	const shownError: MessageKey | null = orderId ? error : 'noOrder'

	const isPending = status === 'PENDING' || status === 'PROCESSING' || status === 'UNKNOWN'

	return (
		<main className="max-w-screen-sm mx-auto px-6 py-12">
			<h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
			<p className="text-sm text-muted-foreground mb-6">
				{t.subtitle}
			</p>

			<div className="rounded-2xl border p-6">
				<div className="flex items-center gap-3 mb-4">
					{status === 'PAID' && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
					{status === 'CANCELED' && <XCircle className="h-6 w-6 text-rose-500" />}
					{isPending && <Clock className="h-6 w-6 text-amber-500" />}
					<div className="font-semibold">
						{status === 'PAID' && t.successLead}
						{status === 'CANCELED' && t.failLead}
						{isPending && t.waitLead}
					</div>
				</div>

				{isPending && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<LoaderCircle className="h-4 w-4 animate-spin" />
						<span>{t.checking}</span>
					</div>
				)}

				{shownError && (
					<div className="mt-4 rounded-md border border-rose-400/40 bg-rose-50 dark:bg-rose-900/20 p-3 text-sm">
						{t[shownError]}
					</div>
				)}

				<div className="mt-6 flex flex-wrap gap-3">
					{status === 'PAID' && (
						<Button onClick={() => router.push(`/${locale}/home`)} className="bg-emerald-500 text-black hover:opacity-90">
							{t.goBoards}
						</Button>
					)}

					{status === 'CANCELED' && (
						<>
							<Button onClick={() => router.push(`/${locale}/buy`)} className="bg-amber-400 text-black hover:opacity-90">
								{t.tryAgain}
							</Button>
							<Button variant="outline" onClick={() => router.push(`/${locale}/home`)}>
								{t.back}
							</Button>
						</>
					)}

					{isPending && (
						<Button variant="outline" onClick={reconcileNow} disabled={checking}>
							{checking ? (
								<>
									<LoaderCircle className="h-4 w-4 animate-spin mr-2" />
									{t.checking}
								</>
							) : (
								t.manualCheck // "Если долго — проверить вручную"
							)}
						</Button>
					)}
				</div>
			</div>
		</main>
	)
}