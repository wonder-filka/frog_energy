import { getDictionary } from '@/get-dictionary'
import { RitualSectionImg } from './description-img'

export const RitualSection = async () => {
  const t = await getDictionary()

  return (
    <section
      id="ritual"
      className="max-w-screen-xl mx-auto w-full px-6 pb-12"
      aria-labelledby="ritual-title"
    >
      <h2
        id="ritual-title"
        className="text-3xl xs:text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl text-center mx-auto mb-8"
      >
        {t.home.desc.title}
      </h2>

      <div className="relative flex flex-col md:flex-row gap-4">
        <article className="flex-1 mx-auto text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground mb-6">
            <p className="text-base md:text-lg">{t.home.desc[1]}</p>
            <p className="text-base md:text-lg">{t.home.desc[2]}</p>
          </div>
          <RitualSectionImg />
        </article>
      </div>
    </section>
  )
}
