import { Button } from "./ui/button";
import { getDictionary, getLocale } from "@/get-dictionary";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Hero = async () => {
  const t = await getDictionary()
  const locale = await getLocale()

  return (
    <section
      className="relative w-full h-[600px] flex items-center justify-center overflow-hidden border-accent"
      aria-label="Hero section"
    >
      <div className="z-10 bg-black/60 md:bg-transparent h-full md:h-auto max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
        <div>
          <h1 className="mt-6 max-w-[24ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            {t.home.hero.title}
          </h1>
          <p className="mt-2 max-w-[48ch] xs:text-lg text-xl font-semibold text-amber-500">
            {t.home.hero.desc}
          </p>

          <nav className="mt-36 md:mt-12 flex flex-col sm:flex-row items-center gap-4" aria-label="Hero actions">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-base"
              nativeButton={false}
              render={<Link href={`/${locale}/buy`} />}
            >
              {t.home.hero.start}
              <ArrowUpRight className="!h-5 !w-5" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
              nativeButton={false}
              render={<Link href={`/${locale}#features`} />}
            >
              <CirclePlay className="!h-5 !w-5" aria-hidden="true" />
              {t.home.hero.read}
            </Button>
          </nav>
        </div>
      </div>

      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/IMG_3450.png"
          alt="Hero background"
          fill
          preload
          className="object-cover object-[70%_55%] md:object-[center_55%]"
        />
      </div>
    </section>
  );
};
