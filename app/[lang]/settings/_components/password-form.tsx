'use client'

import { useTransition } from "react"
import { Controller, useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "../../components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ChangePasswordSchema } from "@/lib/schemas"
import { translateSettingsMessage, type SettingsDict } from "../_dict"
import { changeUserPassword } from "../_actions"

type PasswordFormValues = z.infer<typeof ChangePasswordSchema>

interface ChangePasswordProps {
  t: SettingsDict
}

export const ChangePasswordForm = ({ t }: ChangePasswordProps) => {
  const [pending, startTransition] = useTransition()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const onSubmit: SubmitHandler<PasswordFormValues> = async (values) => {
    startTransition(async () => {
      const result = await changeUserPassword(values)
      if (!result.ok && result.message === "currentPasswordIncorrect") {
        form.setError("currentPassword", { type: "server", message: result.message })
      } else if (!result.ok) {
        toast.error(t.toasts.changePasswordFailed, {
          style: { color: 'white', backgroundColor: 'red' },
        })
      } else {
        toast.success(t.toasts.passwordUpdated, {
          style: { color: 'white', backgroundColor: 'green' },
        })
        form.reset()
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.labels.changePasswordTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="currentPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-current-password">{t.labels.currentPassword}</FieldLabel>
                  <Input
                    id="settings-current-password"
                    type="password"
                    placeholder={t.labels.currentPassword}
                    autoComplete="current-password"
                    disabled={pending}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <FieldError>{translateSettingsMessage(t.messages, fieldState.error?.message)}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-new-password">{t.labels.newPassword}</FieldLabel>
                  <Input
                    id="settings-new-password"
                    type="password"
                    placeholder={t.labels.newPassword}
                    autoComplete="new-password"
                    disabled={pending}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <FieldError>{translateSettingsMessage(t.messages, fieldState.error?.message)}</FieldError>
                </Field>
              )}
            />
            <Button type="submit" disabled={pending} className="mt-8 w-fit">
              {t.labels.updatePassword}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
