"use client";
import { useRouter } from "next/navigation";
import { Map } from "lucide-react";
import MapContent from "./MapContent";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";

export default function MapMain() {
  const router = useRouter();
  const { language } = useLangueStore();
  const lang = language as LangCode;

  return (
    <div>
      <div className="relative flex justify-between items-center">
        <p
          className="py-2 ml-2 my-2 font-bold hover:text-blue-500"
          onClick={() => router.push("/")}
        >
          {t("back", lang)}
        </p>
        <div className="absolute flex items-center gap-1 left-1/2 -translate-x-1/2 transform py-2 my-2 text-2xl font-bold">
          <Map />
          <p>{t("exchangeLocation", lang)}</p>
        </div>
        <p></p>
      </div>
      <MapContent />
    </div>
  );
}
