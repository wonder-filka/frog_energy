import { Button } from "./ui/button";
import { getDictionary, getLocale } from "@/get-dictionary";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";


export const ButtonHome = async () => {
  const t = await getDictionary()
  const locale = await getLocale()
  return (

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          size="lg"
          variant="link"
          className="w-full sm:w-auto rounded-full text-base"
          nativeButton={false}
          render={<Link href={`/${locale}/buy`} />}
        >
          {t.home.hero.start}
          <ArrowUpRight className="!h-5 !w-5" />
        </Button>
      </div>
  );
};
