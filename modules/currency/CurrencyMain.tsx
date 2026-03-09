"use client";
import { CountryInfo } from "@/lib/countryInfo";
import CurrencyHeader from "./CurrencyHeader";
import CurrencyCard from "./CurrencyCard";
import NumberPad from "./NumberPad";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const freshInputRef = useRef(false);

  // 포커스 변경 후 첫 숫자 입력 시 기존 값을 지우고 새로 시작하는 래퍼
  const numpadInput = useCallback(
    (updater: (prev: string) => string) => {
      if (freshInputRef.current) {
        freshInputRef.current = false;
        setNumpad(() => updater("0"));
      } else {
        setNumpad((prev) => updater(prev));
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.isComposing) return;

      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (/^[0-9]$/.test(e.key)) {
        numpadInput((prev) => (prev === "0" ? e.key : prev + e.key));
      } else if (e.key === ".") {
        numpadInput((prev) => (prev.includes(".") ? prev : prev + "."));
      } else if (e.key === "Backspace") {
        numpadInput((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
      } else if (e.key === "Escape" || e.key === "Delete") {
        freshInputRef.current = false;
        setNumpad("0");
      }
    },
    [numpadInput]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleCardCountChange = (count: CardCount) => {
    if (count === cardCount) return;

    const prevCount = selectedCountry.length;
    let newCountries: string[];

    if (count > prevCount) {
      const remaining = DEFAULT_CURRENCIES.filter(
        (c) => !selectedCountry.includes(c)
      );
      const extra = remaining.slice(0, count - prevCount);
      newCountries = [...selectedCountry, ...extra];
    } else {
      newCountries = selectedCountry.slice(0, count);
    }

    const newFocus = focusCard >= count ? 0 : focusCard;

    setCardCount(count);
    setSelectedCountry(newCountries);
    setPrices(Array(count).fill(0));
    setNumpad("0");
    setFocusCard(newFocus);
    freshInputRef.current = false;
  };

  const handleFocusChange = (cardId: number) => {
    if (cardId === focusCard) return;
    skipRecalcRef.current = true;
    freshInputRef.current = true;
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
      <NumberPad numpadInput={numpadInput} setNumpad={setNumpad} freshInputRef={freshInputRef} />
    </div>
  );
}
