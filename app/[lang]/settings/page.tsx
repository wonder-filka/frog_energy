import type { Metadata } from 'next';
import { getDictionary, getLocale } from "@/get-dictionary";
import { authDict } from "@/lib/auth-dict";
import { settingsDict } from "@/lib/settings-dict";
import { getSessionUserId } from "@/lib/session";
import { getUserBasicSettings } from "@/lib/user";
import { RegistrationForm } from "../registration/_components/registration-form";
import { ChangePasswordForm } from "./_components/password-form";
import { BasicSettingsFormName } from "./_components/settings-form-name";
import { BasicSettingsFormEmail } from "./_components/settings-form-email";

export async function generateMetadata({ params }: PageProps<'/[lang]/settings'>): Promise<Metadata> {
  const { lang } = await params
  const canonicalUrl = `https://frog-energy.com/${lang}/settings`;

  return {
    title: 'Account Settings | Frog Energy',
    description: 'Manage your profile, change your email and password, or update your personal information.',
    alternates: {
      canonical: canonicalUrl,
    },
    robots: { index: false, follow: false },
  };
}

export default async function SettingsPage() {
  const [t, locale, userId] = await Promise.all([getDictionary(), getLocale(), getSessionUserId()])
  const userBasicSettings = userId ? await getUserBasicSettings(userId) : null

  if (!userBasicSettings) {
    return (
      <div className="flex gap-2 items-center p-4 my-12 md:p-8">
        <div className='mx-auto grid w-[400px] gap-6'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>{t.register}</h1>
            <p className='text-balance text-muted-foreground'>{t.registerFormDescription}</p>
          </div>
          <RegistrationForm t={authDict(t)} locale={locale} />
        </div>
      </div>
    )
  }

  const st = settingsDict(t)
  return (
    <div className="p-6 md:p-8 space-y-4">
      <h1 className="text-3xl font-bold">{t.settingsTitle}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BasicSettingsFormName firstName={userBasicSettings.firstName} t={st} />
        <BasicSettingsFormEmail email={userBasicSettings.email} t={st} />
        <ChangePasswordForm t={st} />
      </div>
    </div>
  );
}
