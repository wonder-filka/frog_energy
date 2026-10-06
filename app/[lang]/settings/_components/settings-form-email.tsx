'use client'

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "../../components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { SettingsEmailSchema } from "@/lib/schemas"
import { translateSettingsMessage, type SettingsDict } from "@/lib/settings-dict"
import { updateUserEmail } from "../_actions"

type BasicSettingsFormValues = z.infer<typeof SettingsEmailSchema>

interface UserBasicSettingsProps {
  email: string
  t: SettingsDict
}

export const BasicSettingsFormEmail = ({ email, t }: UserBasicSettingsProps) => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const form = useForm<BasicSettingsFormValues>({
    resolver: zodResolver(SettingsEmailSchema),
    defaultValues: {
      email: email || "",
    },
  })

  const onSubmit: SubmitHandler<BasicSettingsFormValues> = async (values) => {
    startTransition(async () => {
      const result = await updateUserEmail(values)
      if (!result.ok && (result.message === "emailExists" || result.message === "invalidEmail")) {
        form.setError('email', { type: 'manual', message: result.message })
      } else if (!result.ok) {
        toast.error(t.toasts.updateFailed, {
          style: { color: 'white', backgroundColor: 'red' },
        })
      } else {
        toast.success(t.toasts.updated, {
          style: { color: 'white', backgroundColor: 'green' },
        })
        router.refresh()
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.labels.basicSettings} {t.labels.email}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-email">{t.labels.email}</FieldLabel>
                  <Input id="settings-email" disabled={pending} placeholder={t.labels.email} aria-invalid={fieldState.invalid} {...field} />
                  <FieldError>{translateSettingsMessage(t.messages, fieldState.error?.message)}</FieldError>
                </Field>
              )}
            />

            <Button type="submit" disabled={pending} className="mt-4 w-fit">
              {t.labels.save}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
