"use client";
import PostRatesButton from "./PostRateButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Clock, LayoutGrid, Loader2 } from "lucide-react";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";

type CardCount = 2 | 3 | 4 | 5 | 6;

type Props = {
  updatedDate: Date;
  cardCount: number;
  onCardCountChange: (count: CardCount) => void;
  saveStatus?: "idle" | "saving" | "saved";
};

const LOCALE_MAP: Record<string, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh",
  es: "es",
};

export default function CurrencyHeader({
  updatedDate,
  cardCount,
  onCardCountChange,
  saveStatus = "idle",
}: Props) {
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const locale = LOCALE_MAP[lang] ?? "ko";
  const countSuffix = t("countItems", lang);

  return (
    <div className="flex justify-between items-center mt-1">
      <div className="flex items-center gap-1.5 text-slate-400">
        {saveStatus === "saving" ? (
          <>
            <Loader2 className="size-3.5 animate-spin text-blue-400" />
            <p className="text-xs font-medium text-blue-400">{t("saving", lang)}</p>
          </>
        ) : saveStatus === "saved" ? (
          <>
            <Check className="size-3.5 text-green-500" />
            <p className="text-xs font-medium text-green-500">{t("saved", lang)}</p>
          </>
        ) : (
          <>
            <Clock className="size-3.5" />
            <p className="text-xs font-medium">
              {new Date(updatedDate).toLocaleString(locale, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-1.5">
          <LayoutGrid className="size-4 text-slate-400" />
          <Select
            value={String(cardCount)}
            onValueChange={(v) => onCardCountChange(Number(v) as CardCount)}
          >
            <SelectTrigger size="sm" className="w-20 bg-white/80 dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6].map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count}{countSuffix}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {process.env.NODE_ENV === "development" && <PostRatesButton />}
      </div>
    </div>
  );
}
