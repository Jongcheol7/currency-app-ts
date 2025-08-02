"use client";
import { CountryInfo } from "@/lib/contryInfo";
import CurrencyHeader from "./CurrencyHeader";
import CurrencyCard from "./CurrencyCard";
import NumberPad from "./NumberPad";
import { useEffect, useState } from "react";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import useIsMobile from "@/hooks/useIsMobile";

export default function CurrencyMain() {
  const currencies = Object.keys(CountryInfo);
  const [selectedCountry, setSelectedCountry] = useState([
    "KRW",
    "USD",
    "VND",
    "JPY",
  ]);
  const [prices, setPrices] = useState([0, 0, 0, 0]);
  const [numPad, setNumpad] = useState("0");
  const [focusCard, setFocusCard] = useState(0);
  const { data, isLoading, error } = useExchangeRates();
  const isMobile = useIsMobile();

  useEffect(() => {
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
      <CurrencyHeader updatedDate={data.updatedDate} />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <CurrencyCard
          cardId={0}
          currencies={currencies}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          focusCard={focusCard}
          setFocusCard={setFocusCard}
          prices={prices}
        />
        <CurrencyCard
          cardId={1}
          currencies={currencies}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          focusCard={focusCard}
          setFocusCard={setFocusCard}
          prices={prices}
        />
        <CurrencyCard
          cardId={2}
          currencies={currencies}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          focusCard={focusCard}
          setFocusCard={setFocusCard}
          prices={prices}
        />
        {!isMobile && (
          <CurrencyCard
            cardId={3}
            currencies={currencies}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            focusCard={focusCard}
            setFocusCard={setFocusCard}
            prices={prices}
          />
        )}
      </div>
      <NumberPad setNumpad={setNumpad} />
    </div>
  );
}
