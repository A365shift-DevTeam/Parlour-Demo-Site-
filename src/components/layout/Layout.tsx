import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { brand } from "../../config/brand";
import { cn } from "../../lib/utils";
import { useStudioStore } from "../../store/useStudioStore";
import { buttonStyles } from "../common/UI";

const navItems = [
  ["Home", "/"],
  ["Virtual Studio", "/studio"],
  ["Services", "/services"],
  ["Packages", "/packages"],
  ["Specialists", "/specialists"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

function BrandMark() {
  return (
    <Link to="/" className="group flex min-h-12 items-center gap-3" aria-label={`${brand.name} home`}>
      <span className="grid size-10 place-items-center rounded-full border border-champagne-500/40 bg-white text-rose-600 shadow-hairline transition group-hover:rotate-6">
        <Sparkles size={18} />
      </span>
      <span>
        <span className="block font-display text-2xl font-bold leading-5 tracking-tight text-charcoal">
          {brand.name}
        </span>
        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.23em] text-ink/55">
          Virtual Beauty Studio
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const selectedCount = useStudioStore((state) => state.selectedServiceIds.length);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[200] -translate-y-20 rounded-full bg-charcoal px-4 py-3 text-sm font-semibold text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-charcoal/8 bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between gap-5 px-4 sm:px-6 xl:px-8">
          <BrandMark />
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
            {navItems.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "relative flex min-h-11 items-center rounded-full px-3 text-[13px] font-semibold text-ink/70 transition hover:bg-rose-50 hover:text-rose-700",
                    isActive && "bg-rose-50 text-rose-700",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/studio" className={cn(buttonStyles.secondary, "relative px-5")}>
              <Sparkles size={17} />
              Open Studio
              {selectedCount > 0 && (
                <span className="grid size-6 place-items-center rounded-full bg-rose-600 text-[11px] text-white">
                  {selectedCount}
                </span>
              )}
            </Link>
            <Link to="/booking" className={cn(buttonStyles.primary, "px-5")}>
              Book Appointment
            </Link>
          </div>
          <button
            type="button"
            className="grid size-12 place-items-center rounded-full border border-charcoal/10 text-charcoal lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-0 top-[76px] z-40 max-h-[calc(100dvh-76px)] overflow-y-auto border-b border-charcoal/10 bg-canvas p-5 shadow-lift lg:hidden"
          >
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold",
                      isActive ? "bg-rose-50 text-rose-700" : "text-charcoal hover:bg-ivory",
                    )
                  }
                >
                  {label}
                  <ArrowRight size={16} />
                </NavLink>
              ))}
            </nav>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link to="/studio" className={buttonStyles.secondary}>
                Open Studio
              </Link>
              <Link to="/booking" className={buttonStyles.primary}>
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-charcoal/8 bg-[#211b1e] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_.8fr_.8fr_.8fr]">
        <div>
          <div className="font-display text-4xl font-semibold">{brand.name}</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
            Curated beauty references, thoughtful service discovery and appointments designed around you.
          </p>
          <div className="mt-6 flex gap-2">
            <a href={brand.social.instagram} className="grid size-11 place-items-center rounded-full border border-white/15" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-champagne-300">Visit</div>
          <p className="mt-4 flex gap-3 text-sm leading-6 text-white/70">
            <MapPin className="mt-1 shrink-0" size={17} />
            {brand.address}
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-champagne-300">Contact</div>
          <a href={`tel:${brand.phone}`} className="mt-4 flex min-h-11 items-center gap-3 text-sm text-white/70">
            <Phone size={17} />
            {brand.phone}
          </a>
          <a href={`mailto:${brand.email}`} className="flex min-h-11 items-center gap-3 text-sm text-white/70">
            <BookOpen size={17} />
            {brand.email}
          </a>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-champagne-300">Hours</div>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Mon–Fri: {brand.businessHours.weekdays}
            <br />
            Sat–Sun: {brand.businessHours.weekends}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {brand.name}. Avatar previews are illustrative style references only.
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="min-h-dvh bg-canvas">
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
