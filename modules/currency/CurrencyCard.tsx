"use client";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryInfo } from "@/lib/countryInfo";
import { useLangueStore } from "@/lib/store/useLangueStore";
import type { LangCode } from "@/lib/types";
import Image from "next/image";

type Props = {
  cardId: number;
  currencies: string[];
  selectedCountry: string[];
  setSelectedCountry: (value: string[]) => void;
  focusCard: number;
  setFocusCard: (value: number) => void;
  prices: number[];
};

export default function CurrencyCard({
  cardId,
  currencies,
  selectedCountry,
  setSelectedCountry,
  focusCard,
  setFocusCard,
  prices,
}: Props) {
  const currencyCode = selectedCountry[cardId];
  const { flag } = CountryInfo[currencyCode];
  const { language: settingLanguage } = useLangueStore();
  const lang = settingLanguage as LangCode;

  const handleCurrencyChange = (value: string) => {
    const newSelected = [...selectedCountry];
    newSelected[cardId] = value;
    setSelectedCountry(newSelected);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setFocusCard(cardId);
      }}
    >
      <Card
        className={`transition-all duration-200 cursor-pointer px-3 py-2 ${
          focusCard === cardId
            ? "border-2 border-blue-400/60 bg-blue-50/80 shadow-md shadow-blue-100"
            : "border-2 border-transparent bg-white/80 hover:bg-white hover:shadow-sm"
        }`}
      >
        {/* 모바일: 좌우 한 줄 */}
        <div className="flex items-center gap-2 sm:hidden">
          <Image
            src={flag}
            width={32}
            height={24}
            alt={currencyCode}
            className="rounded-sm shadow-sm shrink-0"
          />
          <Select value={currencyCode} onValueChange={handleCurrencyChange}>
            <SelectTrigger size="sm" className="w-[76px] shrink-0 text-xs bg-white/60 border-slate-200">
              <SelectValue>{currencyCode}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {CountryInfo[currency].names[lang]} ({currency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="flex-1 bg-slate-50/80 rounded-lg px-2.5 py-1.5 text-right font-bold text-sm min-w-[80px] tabular-nums tracking-tight">
            {prices[cardId].toLocaleString()}
          </p>
        </div>

        {/* 데스크탑: 상하 배치 */}
        <div className="hidden sm:block space-y-2">
          <div className="flex items-center gap-2">
            <Image
              src={flag}
              width={40}
              height={30}
              alt={currencyCode}
              className="rounded-sm shadow-sm shrink-0"
            />
            <Select value={currencyCode} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="flex-1 bg-white/60 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {CountryInfo[currency].names[lang]} ({currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="bg-slate-50/80 rounded-lg px-2.5 py-1.5 text-right font-bold tabular-nums tracking-tight">
            {prices[cardId].toLocaleString()}
          </p>
        </div>
      </Card>
    </div>
  );
}
