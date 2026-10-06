'use client';

import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { LoginSchema, RegistrationSchema } from "@/lib/schemas";
import { translateMessage, type AuthDict } from "@/lib/auth-dict";
import type { BuyDict } from "../_dict";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { loginInline, signupInline } from "../_actions";

interface LogOrRegProps {
  userId?: string | null;
  setUserId: Dispatch<SetStateAction<string | null>>;
  error: boolean;
  t: BuyDict;
  authT: AuthDict;
}

// Password input with a show/hide toggle, as on the /login and /registration pages
const PasswordInput = ({ id, show, onToggle, labels, ...props }: React.ComponentProps<typeof Input> & {
  id: string
  show: boolean
  onToggle: () => void
  labels: AuthDict["labels"]
}) => (
  <div className="relative">
    <Input id={id} type={show ? "text" : "password"} {...props} />
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="absolute right-1 top-1/2 -translate-y-1/2"
      aria-label={show ? labels.hide : labels.show}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  </div>
);

export const LogOrReg = ({ userId, setUserId, error, t, authT }: LogOrRegProps) => {
  const router = useRouter();
  const [pendingLogin, startLogin] = useTransition();
  const [pendingReg, startReg] = useTransition();

  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [tabValue, setTabValue] = useState<"login" | "registration">("registration");

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const regForm = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: { firstName: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  // The session cookie is set by the action; refresh so the header and sidebar
  // show the user, while the order form keeps its state
  const onAuthenticated = (id: string) => {
    setUserId(id)
    router.refresh()
  }

  const onSubmitLogin: SubmitHandler<z.infer<typeof LoginSchema>> = async (values) => {
    regForm.clearErrors()
    loginForm.clearErrors()
    startLogin(async () => {
      const res = await loginInline(values)
      if ("message" in res) {
        loginForm.setError('email', { type: 'manual', message: res.message })
        return
      }
      onAuthenticated(res.userId)
    })
  }

  const onSubmitReg: SubmitHandler<z.infer<typeof RegistrationSchema>> = async (values) => {
    regForm.clearErrors()
    loginForm.clearErrors()
    startReg(async () => {
      const res = await signupInline(values)
      if ("message" in res) {
        regForm.setError('email', { type: 'manual', message: res.message })
        return
      }
      onAuthenticated(res.userId)
    })
  }

  if (pendingReg || pendingLogin) return (
    <div className="flex justify-center items-center w-full md:w-72 h-48">
      <LoaderCircle size={25} className="text-violet-400 animate-spin" />
    </div>
  )

  const labels = authT.labels
  const msg = (key?: string) => translateMessage(authT.messages, key)

  return (
    <Card className={cn(
      error && "border-red-500 border",
      "space-y-2 border rounded-2xl bg-transparent w-full md:w-72"
    )}>
      <CardHeader>
        <CardTitle>{t.labels.authChoose}</CardTitle>
        <CardDescription>{t.labels.continueToBuy}</CardDescription>
      </CardHeader>

      <CardContent>
        {userId ? <div>
          <Check className="mx-auto mb-4 h-12 w-12 text-green-500" />
        </div> :
          <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as "login" | "registration")} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">{labels.login}</TabsTrigger>
              <TabsTrigger value="registration">{labels.register}</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login" className="mt-4">
              <form onSubmit={loginForm.handleSubmit(onSubmitLogin)}>
                <FieldGroup className="gap-4">
                  <Controller
                    control={loginForm.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="buy-login-email">{labels.email}</FieldLabel>
                        <Input id="buy-login-email" disabled={pendingLogin} type="email" placeholder={labels.email}
                          autoComplete="email" aria-invalid={fieldState.invalid} {...field} />
                        <FieldError>{msg(fieldState.error?.message)}</FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    control={loginForm.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="buy-login-password">{labels.password}</FieldLabel>
                        <PasswordInput id="buy-login-password" show={showLoginPass} onToggle={() => setShowLoginPass((v) => !v)}
                          labels={labels} disabled={pendingLogin} placeholder={labels.password} autoComplete="current-password"
                          aria-invalid={fieldState.invalid} {...field} />
                        <FieldError>{msg(fieldState.error?.message)}</FieldError>
                      </Field>
                    )}
                  />
                  <Button disabled={pendingLogin} type="submit" className="mt-4 w-full text-black">
                    {labels.login}
                  </Button>
                </FieldGroup>
              </form>
            </TabsContent>

            {/* REG TAB */}
            <TabsContent value="registration" className="mt-4">
              <form onSubmit={regForm.handleSubmit(onSubmitReg)}>
                <FieldGroup className="gap-4">
                  <Controller
                    control={regForm.control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="buy-reg-first-name">{labels.firstName}</FieldLabel>
                        <Input id="buy-reg-first-name" disabled={pendingReg} placeholder={labels.firstName}
                          autoComplete="given-name" aria-invalid={fieldState.invalid} {...field} />
                        <FieldDescription className="text-xs text-muted-foreground">
                          {labels.firstNameHelp}
                        </FieldDescription>
                        <FieldError>{msg(fieldState.error?.message)}</FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    control={regForm.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="buy-reg-email">{labels.email}</FieldLabel>
                        <Input id="buy-reg-email" disabled={pendingReg} type="email" placeholder={labels.email}
                          autoComplete="email" aria-invalid={fieldState.invalid} {...field} />
                        <FieldError>{msg(fieldState.error?.message)}</FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    control={regForm.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="buy-reg-password">{labels.password}</FieldLabel>
                        <PasswordInput id="buy-reg-password" show={showRegPass} onToggle={() => setShowRegPass((v) => !v)}
                          labels={labels} disabled={pendingReg} placeholder={labels.password} autoComplete="new-password"
                          aria-invalid={fieldState.invalid} {...field} />
                        <FieldError>{msg(fieldState.error?.message)}</FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    control={regForm.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="buy-reg-confirm">{labels.confirmPassword}</FieldLabel>
                        <PasswordInput id="buy-reg-confirm" show={showRegConfirm} onToggle={() => setShowRegConfirm((v) => !v)}
                          labels={labels} disabled={pendingReg} placeholder={labels.confirmPassword} autoComplete="new-password"
                          aria-invalid={fieldState.invalid} {...field} />
                        <FieldError>{msg(fieldState.error?.message)}</FieldError>
                      </Field>
                    )}
                  />
                  <Button disabled={pendingReg} type="submit" className="mt-4 w-full text-black">
                    {labels.register}
                  </Button>
                </FieldGroup>
              </form>
            </TabsContent>
          </Tabs>
        }
      </CardContent>
    </Card>
  );
}
