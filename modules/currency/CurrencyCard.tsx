"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CountryInfo } from "@/lib/contryInfo";
import { useLangueStore } from "@/lib/store/useLangueStore";
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

type LangCode = "ko" | "en" | "ja" | "zh" | "es";

export default function CurrencyCard({
  cardId,
  currencies,
  selectedCountry,
  setSelectedCountry,
  focusCard,
  setFocusCard,
  prices,
}: Props) {
  const { flag } = CountryInfo[selectedCountry[cardId]];
  const { language: settingLanguage } = useLangueStore();
  const lang = settingLanguage as LangCode;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setFocusCard(cardId);
      }}
    >
      <Card
        className={`transition-all cursor-pointer border-2  ${
          focusCard === cardId
            ? "border-amber-200 bg-amber-100"
            : "border-transparent"
        }`}
      >
        <CardHeader className="flex items-center gap-2">
          <Image
            src={flag}
            width={40}
            height={30}
            alt={"test"}
            className="border-2"
          />
          <div className="flex-1  min-w-0">
            <select
              className="pb-1 mr-4 border rounded w-full"
              value={selectedCountry[cardId]}
              onChange={(e) => {
                const newSelected = [...selectedCountry];
                newSelected[cardId] = e.currentTarget.value;
                setSelectedCountry(newSelected);
              }}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {CountryInfo[currency].names[lang]} ({currency})
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <p className="border p-1 rounded text-right font-bold">
            {prices[cardId].toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
