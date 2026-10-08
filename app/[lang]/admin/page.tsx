import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/get-dictionary";
import { NotFoundContent } from "../components/not-found-content";
import { getAdminUserId, getAllBoardAssignmentsAdmin } from "./_data";
import { AdminTable } from "./_components/admin-table";

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default async function Page() {
	const adminId = await getAdminUserId()

	if (!adminId) {
		const [t, locale] = await Promise.all([getDictionary(), getLocale()])
		return (
			<div className="p-4">
				<NotFoundContent t={t.notfound} locale={locale} />
			</div>
		)
	}

	const data = await getAllBoardAssignmentsAdmin()
	return (
		<main className="p-4 space-y-4">
			<div className="grid grid-cols-1">
				<AdminTable data={data} />
			</div>
		</main>
	)
}
