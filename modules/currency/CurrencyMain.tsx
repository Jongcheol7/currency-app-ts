"use client";
import { CountryInfo } from "@/lib/countryInfo";
import CurrencyHeader from "./CurrencyHeader";
import CurrencyCard from "./CurrencyCard";
import NumberPad from "./NumberPad";
import { useEffect, useRef, useState } from "react";
import { useExchangeRates } from "@/hooks/useExchangeRates";

type CardCount = 2 | 4 | 6;
const DEFAULT_CURRENCIES = ["KRW", "USD", "VND", "JPY", "EUR", "CNY"];

export default function CurrencyMain() {
  const currencies = Object.keys(CountryInfo);
  const [cardCount, setCardCount] = useState<CardCount>(4);
  const [selectedCountry, setSelectedCountry] = useState(
    DEFAULT_CURRENCIES.slice(0, 4)
  );
  const [prices, setPrices] = useState(Array(4).fill(0));
  const [numPad, setNumpad] = useState("0");
  const [focusCard, setFocusCard] = useState(0);
  const { data, isLoading, error } = useExchangeRates();

  const skipRecalcRef = useRef(false);

  const handleCardCountChange = (count: CardCount) => {
    if (count === cardCount) return;

    const prevCount = selectedCountry.length;
    let newCountries: string[];

    if (count > prevCount) {
      // 늘어난 만큼 기본 통화에서 아직 선택 안 된 것으로 채움
      const remaining = DEFAULT_CURRENCIES.filter(
        (c) => !selectedCountry.includes(c)
      );
      const extra = remaining.slice(0, count - prevCount);
      newCountries = [...selectedCountry, ...extra];
    } else {
      newCountries = selectedCountry.slice(0, count);
    }

    // 포커스가 범위 밖이면 0으로 리셋
    const newFocus = focusCard >= count ? 0 : focusCard;

    setCardCount(count);
    setSelectedCountry(newCountries);
    setPrices(Array(count).fill(0));
    setNumpad("0");
    setFocusCard(newFocus);
  };

  const handleFocusChange = (cardId: number) => {
    if (cardId === focusCard) return;
    skipRecalcRef.current = true;
    setNumpad(String(prices[cardId]));
    setFocusCard(cardId);
  };

  useEffect(() => {
    if (skipRecalcRef.current) {
      skipRecalcRef.current = false;
      return;
    }

    if (!data || !data.rateData) return;

    const parsed = parseFloat(numPad);
    if (isNaN(parsed)) return;

    const fromCurrency = selectedCountry[focusCard];
    const fromRate = data.rateData[fromCurrency]?.rate;
    if (!fromRate) return;

    const base = parsed / fromRate;

    const newPrices = selectedCountry.map((code) => {
      const toRate = data.rateData[code]?.rate;
      if (!toRate) return 0;

      return Math.round(base * toRate * 100) / 100;
    });

    setPrices(newPrices);
  }, [numPad, selectedCountry, data, focusCard]);

  if (isLoading) return <div>불러오는 중...</div>;
  if (error) return <div>에러가 발생했습니다...</div>;

  return (
    <div className="flex flex-col justify-between">
      <CurrencyHeader
        updatedDate={data.updatedDate}
        cardCount={cardCount}
        onCardCountChange={handleCardCountChange}
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {selectedCountry.map((_, index) => (
          <CurrencyCard
            key={index}
            cardId={index}
            currencies={currencies}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            focusCard={focusCard}
            setFocusCard={handleFocusChange}
            prices={prices}
          />
        ))}
      </div>
      <NumberPad setNumpad={setNumpad} />
    </div>
  );
}
