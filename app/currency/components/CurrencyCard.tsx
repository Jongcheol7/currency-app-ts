import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CountryInfo } from "@/lib/contryInfo";
import { useBaseCurrencyStore } from "../hooks/useBaseCurrencyStore";

type Props = {
  currencies: string[];
  setCurrency: (value: string) => void;
  currency: string;
  baseAmount: number;
  setBaseAmount: (value: number) => void;
  changeData: Record<string, string>;
};

export default function CurrencyCard({
  currencies,
  setCurrency,
  currency,
  baseAmount,
  setBaseAmount,
  changeData,
}: Props) {
  const { baseCurrency, setBaseCurrency } = useBaseCurrencyStore();

  const { flag, names } = CountryInfo[currency];

  const filteredName = names["ko"];
  return (
    <Card className="">
      <CardHeader className="h-[0px]">
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
                  {currency}
                </option>
              ))}
            </select>
            <p>{filteredName}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[25px]">
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={
            currency === baseCurrency
              ? baseAmount.toLocaleString("ko-KR")
              : Number(changeData[currency]).toLocaleString("ko-KR")
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
        />
      </CardContent>
    </Card>
  );
}
