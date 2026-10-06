import type { Metadata } from 'next';
import { getDictionary, getLocale } from '@/get-dictionary';
import { authDict } from '@/lib/auth-dict';
import { buyDict } from './_dict';
import { getSlotById } from './_data';
import { PN_MAX } from '@/lib/schemas';
import { getSessionUserId } from '@/lib/session';
import type { SlotItem, Variant } from '@/lib/types';
import { BuyMainComponent } from './_components/buy-main-component';

export async function generateMetadata({ params }: PageProps<'/[lang]/buy'>): Promise<Metadata> {
    const { lang } = await params
    const canonicalUrl = `https://frog-energy.com/${lang}/buy`;

    return {
        title: 'Buy Energy Slots & Post Your Intentions | Frog Energy',
        description: 'Purchase energy slots for Money, Love, Luck, Soul, or Dream boards. Choose your cell, duration, and start manifesting your goals today!',
        robots: { index: false, follow: false },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

const VALID_VARIANTS: Variant[] = ["money", "love", "luck", "soul", "dream"];

// ?variant=&number= comes from a free cell on a board, ?variant=&slotId= from "buy again"
async function getInitialItems(params: Awaited<PageProps<'/[lang]/buy'>['searchParams']>): Promise<SlotItem[]> {
    const variantParam = params.variant
    const slotId = params.slotId
    const numberParam = params.number
    if (typeof variantParam !== 'string' || !VALID_VARIANTS.includes(variantParam as Variant)) return []
    const variant = variantParam as Variant

    if (typeof numberParam === 'string') {
        const num = Number(numberParam);
        if (Number.isInteger(num) && num >= 1 && num <= PN_MAX) {
            return [{ variant, days: 1, personalNum: num, text: '' }];
        }
    }
    if (typeof slotId === 'string') {
        const slotItem = await getSlotById(slotId, variant);
        if (slotItem) {
            return [{ variant, days: 1, personalNum: slotItem.personalNum, text: slotItem.userText || '' }];
        }
    }
    return [];
}

export default async function Page({ searchParams }: PageProps<'/[lang]/buy'>) {
    const [t, locale, userId, initialItems] = await Promise.all([
        getDictionary(),
        getLocale(),
        getSessionUserId(),
        searchParams.then(getInitialItems),
    ])

    return (
        <div className='flex flex-col items-center justify-center my-10 px-4 w-full'>
            <h1 className='text-bold text-2xl'>{t.slotsBuyTitle}</h1>
            <h2 className='text-bold text-muted-foreground text-md'>{t.slotsBuyDescription}</h2>
            <BuyMainComponent
                userIdServer={userId}
                showAuthForm={!userId}
                initialItems={initialItems}
                t={buyDict(t)}
                authT={authDict(t)}
                locale={locale}
            />
        </div>
    )
}
