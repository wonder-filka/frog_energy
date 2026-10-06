import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { getDictionary, getLocale } from '@/get-dictionary'
import Link from 'next/link'
import {
  Coins,
  Heart,
  Clover,
  Sparkles,
  MoonStar
} from 'lucide-react'

import type { Variant } from '@/lib/types'

type Feature = {
  key: Variant
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  accentColor: string
}

const FEATURES: Feature[] = [
  { key: 'money', icon: Coins, accentColor: 'text-amber-400' },
  { key: 'love', icon: Heart, accentColor: 'text-rose-400' },
  { key: 'luck', icon: Clover, accentColor: 'text-emerald-400' },
  { key: 'soul', icon: Sparkles, accentColor: 'text-sky-400' },
  { key: 'dream', icon: MoonStar, accentColor: 'text-violet-400' }
]

export const Features = async () => {
  const t = await getDictionary()
  const locale = await getLocale()

  return (
    <section
      id="features"
      className="max-w-screen-xl mx-auto w-full py-12 px-6"
      aria-labelledby="features-title"
    >
      <h2
        id="features-title"
        className="text-3xl xs:text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl text-center mx-auto mb-12"
      >
        {t.home.symbolism.title}
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature) => {
          const IconComponent = feature.icon
          const boardTitle = t.sidebar[`${feature.key}Title`]

          return (
            <article
              key={feature.key}
              className="flex flex-col"
            >
              <Card className="flex flex-col border rounded-2xl overflow-hidden shadow-none h-full">
                <CardHeader>
                  <IconComponent
                    className={feature.accentColor}
                    aria-hidden="true"
                  />
                  <h3 className="!mt-3 text-xl font-bold tracking-tight">
                    {t.home.features[feature.key].title}
                  </h3>
                  <p className="mt-1 text-muted-foreground text-sm xs:text-[17px]">
                    {t.home.features[feature.key].description}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button
                    variant="link"
                    className={`p-0 ${feature.accentColor} cursor-pointer`}
                    nativeButton={false}
                    render={<Link href={`/${locale}/${feature.key}`} />}
                  >
                    {t.sidebar.watch}: {boardTitle}
                  </Button>
                </CardContent>
              </Card>
            </article>
          )
        })}
      </div>
    </section>
  )
}
