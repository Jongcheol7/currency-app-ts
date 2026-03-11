"use client";
import { CountryInfo } from "@/lib/countryInfo";
import CurrencyHeader from "./CurrencyHeader";
import CurrencyCard from "./CurrencyCard";
import NumberPad from "./NumberPad";
import { useCallback, useEffect, useRef, useState } from "react";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import { useUserSettings, registerCurrencySettingsCallback, updateCurrencySettings } from "@/hooks/useUserSettings";

type CardCount = 2 | 3 | 4 | 5 | 6;
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
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const { saveSettings, isLoggedIn } = useUserSettings();

  // Load saved currency settings from server
  useEffect(() => {
    registerCurrencySettingsCallback((s) => {
      const count = s.cardCount as CardCount;
      const currencies = s.selectedCurrencies;
      if (count >= 2 && count <= 6 && currencies.length === count) {
        setCardCount(count);
        setSelectedCountry(currencies);
        setPrices(Array(count).fill(0));
        setNumpad("0");
        setFocusCard(0);
      }
    });
  }, []);

  const skipRecalcRef = useRef(false);
  const freshInputRef = useRef(false);

  // 포커스 변경 후 첫 숫자 입력 시 기존 값을 지우고 새로 시작하는 래퍼
  const MAX_LENGTH = 15;

  const numpadInput = useCallback((updater: (prev: string) => string) => {
    if (freshInputRef.current) {
      freshInputRef.current = false;
      const result = updater("0");
      if (result.replace(".", "").length <= MAX_LENGTH) setNumpad(result);
    } else {
      setNumpad((prev) => {
        const result = updater(prev);
        return result.replace(".", "").length <= MAX_LENGTH ? result : prev;
      });
    }
  }, []);

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

    updateCurrencySettings({ cardCount: count, selectedCurrencies: newCountries });
    saveSettings({ cardCount: count, selectedCurrencies: newCountries });
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        {t("loading", lang)}
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-20 text-red-400 text-sm">
        {t("error", lang)}
      </div>
    );

  return (
    <div className="flex flex-col justify-between">
      <CurrencyHeader
        updatedDate={data.updatedDate}
        cardCount={cardCount}
        onCardCountChange={handleCardCountChange}
      />
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {selectedCountry.map((_, index) => (
          <CurrencyCard
            key={index}
            cardId={index}
            currencies={currencies}
            selectedCountry={selectedCountry}
            setSelectedCountry={(newCountries: string[]) => {
              setSelectedCountry(newCountries);
              updateCurrencySettings({ cardCount, selectedCurrencies: newCountries });
              saveSettings({ cardCount, selectedCurrencies: newCountries });
            }}
            focusCard={focusCard}
            setFocusCard={handleFocusChange}
            prices={prices}
          />
        ))}
      </div>
      <NumberPad
        numpadInput={numpadInput}
        setNumpad={setNumpad}
        freshInputRef={freshInputRef}
      />
    </div>
  );
}
