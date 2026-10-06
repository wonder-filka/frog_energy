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
import { SettingsNameSchema } from "@/lib/schemas"
import { translateSettingsMessage, type SettingsDict } from "@/lib/settings-dict"
import { updateUserName } from "../_actions"

type BasicSettingsFormValues = z.infer<typeof SettingsNameSchema>

interface UserBasicSettingsProps {
  firstName: string
  t: SettingsDict
}

export const BasicSettingsFormName = ({ firstName, t }: UserBasicSettingsProps) => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const form = useForm<BasicSettingsFormValues>({
    resolver: zodResolver(SettingsNameSchema),
    defaultValues: {
      firstName: firstName || "",
    },
  })

  const onSubmit: SubmitHandler<BasicSettingsFormValues> = async (values) => {
    startTransition(async () => {
      const result = await updateUserName(values)
      if (!result.ok) {
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
        <CardTitle>{t.labels.basicSettings} {t.labels.firstName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-first-name">{t.labels.firstName}</FieldLabel>
                  <Input id="settings-first-name" disabled={pending} placeholder={t.labels.firstName} aria-invalid={fieldState.invalid} {...field} />
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
