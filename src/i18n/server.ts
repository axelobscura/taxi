import { lang as langParam } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLang, type Lang } from "./config";
import { getDict, type Dict } from "./dictionaries";

/**
 * Current language for Server Components under `app/[lang]`, without
 * passing it down as a prop. 404s on anything that isn't a site language.
 */
export async function getLang(): Promise<Lang> {
  const value = await langParam();
  if (!value || !hasLang(value)) notFound();
  return value;
}

export async function getI18n(): Promise<{ lang: Lang; dict: Dict }> {
  const lang = await getLang();
  return { lang, dict: getDict(lang) };
}
