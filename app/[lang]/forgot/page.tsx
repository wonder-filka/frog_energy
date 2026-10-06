import { redirect } from "next/navigation";
import { getDictionary, getLocale } from "@/get-dictionary";
import { authDict } from "@/lib/auth-dict";
import { getSessionUserId } from "@/lib/session";
import { ForgotForm } from "./_components/form";


export default async function Page() {
	const t = await getDictionary()
	const locale = await getLocale()
	const userId = await getSessionUserId()
	if (userId) redirect(`/${locale}/money`)
	return (
		<div className='flex items-center justify-center p-4 my-12 mb-28 min-h-[46vh]' >
			<div className='mx-auto grid w-[400px] gap-6'>
				<div className='grid gap-2 text-center'>
					<h1 className='text-3xl font-bold'>{t.forgotPass}</h1>
					<p className='text-balance text-muted-foreground'>{t.forgotPassDescription}</p>
				</div>
				<ForgotForm t={authDict(t)} locale={locale} />
			</div>
		</div>
	)

};
