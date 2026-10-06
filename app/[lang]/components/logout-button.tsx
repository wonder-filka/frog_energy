'use client'

import { LogOut } from "lucide-react"
import { useTransition } from "react"
import { logout } from "../_actions"
import { SidebarMenuButton } from "./ui/sidebar"
import { DropdownMenuItem } from "./ui/dropdown-menu"

type LogoutProps = {
  label: string
  redirectTo: string
}

export const SidebarLogoutButton = ({ label, redirectTo }: LogoutProps) => {
  const [pending, startTransition] = useTransition()

  return (
    <SidebarMenuButton
      disabled={pending}
      onClick={() => startTransition(() => logout(redirectTo))}
    >
      <LogOut />
      <span>{label}</span>
    </SidebarMenuButton>
  )
}

export const DropdownLogoutItem = ({ label, redirectTo }: LogoutProps) => {
  const [pending, startTransition] = useTransition()

  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={() => startTransition(() => logout(redirectTo))}
    >
      {label}
    </DropdownMenuItem>
  )
}
