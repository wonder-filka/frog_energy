'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NewPasswordSchema } from '@/lib/schemas';
import { translateMessage, type AuthDict } from '@/lib/auth-dict';
import type { Locale } from '@/i18n-config';
import { resetPasswordFinalize } from '../_actions';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../../components/ui/field';

interface FormNewPassProps {
  email: string
  code: string
  t: AuthDict
  locale: Locale
}

export const FormNewPass = ({ email, code, t, locale }: FormNewPassProps) => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    startTransition(async () => {
      const res = await resetPasswordFinalize(email, code, data.password);
      if (res.ok) {
        setIsSuccess(true);
        form.reset();
        router.push(`/${locale}/login`)
      } else {
        const msg =
          res.error === 'invalidCode' ? 'invalidCode' :
            res.error === 'emailNotFound' ? 'invalidEmail' :
              'error';
        form.setError('password', { type: 'server', message: msg });
      }
    });
  };

  return isSuccess ? (
    <div className="text-green-600 text-sm w-full flex flex-col gap-4 items-center">
      {t.labels.passwordChangedSuccess}
      <CheckCircle />
    </div>
  ) : (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="new-password">{t.labels.newPassword}</FieldLabel>
              <Input id="new-password" type="password" disabled={isPending} placeholder="••••••••" aria-invalid={fieldState.invalid} {...field} />
              <FieldError>{translateMessage(t.messages, fieldState.error?.message)}</FieldError>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="confirm"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="new-password-confirm">{t.labels.confirmPassword}</FieldLabel>
              <Input id="new-password-confirm" type="password" disabled={isPending} placeholder="••••••••" aria-invalid={fieldState.invalid} {...field} />
              <FieldError>{translateMessage(t.messages, fieldState.error?.message)}</FieldError>
            </Field>
          )}
        />
        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {t.labels.savePassword}
        </Button>
      </FieldGroup>
    </form>
  );
}
