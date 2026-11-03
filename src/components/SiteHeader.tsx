import HeaderNav from "./HeaderNav";
import Logo from "./Logo";
import MenuOverlay from "./MenuOverlay";

/**
 * The brand bar shared by every public page.
 * `floating` lays it transparently over the home hero instead of sitting
 * in flow on a solid bar.
 */
export default function SiteHeader({ floating = false }: { floating?: boolean }) {
  return (
    <header
      className={
        floating
          ? "absolute inset-x-0 top-0 z-20"
          : "relative border-b border-snow/10 bg-coal"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Logo />
        <HeaderNav />
        <div className="lg:hidden">
          <MenuOverlay />
        </div>
      </div>
    </header>
  );
}
