import { Settings, Heart, Clover, MoonStar, Sparkles, Coins, HomeIcon } from "lucide-react"
import type { Dictionary } from "@/get-dictionary"

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
