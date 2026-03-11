"use client";
import { Map, Menu } from "lucide-react";
import { useState } from "react";
import MapContent from "./MapContent";
import Sidebar from "../common/Sidebar";
import LanguegePopup from "../currency/LanguagePopup";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";

export default function MapMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanPopShow, setIsLanPopShow] = useState(false);
  const { language } = useLangueStore();
  const lang = language as LangCode;

  return (
    <div>
      {isLanPopShow && <LanguegePopup setIsLanPopShow={setIsLanPopShow} />}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLanguageClick={() => setIsLanPopShow(true)}
      />

      <div className="relative flex justify-between items-center px-4 pt-5 pb-2">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-full hover:bg-white/70 dark:hover:bg-white/10 active:bg-white/90 transition-colors"
        >
          <Menu className="size-5 text-slate-600 dark:text-slate-300" />
        </button>

        <div className="absolute flex items-center gap-1.5 left-1/2 -translate-x-1/2 transform">
          <Map className="size-5 text-slate-600 dark:text-slate-300" />
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {t("exchangeLocation", lang)}
          </h1>
        </div>

        <div className="w-9" />
      </div>
      <MapContent />
    </div>
  );
}
