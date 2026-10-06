import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/get-dictionary";
import { homeDict } from "./_dict";
import { getSessionUserId } from "@/lib/session";
import type { Variant } from "@/lib/types";
import { getLatestInfo, getTopLikedActiveSlots, getUserCellsSeparated, getUserNameAndEnergy } from "./_data";

import { HeaderHomeComponent } from "./_components/header-home";
import { SlotsComponent } from "./_components/slots-component";
import { InfoComponent } from "./_components/info-block";
import { PopularCellsComponent } from "./_components/popular-cells-component";

export async function generateMetadata({ params }: PageProps<"/[lang]/home">): Promise<Metadata> {
  const { lang } = await params
  const canonicalUrl = `https://frog-energy.com/${lang}/home`;
  return {
    title: 'Frog Energy Home page',
    robots: { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const VARIANTS: Variant[] = ["money", "love", "luck", "soul", "dream"];

export default async function Page() {
  const [dict, locale, userId] = await Promise.all([getDictionary(), getLocale(), getSessionUserId()])
  const t = homeDict(dict)

  const [topLikedSlots, info, nameAndEnergy, cellsByVariant] = await Promise.all([
    getTopLikedActiveSlots(userId),
    getLatestInfo(),
    userId ? getUserNameAndEnergy(userId) : null,
    Promise.all(VARIANTS.map((v) => userId ? getUserCellsSeparated(v, userId) : null)),
  ])

  const active = cellsByVariant.flatMap((cells, i) => cells?.active.map((c) => ({ ...c, variant: VARIANTS[i] })) ?? [])
  const expired = cellsByVariant.flatMap((cells, i) => cells?.expired.map((c) => ({ ...c, variant: VARIANTS[i] })) ?? [])

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <HeaderHomeComponent name={nameAndEnergy?.firstName || ''} energy={nameAndEnergy?.energy || 0} t={t.header} locale={locale} />
      <SlotsComponent length={active.length + expired.length} active={active} expired={expired} t={t.slots} locale={locale} />
      <PopularCellsComponent cells={topLikedSlots} userId={userId} t={t.popular} locale={locale} />
      <InfoComponent
        nextBroadcast={info?.nextBroadcast ?? '-'}
        prevBroadcast={info?.prevBroadcast ?? '-'}
        weekTopic={info?.weekTopic ?? '-'}
        t={t.info}
        locale={locale}
      />
    </div>
  )
}
