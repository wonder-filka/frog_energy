import { CopyButton } from "../../components/copy-button";
import Link from "next/link";


interface ContactCardProps {
  title: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
  href: string;
}

export const ContactCard = ({ title, value, Icon, href }: ContactCardProps) => {
  return (
    <div className="group relative">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-sm text-slate-500 dark:text-slate-400 flex gap-2 items-center">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          <div className="truncate text-md font-semibold  flex gap-2 items-center">
            <Link href={href} target="_blank" className="text-blue-400  underline hover:text-blue-300">
              {value}
            </Link>

            <CopyButton text={value} ariaLabel={`Скопировать ${title}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
