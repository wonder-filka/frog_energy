import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDictionary, getLocale } from "@/get-dictionary";
import { authDict } from "@/lib/auth-dict";
import { getSessionUserId } from "@/lib/session";
import { RegistrationForm } from "./_components/registration-form";

export async function generateMetadata({ params }: PageProps<"/[lang]/registration">): Promise<Metadata> {
  const { lang } = await params
  const canonicalUrl = `https://frog-energy.com/${lang}/registration`;

  return {
    title: 'Register for a Free Frog Energy Account',
    description: 'Join Frog Energy today. Create your account to start manifesting your dreams, love, money, and luck with our powerful energy boards.',
    robots: { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function Page() {
    const t = await getDictionary()
    const locale = await getLocale()
    const userId = await getSessionUserId()
    if (userId) redirect(`/${locale}/money`)
    return (
        <div className='flex items-center justify-center p-4 my-12'>
            <div className='mx-auto grid w-[400px] gap-6'>
                <div className='grid gap-2 text-center'>
                    <h1 className='text-3xl font-bold'>{t.register}</h1>
                    <p className='text-balance text-muted-foreground'>{t.registerFormDescription}</p>
                </div>
                <RegistrationForm t={authDict(t)} locale={locale} />
            </div>

        </div>
    )

};
