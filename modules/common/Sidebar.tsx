"use client";
import { Calculator, Globe, MapPin, Plane, X } from "lucide-react";
import Link from "next/link";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import { usePathname } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLanguageClick: () => void;
};

const MENU_ITEMS = [
  { href: "/", icon: Calculator, labelKey: "currencyCalculator" },
  { href: "/travel", icon: Plane, labelKey: "travelExpense" },
  { href: "/map", icon: MapPin, labelKey: "exchange" },
] as const;

export default function Sidebar({ isOpen, onClose, onLanguageClick }: Props) {
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const pathname = usePathname();

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
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Menu</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="size-5 text-slate-500" />
            </button>
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
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-sm">{t(labelKey, lang)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Language button at bottom */}
          <div className="px-3 pb-5 border-t border-slate-100 pt-3">
            <button
              onClick={() => {
                onClose();
                onLanguageClick();
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Globe className="size-5" />
              <span className="text-sm">Language</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
