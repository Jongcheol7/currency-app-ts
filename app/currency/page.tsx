"use client";
//import { useExchangeRates } from "./hooks/useExchangeRates";
import { useEffect, useState } from "react";
//import { dummyData } from "@/lib/sampleData";
import CurrencyCard from "./components/CurrencyCard";
import { useExchangeRates } from "./hooks/useExchangeRates";
import { CountryInfo } from "@/lib/contryInfo";
import NumberPad from "./components/NumberPad";
import useIsMobile from "./hooks/useIsMobile";
import { useBaseCurrencyStore } from "./hooks/useBaseCurrencyStore";
import PostRatesButton from "./components/PostRateButton";
//import { dummyData } from "@/lib/sampleData";

export default function CurrencyPage() {
  const { baseCurrency, setBaseCurrency } = useBaseCurrencyStore();
  useEffect(() => {
    setBaseCurrency("KRW");
  }, [setBaseCurrency]);

  const isMobile = useIsMobile();

  const [currency1, setCurrency1] = useState("KRW");
  const [currency2, setCurrency2] = useState("USD");
  const [currency3, setCurrency3] = useState("VND");
  const [currency4, setCurrency4] = useState("JPY");
  const [baseAmount, setBaseAmount] = useState(1);
  const [calculatedAmt, setCalculatedAmt] = useState(0);
  const [focusedCard, setFocusedCard] = useState(1);

  //console.log("focusedCard : ", focusedCard);

  const { data, isLoading, error } = useExchangeRates();
  if (isLoading) return <div>불러오는 중...</div>;
  if (error) return <div>에러가 발생했습니다...</div>;
  //const data: Record<string, number> = dummyData;

  //console.log("data1 : ", data);
  const rateData = data.rateData;
  const updatedDate = data.updatedDate;

  const ratio = baseAmount / rateData[baseCurrency].rate;

  const changeData: Record<
    string,
    {
      rate: number;
      names: { ko: string; en: string; ja: string; zh: string; es: string };
      unit: { ko: string; en: string; ja: string; zh: string; es: string };
    }
  > = {};
  for (const [currency, rateAndNamesAndUnit] of Object.entries(rateData) as [
    string,
    {
      rate: number;
      names: { ko: string; en: string; ja: string; zh: string; es: string };
      unit: { ko: string; en: string; ja: string; zh: string; es: string };
    }
  ][]) {
    //console.log("currency: ", currency);
    //console.log("rateAndNamesAndUnit: ", rateAndNamesAndUnit);
    changeData[currency] = {
      rate: Number((rateAndNamesAndUnit.rate * ratio).toFixed(3)),
      names: rateAndNamesAndUnit.names,
      unit: rateAndNamesAndUnit.unit,
    };
  }
  //console.log("data2 : ", rateData);
  //console.log("changeDate : ", changeData);

  const currencies = Object.keys(CountryInfo);

  return (
    <main className="p-6 space-y-3">
      <div className="flex justify-between">
        {/* <p className="font-bold">※ 기준 화폐 : {baseCurrency}</p> */}
        {/* <p className="font-bold">※ 기준 금액 : {baseAmount.toLocaleString()}</p> */}
        <p className="font-bold">
          ※ 마지막 갱신 시간 :{" "}
          {new Date(updatedDate).toLocaleString("ko", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24시간제
          })}{" "}
        </p>
        {process.env.NODE_ENV === "development" && <PostRatesButton />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <CurrencyCard
          cardNum={1}
          currencies={currencies}
          setCurrency={setCurrency1}
          currency={currency1}
          baseAmount={baseAmount}
          setBaseAmount={setBaseAmount}
          changeData={changeData}
          focusedCard={focusedCard}
          setFocusedCard={setFocusedCard}
          calculatedAmt={calculatedAmt}
          setCalculatedAmt={setCalculatedAmt}
          isMobile={isMobile}
        />
        <CurrencyCard
          cardNum={2}
          currencies={currencies}
          setCurrency={setCurrency2}
          currency={currency2}
          baseAmount={baseAmount}
          setBaseAmount={setBaseAmount}
          changeData={changeData}
          focusedCard={focusedCard}
          setFocusedCard={setFocusedCard}
          calculatedAmt={calculatedAmt}
          setCalculatedAmt={setCalculatedAmt}
          isMobile={isMobile}
        />
        <CurrencyCard
          cardNum={3}
          currencies={currencies}
          setCurrency={setCurrency3}
          currency={currency3}
          baseAmount={baseAmount}
          setBaseAmount={setBaseAmount}
          changeData={changeData}
          focusedCard={focusedCard}
          setFocusedCard={setFocusedCard}
          calculatedAmt={calculatedAmt}
          setCalculatedAmt={setCalculatedAmt}
          isMobile={isMobile}
        />
        {!isMobile && (
          <CurrencyCard
            cardNum={4}
            currencies={currencies}
            setCurrency={setCurrency4}
            currency={currency4}
            baseAmount={baseAmount}
            setBaseAmount={setBaseAmount}
            changeData={changeData}
            focusedCard={focusedCard}
            setFocusedCard={setFocusedCard}
            calculatedAmt={calculatedAmt}
            setCalculatedAmt={setCalculatedAmt}
            isMobile={isMobile}
          />
        )}
      </div>
      <NumberPad
        setCalculatedAmt={(val) => {
          // focusedCard가 기준
          const selectedCurrency =
            focusedCard === 1
              ? currency1
              : focusedCard === 2
              ? currency2
              : focusedCard === 3
              ? currency3
              : currency4;

          setBaseCurrency(selectedCurrency);
          setBaseAmount(val);
          setCalculatedAmt(0); // 값 반영 후 초기화
        }}
      />
    </main>
  );
}
