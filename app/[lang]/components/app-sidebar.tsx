import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar"
import { User, UserPlus } from "lucide-react"
import Link from "next/link"
import { getDictionary, getLocale } from "@/get-dictionary"
import { sidebarItems } from "@/lib/constants"
import { UpdateUserBasicSettingsInput } from "@/lib/types"
import { SidebarLogoutButton } from "./logout-button"

interface AppSidebarProps {
  userId?: string | null
  data?: UpdateUserBasicSettingsInput | null
}

export const AppSidebar = async ({ userId, data, ...props }: React.ComponentProps<typeof Sidebar> & AppSidebarProps) => {
  const t = await getDictionary()
  const locale = await getLocale()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="!p-0" render={<Link href={`/${locale}`} />}>
              {/* Full name when expanded, initials when collapsed to icons */}
              <span className="truncate text-xl text-amber-400 font-bold group-data-[collapsible=icon]:hidden">
                Frog Energy
              </span>
              <span className="hidden font-bold text-amber-400 !overflow-visible group-data-[collapsible=icon]:inline">
                FE
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton render={<Link href={`/${locale}${item.url}`} />}>
                  <item.icon className={item.className} />
                  <span>{item.label(t)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        {userId && data ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarLogoutButton label={t.sidebar.logout} redirectTo={`/${locale}`} />
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href={`/${locale}/registration`} />}>
                <UserPlus />
                <span>{t.register}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href={`/${locale}/login`} />}>
                <User />
                <span>{t.login}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
