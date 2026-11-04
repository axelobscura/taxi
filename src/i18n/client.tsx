"use client";

import { createContext, useContext } from "react";
import { localePath, type Lang } from "./config";
import { getDict, type Dict } from "./dictionaries";

const I18nContext = createContext<Lang>("es");

/** Makes the page language available to Client Components below it. */
export function I18nProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>;
}

export function useI18n(): {
  lang: Lang;
  dict: Dict;
  path: (p: string) => string;
} {
  const lang = useContext(I18nContext);
  return { lang, dict: getDict(lang), path: (p) => localePath(lang, p) };
}
