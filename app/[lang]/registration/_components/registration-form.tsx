'use client';

import { useState, useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { RegistrationSchema } from "@/lib/schemas";
import { translateMessage, type AuthDict } from "@/lib/auth-dict";
import type { Locale } from "@/i18n-config";
import { signup } from "../_actions";

import { Input } from "../../components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../components/ui/field";
import { Button } from "../../components/ui/button";

interface RegistrationFormProps {
  t: AuthDict
  locale: Locale
}

export const RegistrationForm = ({ t, locale }: RegistrationFormProps) => {
  const [pending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // On success the action redirects, so only errors come back
  const onSubmit: SubmitHandler<z.infer<typeof RegistrationSchema>> = async (data) => {
    startTransition(async () => {
      console.log("submitting registration form", data);
      console.log("locale", locale);  
      const result = await signup(data, locale);
      console.log("signup result", result); 
      if (result?.message === "emailExists") {
        form.setError("email", { type: "manual", message: "emailExists" });
      } else if (result?.message === "signupFailed") {
        form.setError("email", { type: "manual", message: "signupFailed" });
      } else if (result?.message) {
        form.setError("email", { type: "manual", message: "manualError" });
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reg-first-name">{t.labels.firstName}</FieldLabel>
              <Input
                id="reg-first-name"
                disabled={pending}
                placeholder={t.labels.firstName}
                autoComplete="given-name"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldDescription className="text-xs text-muted-foreground">
                {t.labels.firstNameHelp}
              </FieldDescription>
              <FieldError>{translateMessage(t.messages, fieldState.error?.message)}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reg-email">{t.labels.email}</FieldLabel>
              <Input
                id="reg-email"
                type="email"
                disabled={pending}
                placeholder={t.labels.email}
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldError>{translateMessage(t.messages, fieldState.error?.message)}</FieldError>
            </Field>
          )}
        />

        {/* Пароль */}
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reg-password">{t.labels.password}</FieldLabel>
              <div className="relative">
                <Input
                  id="reg-password"
                  disabled={pending}
                  type={showPassword ? "text" : "password"}
                  placeholder={t.labels.password}
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? t.labels.hide : t.labels.show}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <FieldError>{translateMessage(t.messages, fieldState.error?.message)}</FieldError>
            </Field>
          )}
        />

        {/* Подтверждение пароля */}
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reg-confirm-password">{t.labels.confirmPassword}</FieldLabel>
              <div className="relative">
                <Input
                  id="reg-confirm-password"
                  disabled={pending}
                  type={showConfirm ? "text" : "password"}
                  placeholder={t.labels.confirmPassword}
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  aria-label={showConfirm ? t.labels.hide : t.labels.show}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <FieldError>{translateMessage(t.messages, fieldState.error?.message)}</FieldError>
            </Field>
          )}
        />

        <Button disabled={pending} type="submit" className="w-full mt-12">
          {t.labels.register}
        </Button>
        <Button variant="outline" className="w-full" nativeButton={false} render={<Link href={`/${locale}/login`} />}>
          {t.labels.login}
        </Button>
      </FieldGroup>
    </form>
  );
};
