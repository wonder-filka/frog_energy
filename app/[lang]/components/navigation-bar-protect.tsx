import Link from "next/link";
import { getDictionary, getLocale } from "@/get-dictionary";
import { LangToggle } from "./toggle-language";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "./ui/sheet";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { sidebarItems } from "@/lib/constants";
import { SidebarTrigger } from "./ui/sidebar";
import { UpdateUserBasicSettingsInput } from "@/lib/types";
import { DropdownLogoutItem } from "./logout-button";


const MenuIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

interface UserBasicSettingsProps {
    data?: UpdateUserBasicSettingsInput | null
    userId?: string | null
}

export const ProtectedHeader = async ({ data, userId }: UserBasicSettingsProps) => {
    const t = await getDictionary();
    const locale = await getLocale();
    const href = (path: string) => `/${locale}${path}`;

    const boardLinks = [
        { href: href('/money'), label: t.dashboard.prosperityBoard },
        { href: href('/love'), label: t.dashboard.love },
        { href: href('/luck'), label: t.dashboard.luck },
        { href: href('/soul'), label: t.sidebar.soulTitle },
        { href: href('/dream'), label: t.dashboard.dream },
    ];

    return (
        <header className="sticky top-0 z-50 flex w-full justify-between items-center p-2 border-b">
            {/* Mobile menu */}
            <Sheet>
                <SheetTrigger className="md:hidden"><MenuIcon /></SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle className="text-amber-400">
                            <SheetClose className="text-start" nativeButton={false} render={<Link href={href('')} />}>
                                Frog Energy
                            </SheetClose>
                        </SheetTitle>
                        <div className="grid gap-4 p-4">
                            {sidebarItems.map((item) => (
                                <SheetClose key={item.key} className="text-start" nativeButton={false} render={<Link href={href(item.url)} />}>
                                    {item.label(t)}
                                </SheetClose>
                            ))}
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
            <SidebarTrigger className="hidden md:flex" />
            {/* Logo */}
            <Link href={href('')} className="flex md:hidden font-bold text-xl items-center text-amber-400">Frog Energy</Link>

            {/* User & Lang */}
            <div className="flex gap-4 items-center">
                <LangToggle locale={locale} />
                <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer rounded-full">
                        <Avatar>
                            <AvatarFallback>
                                {(data?.firstName?.[0] || "U").toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>{data?.firstName ?? t.dashboard.unauthorizedUser}</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem render={<Link href={href('/home')} />}>{t.homePage}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {boardLinks.map((link) => (
                            <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>{link.label}</DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem render={<Link href={href('/buy')} />}>{t.dialog.newCell.submitMulti}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem render={<Link href={href('/settings')} />}>{t.sidebar.settings}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {userId ? (
                            <DropdownLogoutItem label={t.logout} redirectTo={href('/login')} />
                        ) : (
                            <>
                                <DropdownMenuItem render={<Link href={href('/registration')} />}>{t.register}</DropdownMenuItem>
                                <DropdownMenuItem render={<Link href={href('/login')} />}>{t.login}</DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
