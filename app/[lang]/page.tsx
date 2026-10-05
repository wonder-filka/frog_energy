import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import LocaleSwitcher from "./components/locale-switcher";

export default async function IndexPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  return (
    <div>
      <LocaleSwitcher />
      <div>
        <p>Current locale: {lang}</p>
        <p>
          This text is rendered on the server:{" "}
          {dictionary["nav"].home}
        </p>
      </div>
    </div>
  );
}