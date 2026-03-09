"use client";
import { Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LanguegePopup from "../currency/LanguagePopup";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";

export default function Header() {
  const [isLanPopShow, setIsLanPopShow] = useState(false);
  const { language } = useLangueStore();
  const lang = language as LangCode;

  return (
    <>
      {isLanPopShow && <LanguegePopup setIsLanPopShow={setIsLanPopShow} />}
      <div className="relative flex justify-between items-center px-5 pt-4">
        <button onClick={() => setIsLanPopShow(!isLanPopShow)}>
          <Globe className="hover:text-blue-500" />
        </button>

        <p className="absolute left-1/2 -translate-x-1/2 transform text-2xl font-bold">
          {t("currencyCalculator", lang)}
        </p>
        <Link className="text-md font-bold hover:text-blue-500" href={"/map"}>
          {t("exchange", lang)}
        </Link>
      </div>
    </>
  );
}
