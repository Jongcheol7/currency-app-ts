import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CountryInfo } from "@/lib/contryInfo";
import { useBaseCurrencyStore } from "../hooks/useBaseCurrencyStore";
import { LineChart } from "lucide-react";
import { useLangueStore } from "../hooks/useLangueStore";
//import { fetchExchangeChartData } from "@/lib/api";

type Props = {
  cardNum: number;
  currencies: string[];
  setCurrency: (value: string) => void;
  currency: string;
  baseAmount: number;
  setBaseAmount: (value: number) => void;
  changeData: Record<
    string,
    {
      rate: number;
      names: { ko: string; en: string; ja: string; zh: string; es: string };
      unit: { ko: string; en: string; ja: string; zh: string; es: string };
    }
  >;
  focusedCard: number;
  setFocusedCard: (value: number) => void;
  calculatedAmt: number;
  setCalculatedAmt: (value: number) => void;
  isMobile: boolean;
};

type LangCode = "ko" | "en" | "ja" | "zh" | "es";

export default function CurrencyCard({
  cardNum,
  currencies,
  setCurrency,
  currency,
  baseAmount,
  setBaseAmount,
  changeData,
  focusedCard,
  setFocusedCard,
  calculatedAmt,
  setCalculatedAmt,
  isMobile,
}: Props) {
  const { baseCurrency, setBaseCurrency } = useBaseCurrencyStore();
  const { flag } = CountryInfo[currency];

  const { language: settingLanguage } = useLangueStore();
  const lang = settingLanguage as LangCode;

  return (
    <Card className={baseCurrency === currency ? "bg-blue-200" : ""}>
      <CardHeader className="h-[5px]">
        <CardTitle className="flex items-center gap-2 text-base h-[0px]">
          <Image
            src={flag}
            width={40}
            height={30}
            alt={currency}
            className="border-2"
          />
          <div className="flex items-center">
            <select
              className="pb-1 mr-4"
              value={currency}
              onChange={(e) => {
                const selected = e.target.value;
                setCurrency(selected);
                setBaseCurrency(selected);
              }}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {changeData[currency].names[lang]} ({currency})
                </option>
              ))}
            </select>
          </div>
        </CardTitle>
        <p className="ml-13 font-bold text-xs">
          {changeData[currency].unit[lang]}
        </p>
      </CardHeader>
      <CardContent className="h-[25px] flex items-center gap-1">
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          readOnly={isMobile}
          value={
            currency === baseCurrency
              ? cardNum === focusedCard && calculatedAmt !== 0
                ? calculatedAmt.toLocaleString("ko-KR")
                : baseAmount.toLocaleString("ko-KR")
              : changeData[currency].rate.toLocaleString("ko-KR")
          }
          onChange={(e) => {
            const raw = e.target.value.replace(/,/g, ""); // 쉼표 제거
            const parsed = Number(raw);
            if (!isNaN(parsed)) {
              setCurrency(currency);
              setBaseCurrency(currency);
              setBaseAmount(parsed);
            }
          }}
          onClick={() => {
            setFocusedCard(cardNum);
            setCalculatedAmt(0);
          }}
        />
        <button
          onClick={async () => {
            const res = await fetch(
              "https://api.exchangerate.host/2024-06-05?base=USD&symbols=KRW"
            );
            const json = await res.json();
            console.log(json);
          }}
        >
          <LineChart className="ml-1 text-gray-600" size={22} />
        </button>
      </CardContent>
    </Card>
  );
}
