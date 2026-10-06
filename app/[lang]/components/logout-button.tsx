'use client'

import { LogOut } from "lucide-react"
import { useTransition } from "react"
import { deleteSession } from "@/lib/session"
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
      onClick={() => startTransition(() => deleteSession(redirectTo))}
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
      onClick={() => startTransition(() => deleteSession(redirectTo))}
    >
      {label}
    </DropdownMenuItem>
  )
}
