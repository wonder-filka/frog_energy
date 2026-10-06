import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "../../components/ui/button"
import type { HomeDict } from "@/lib/home-dict"
import type { Locale } from "@/i18n-config"

export interface HeaderHomeProps {
  name: string,
  energy: number
  t: HomeDict["header"]
  locale: Locale
}

export const HeaderHomeComponent = ({ name, energy, t, locale }: HeaderHomeProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">  {name ? `${t.welcome}, ${name}!` : `${t.welcomeAnon}`}</h1>
        <h2 className="font-semibold text-md text-amber-500 flex gap-2"> {t.energy}:<span className="flex gap-1 font-bold"><Zap />{energy}</span></h2>
      </div>

      <Button className="text-black" nativeButton={false} render={<Link href={`/${locale}/buy`} />}>
        {t.newCell}
      </Button>
    </div>
  )
}
