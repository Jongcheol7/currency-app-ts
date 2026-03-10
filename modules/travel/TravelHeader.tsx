"use client";
import { Home, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LanguegePopup from "../currency/LanguagePopup";
import Sidebar from "../common/Sidebar";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";

export default function TravelHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanPopShow, setIsLanPopShow] = useState(false);
  const { language } = useLangueStore();
  const lang = language as LangCode;

  return (
    <>
      {isLanPopShow && <LanguegePopup setIsLanPopShow={setIsLanPopShow} />}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLanguageClick={() => setIsLanPopShow(true)}
      />

      <div className="sticky top-0 z-30 bg-gradient-to-b from-slate-100 to-slate-100/95 backdrop-blur-sm">
        <div className="relative flex justify-between items-center px-1 pt-5 pb-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-white/70 active:bg-white/90 transition-colors"
          >
            <Menu className="size-5 text-slate-600" />
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 transform text-xl font-bold tracking-tight text-slate-800">
            {t("travelExpense", lang)}
          </h1>

          <Link
            href="/"
            className="p-2 rounded-full hover:bg-white/70 active:bg-white/90 transition-colors"
          >
            <Home className="size-5 text-slate-600" />
          </Link>
        </div>
      </div>
    </>
  );
}
