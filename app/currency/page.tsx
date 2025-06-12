"use client";
//import { useExchangeRates } from "./hooks/useExchangeRates";
import { useEffect, useState } from "react";
//import { dummyData } from "@/lib/sampleData";
import CurrencyCard from "./components/CurrencyCard";
import { useBaseCurrencyStore } from "./hooks/useBaseCurrencyStore";
import { useExchangeRates } from "./hooks/useExchangeRates";

export default function CurrencyPage() {
  const { baseCurrency, setBaseCurrency } = useBaseCurrencyStore();
  useEffect(() => {
    setBaseCurrency("KRW");
  }, [setBaseCurrency]);

  const [currency1, setCurrency1] = useState("KRW");
  const [currency2, setCurrency2] = useState("USD");
  const [currency3, setCurrency3] = useState("JPY");
  const [currency4, setCurrency4] = useState("VND");
  const [baseAmount, setBaseAmount] = useState(1);

  const { data, isLoading, error, dataUpdatedAt } = useExchangeRates();
  if (isLoading) return <div>불러오는 중...</div>;
  if (error) return <div>에러가 발생했습니다...</div>;
  //const data: Record<string, number> = dummyData;

  const ratio = baseAmount / data[baseCurrency];

  const changeData: Record<string, string> = {};
  for (const [currency, rate] of Object.entries(data) as [string, number][]) {
    changeData[currency] = (rate * ratio).toFixed(3);
  }
  // console.log("data : ", data);
  console.log("changeDate : ", changeData);

  return (
    <main className="p-6 space-y-4">
      <div className="flex gap-7">
        <p>※ 기준 화폐 : {baseCurrency}</p>
        <p>※ 기준 금액 : {baseAmount.toLocaleString()}</p>
      </div>
      <p>
        마지막 갱신 시간:{" "}
        {new Date(dataUpdatedAt).toLocaleString("ko", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // 24시간제
        })}{" "}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        <CurrencyCard
          currencies={Object.keys(data)}
          setCurrency={setCurrency1}
          currency={currency1}
          baseAmount={baseAmount}
          setBaseAmount={setBaseAmount}
          changeData={changeData}
        />
        <CurrencyCard
          currencies={Object.keys(data)}
          setCurrency={setCurrency2}
          currency={currency2}
          baseAmount={baseAmount}
          setBaseAmount={setBaseAmount}
          changeData={changeData}
        />
        <CurrencyCard
          currencies={Object.keys(data)}
          setCurrency={setCurrency3}
          currency={currency3}
          baseAmount={baseAmount}
          setBaseAmount={setBaseAmount}
          changeData={changeData}
        />
        <CurrencyCard
          currencies={Object.keys(data)}
          setCurrency={setCurrency4}
          currency={currency4}
          baseAmount={baseAmount}
          setBaseAmount={setBaseAmount}
          changeData={changeData}
        />
      </div>
    </main>
  );
}
