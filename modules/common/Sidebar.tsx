"use client";
import { Calculator, CalendarDays, ChartLine, Globe, Loader2, LogIn, LogOut, MapPin, Moon, Plane, Sun, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLanguageClick: () => void;
};

const MENU_ITEMS = [
  { href: "/", icon: Calculator, labelKey: "currencyCalculator" },
  { href: "/chart", icon: ChartLine, labelKey: "chart" },
  { href: "/calendar", icon: CalendarDays, labelKey: "calendar" },
  { href: "/travel", icon: Plane, labelKey: "travelExpense" },
  { href: "/map", icon: MapPin, labelKey: "exchange" },
] as const;

export default function Sidebar({ isOpen, onClose, onLanguageClick }: Props) {
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const pathname = usePathname();
  const { data: session } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-zinc-900 z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User profile / Login */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t("menu", lang)}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="size-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {session?.user ? (
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    width={40}
                    height={40}
                    alt="profile"
                    className="rounded-full"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-slate-300 text-sm font-bold">
                    {session.user.name?.[0] ?? "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <LogIn className="size-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {t("login", lang)}
                </span>
              </Link>
            )}
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-3 py-3">
            {MENU_ITEMS.map(({ href, icon: Icon, labelKey }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-colors ${
                    isActive
                      ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-sm">{t(labelKey, lang)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-3 pb-5 border-t border-slate-100 dark:border-zinc-800 pt-3 space-y-1">
            <button
              onClick={() => {
                onClose();
                onLanguageClick();
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Globe className="size-5" />
              <span className="text-sm">{t("language", lang)}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
              <span className="text-sm">{t("darkMode", lang)}</span>
            </button>

            {session?.user && (
              <button
                onClick={async () => {
                  if (loggingOut) return;
                  setLoggingOut(true);
                  await signOut();
                }}
                disabled={loggingOut}
                className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {loggingOut ? <Loader2 className="size-5 animate-spin" /> : <LogOut className="size-5" />}
                <span className="text-sm">{loggingOut ? t("loggingOut", lang) : t("logout", lang)}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
