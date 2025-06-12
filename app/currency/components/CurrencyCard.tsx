import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBaseCurrencyStore } from "../hooks/useBaseCurrencyStore";
import Image from "next/image";
import { getCountryInfo, getFlagSrc } from "@/lib/contryInfo";

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
  const { flag, names } = getCountryInfo(currency);
  const filteredName = names["ko"];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image src={flag} width={30} height={30} alt={currency} />
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
      <CardContent>
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
