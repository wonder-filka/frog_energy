'use client'

import { useState, useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { LoginSchema } from "@/lib/schemas";
import { translateMessage, type AuthDict } from "@/lib/auth-dict";
import type { Locale } from "@/i18n-config";

import { Input } from "../../components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../components/ui/field";
import { Button } from "../../components/ui/button";
import { login } from "../_actions";

interface LoginFormProps {
    t: AuthDict
    locale: Locale
}

export const LoginForm = ({ t, locale }: LoginFormProps) => {
    const [pending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // On success the action redirects, so only errors come back
    const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = async data => {
        startTransition(async () => {
            const result = await login(data, locale);
            if (result?.message === 'incorrectCredentials') {
                form.setError('email', {
                    type: 'manual',
                    message: "incorrectCredentials",
                });
            } else if (result?.message) {
                form.setError('email', {
                    type: 'manual',
                    message: "manualError",
                });
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-email">{t.labels.email}</FieldLabel>
                            <Input id="login-email" disabled={pending} type="email" placeholder={t.labels.email} aria-invalid={fieldState.invalid} {...field} />
                            <FieldError>{translateMessage(t.messages, fieldState.error?.message)}</FieldError>
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-password">{t.labels.password}</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="login-password"
                                    disabled={pending}
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t.labels.password}
                                    autoComplete="current-password"
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
                <div className="flex justify-end">
                    <Link className="text-primary font-bold" href={`/${locale}/forgot`}>{t.labels.forgotPass}</Link>
                </div>
                <Button disabled={pending} type="submit" className="w-full mt-8">
                    {t.labels.login}
                </Button>
                <Button variant="outline" className="w-full" nativeButton={false} render={<Link href={`/${locale}/registration`} />}>
                    {t.labels.register}
                </Button>
            </FieldGroup>
        </form>
    );
};
