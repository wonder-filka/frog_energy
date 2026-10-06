import { Settings, Heart, Clover, MoonStar, Sparkles, Coins, HomeIcon } from "lucide-react"
import type { Dictionary } from "@/get-dictionary"
import type { Variant } from "./types"

// `label` picks the translation from the dictionary; `url` is relative to the locale prefix
export const sidebarItems = [
  {
    key: "money",
    label: (t: Dictionary) => t.sidebar.moneyTitle,
    url: "/money",
    icon: Coins,
    className: 'stroke-amber-500',
  },
  {
    key: "love",
    label: (t: Dictionary) => t.sidebar.loveTitle,
    url: "/love",
    icon: Heart,
    className: 'stroke-rose-500',
  },
  {
    key: "luck",
    label: (t: Dictionary) => t.sidebar.luckTitle,
    url: "/luck",
    icon: Clover,
    className: 'stroke-emerald-500',
  },
  {
    key: "soul",
    label: (t: Dictionary) => t.sidebar.soulTitle,
    url: "/soul",
    icon: Sparkles,
    className: 'stroke-sky-500',
  },
  {
    key: "dream",
    label: (t: Dictionary) => t.sidebar.dreamTitle,
    url: "/dream",
    icon: MoonStar,
    className: 'stroke-violet-500',
  },
  {
    key: "home",
    label: (t: Dictionary) => t.homePage,
    url: "/home",
    icon: HomeIcon,
    className: '',
  },
  {
    key: "settings",
    label: (t: Dictionary) => t.sidebar.settings,
    url: "/settings",
    icon: Settings,
    className: '',
  },
]

export type VariantStyle = {
  glowCls?: string
  buttonTitle?: string
  focusV?: string
  sort1?: string
  sort2?: string
  sortArr?: string
  arrKey?: string
  text?: string
  items?: string
}

export const VARIANT_STYLES: Record<Variant, VariantStyle> = {
  money: {
    glowCls: 'amb-glow',
    buttonTitle: 'bg-amber-400 hover:bg-amber-500 text-black',
    focusV: 'focus-visible:ring-amber-400',
    sort1: 'bg-amber-400 hover:bg-amber-500',
    sort2: 'border-amber-400 text-amber-400',
    sortArr: 'bg-amber-500 hover:bg-amber-500',
    arrKey: 'border-amber-400/30 hover:border-amber-400/60',
    text: 'text-amber-400',
    items: 'bg-amber-500 hover:bg-amber-500',
  },
  love: {
    glowCls: 'rose-glow',
    buttonTitle: 'bg-rose-400 hover:bg-rose-500  text-black',
    focusV: 'focus-visible:ring-rose-400',
    sort1: 'bg-rose-400 hover:bg-rose-500',
    sort2: 'border-rose-400 text-rose-400',
    sortArr: 'bg-rose-500 hover:bg-rose-500',
    arrKey: 'border-rose-400/30 hover:border-rose-400/60',
    text: 'text-rose-400',
    items: 'bg-rose-500 hover:bg-rose-500',
  },
  luck: {
    glowCls: 'emerald-glow',
    buttonTitle: 'bg-emerald-400 hover:bg-emerald-500  text-black',
    focusV: 'focus-visible:ring-emerald-400',
    sort1: 'bg-emerald-400 hover:bg-emerald-500',
    sort2: 'border-emerald-400 text-emerald-400',
    sortArr: 'bg-emerald-500 hover:bg-emerald-500',
    arrKey: 'border-emerald-400/30 hover:border-emerald-400/60',
    text: 'text-emerald-400',
    items: 'bg-emerald-500 hover:bg-emerald-500',
  },
  soul: {
    glowCls: 'soul-glow',
    buttonTitle: 'bg-sky-400 hover:bg-sky-500 text-black',
    focusV: 'focus-visible:ring-sky-400',
    sort1: 'bg-sky-400 hover:bg-sky-500',
    sort2: 'border-sky-400 text-sky-400',
    sortArr: 'bg-sky-500 hover:bg-sky-500',
    arrKey: 'border-sky-400/30 hover:border-sky-400/60',
    text: 'text-sky-400',
    items: 'bg-sky-500 hover:bg-sky-500',
  },
  dream: {
    glowCls: 'dream-glow',
    buttonTitle: 'bg-violet-400 hover:bg-violet-500 text-black',
    focusV: 'focus-visible:ring-violet-400',
    sort1: 'bg-violet-400 hover:bg-violet-500',
    sort2: 'border-violet-400 text-violet-400',
    sortArr: 'bg-violet-500 hover:bg-violet-500',
    arrKey: 'border-violet-400/30 hover:border-violet-400/60',
    text: 'text-violet-400',
    items: 'bg-violet-500 hover:bg-violet-500',
  },
}
