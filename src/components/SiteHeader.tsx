import HeaderNav from "./HeaderNav";
import LanguageSwitch from "./LanguageSwitch";
import Logo from "./Logo";
import MenuOverlay from "./MenuOverlay";
import { localePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

/**
 * The brand bar shared by every public page.
 * `floating` lays it transparently over the home hero instead of sitting
 * in flow on a solid bar.
 */
export default async function SiteHeader({ floating = false }: { floating?: boolean }) {
  const { lang, dict } = await getI18n();
  return (
    <header
      className={
        floating
          ? "absolute inset-x-0 top-0 z-20"
          : "relative border-b border-snow/10 bg-coal"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-1 py-4">
        <Logo href={localePath(lang, "/")} sub={dict.header.tagline} />
        <HeaderNav />
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitch />
          <MenuOverlay />
        </div>
      </div>
    </header>
  );
}
