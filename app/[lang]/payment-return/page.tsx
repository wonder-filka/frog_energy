import type { Metadata } from 'next';
import { getDictionary, getLocale } from '@/get-dictionary';
import { PaymentReturnClient } from './_components/payment-return-client';

export async function generateMetadata({ params }: PageProps<'/[lang]/payment-return'>): Promise<Metadata> {
  const { lang } = await params
  const canonicalUrl = `https://frog-energy.com/${lang}/payment-return`;

  return {
    title: 'Payment Status & Transaction Processing | Frog Energy',
    description: 'Processing your payment status. Please wait while we confirm your transaction.',

    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PaymentReturnPage() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()])
  return (
    <PaymentReturnClient t={{ ...t.paymentReturn, back: t.common.back }} locale={locale} />
  );
}
