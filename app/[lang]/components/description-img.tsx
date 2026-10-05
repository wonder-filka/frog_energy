import { getDictionary } from '@/get-dictionary'
import Image from 'next/image'

type Step = {
  img: string
  badgeClass: string
}

const STEPS_META: Step[] = [
  { img: '/desc1.png', badgeClass: 'bg-amber-500 ring-emerald-600' },
  { img: '/desc2.png', badgeClass: 'bg-emerald-400 ring-emerald-400' },
  { img: '/desc3.png', badgeClass: 'bg-sky-400 ring-sky-400' },
  { img: '/desc4.png', badgeClass: 'bg-rose-400 ring-rose-400' },
]

export const RitualSectionImg = async () => {
  const t = await getDictionary()

  return (
    <section
      className="relative w-full mt-8"
      aria-labelledby="ritual-heading"
    >
      <h2 id="ritual-heading" className="sr-only">
        {t.ritual.title}
      </h2>

      <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-4 md:gap-y-12">
        {STEPS_META.map((step, i) => {
          const { title, desc } = t.ritual.steps[(i + 1) as 1 | 2 | 3 | 4]

          return (
            <li
              key={i}
              className="flex flex-col items-center text-center"
              itemScope
              itemType="https://schema.org/HowToStep"
            >
              <article className="relative mt-4 w-full rounded-3xl border p-4 sm:p-4 shadow-sm hover:shadow-md transition">
                <span
                  className={`absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full text-white font-bold shadow ring-0 ${step.badgeClass}`}
                  aria-label={`Step ${i + 1}`}
                  itemProp="position"
                >
                  {i + 1}
                </span>

                <h3
                  className="text-lg font-semibold"
                  itemProp="name"
                >
                  {title}
                </h3>

                <p
                  className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed"
                  itemProp="text"
                >
                  {desc}
                </p>

                <figure className="mt-4 mx-auto" itemProp="image">
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={step.img}
                      alt={`${title} - Step ${i + 1}`}
                      width={320}
                      height={420}
                      className="w-full h-auto"
                      loading="lazy"
                      itemProp="url"
                    />
                  </div>
                </figure>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
