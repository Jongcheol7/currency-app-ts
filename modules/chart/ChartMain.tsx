"use client";
import { CountryInfo } from "@/lib/countryInfo";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Loader2, TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type RatePoint = { date: string; rate: number };
type ChartPoint = { date: string; rate: number };

const PERIODS = [
  { days: 30, key: "period30" },
  { days: 90, key: "period90" },
  { days: 180, key: "period180" },
  { days: 365, key: "period365" },
] as const;

const CURRENCY_COLORS: Record<string, string> = {
  USD: "#3b82f6",
  JPY: "#ef4444",
  EUR: "#10b981",
  CNY: "#f59e0b",
  VND: "#8b5cf6",
  GBP: "#06b6d4",
  TWD: "#ec4899",
  THB: "#14b8a6",
  PHP: "#f97316",
  SGD: "#6366f1",
};

const CURRENCIES = Object.keys(CountryInfo).filter((c) => c !== "KRW");

function CurrencyButton({
  code,
  isActive,
  onClick,
}: {
  code: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const info = CountryInfo[code];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
        isActive
          ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-zinc-900 shadow-sm"
          : "bg-white/80 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-zinc-700"
      }`}
    >
      <Image
        src={info.flag}
        width={18}
        height={13}
        alt={code}
        className="rounded-sm"
      />
      <span>{code}</span>
    </button>
  );
}

export default function ChartMain() {
  const { language } = useLangueStore();
  const lang = language as LangCode;

  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [selectedPeriod, setSelectedPeriod] = useState(90);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  // 화면 너비에 따라 보여줄 버튼 수 계산
  useEffect(() => {
    const calcCount = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const buttonWidth = 80; // 버튼 평균 너비 (px)
      const moreButtonWidth = 40; // 더보기 버튼 너비
      const gap = 8; // gap-2
      const available = containerWidth - moreButtonWidth - gap;
      const count = Math.max(2, Math.floor(available / (buttonWidth + gap)));
      setVisibleCount(Math.min(count, CURRENCIES.length));
    };
    calcCount();
    window.addEventListener("resize", calcCount);
    return () => window.removeEventListener("resize", calcCount);
  }, []);

  const visibleCurrencies = CURRENCIES.slice(0, visibleCount);
  const moreCurrencies = CURRENCIES.slice(visibleCount);
  // 선택된 화폐가 more에 있으면 visible에 포함시키기
  const isSelectedInMore = moreCurrencies.includes(baseCurrency);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    };
    if (showMore) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMore]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/exchange-rates?target=${baseCurrency}&days=${selectedPeriod}`
      );
      if (res.ok) {
        const json: RatePoint[] = await res.json();
        // DB: 1 KRW = X USD → 역수: 1 USD = ? KRW
        setChartData(
          json.map((d) => ({
            date: new Date(d.date).toLocaleDateString(lang, {
              month: "short",
              day: "numeric",
            }),
            rate: d.rate > 0 ? Math.round((1 / d.rate) * 100) / 100 : 0,
          }))
        );
      }
    } catch {
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, selectedPeriod, lang]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const color = CURRENCY_COLORS[baseCurrency] || "#3b82f6";

  const chartConfig: ChartConfig = {
    rate: {
      label: `1 ${baseCurrency} → KRW`,
      color,
    },
  };

  // Stats
  const rates = chartData.map((d) => d.rate);
  const high = rates.length ? Math.max(...rates) : 0;
  const low = rates.length ? Math.min(...rates) : 0;
  const avg = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
  const latest = rates.length ? rates[rates.length - 1] : 0;
  const first = rates.length ? rates[0] : 0;
  const change = first ? ((latest - first) / first) * 100 : 0;

  const countryData = CountryInfo[baseCurrency];
  const krwUnit = CountryInfo["KRW"]?.unit[lang] ?? "원";

  // 소수점 결정: JPY, VND 등 큰 숫자는 소수점 없이
  const decimals = latest >= 100 ? 0 : latest >= 1 ? 2 : 4;
  const formatRate = (v: number) => v.toFixed(decimals);

  return (
    <div className="pb-8">
      {/* Base currency selector */}
      <div ref={containerRef} className="flex items-center gap-2 mt-2 mb-4">
        {/* 선택된 화폐가 more에 있으면 별도 표시 */}
        {isSelectedInMore && (
          <CurrencyButton
            code={baseCurrency}
            isActive
            onClick={() => {}}
          />
        )}
        {visibleCurrencies.map((code) => (
          <CurrencyButton
            key={code}
            code={code}
            isActive={code === baseCurrency}
            onClick={() => setBaseCurrency(code)}
          />
        ))}
        {/* More dropdown */}
        {moreCurrencies.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowMore((v) => !v)}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                isSelectedInMore
                  ? "bg-slate-300 dark:bg-zinc-600 text-slate-700 dark:text-slate-200"
                  : "bg-white/80 dark:bg-zinc-800/80 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-zinc-700"
              }`}
            >
              <ChevronDown className={`size-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
            </button>
            {showMore && (
              <div className="absolute top-full mt-1 right-0 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-700 py-1 z-20 min-w-[140px] max-h-[200px] overflow-y-auto no-scrollbar">
                {moreCurrencies.map((code) => {
                  const info = CountryInfo[code];
                  const isActive = code === baseCurrency;
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        setBaseCurrency(code);
                        setShowMore(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-slate-100 dark:bg-zinc-700 text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <Image
                        src={info.flag}
                        width={18}
                        height={13}
                        alt={code}
                        className="rounded-sm"
                      />
                      <span>{info.names[lang]}</span>
                      <span className="text-slate-400 ml-auto">{code}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current rate display */}
      <div className="bg-white/80 dark:bg-zinc-800/80 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3">
          {countryData && (
            <Image
              src={countryData.flag}
              width={32}
              height={24}
              alt={baseCurrency}
              className="rounded-sm shadow-sm"
            />
          )}
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {countryData?.names[lang]} ({baseCurrency})
            </p>
            <p className="text-xs text-slate-400">
              1 {baseCurrency} = {latest ? formatRate(latest) : "—"} {krwUnit}
            </p>
          </div>
          {chartData.length > 1 && (
            <div className="ml-auto flex items-center gap-1">
              {change > 0 ? (
                <TrendingUp className="size-4 text-red-500" />
              ) : change < 0 ? (
                <TrendingDown className="size-4 text-blue-500" />
              ) : (
                <Minus className="size-4 text-slate-400" />
              )}
              <span
                className={`text-sm font-bold ${
                  change > 0
                    ? "text-red-500"
                    : change < 0
                    ? "text-blue-500"
                    : "text-slate-400"
                }`}
              >
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Period selector */}
      <div className="flex gap-1.5 mb-4">
        {PERIODS.map(({ days, key }) => (
          <button
            key={days}
            onClick={() => setSelectedPeriod(days)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedPeriod === days
                ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-zinc-900"
                : "bg-white/80 dark:bg-zinc-800/80 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-zinc-700"
            }`}
          >
            {t(key, lang)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white/80 dark:bg-zinc-800/80 rounded-2xl p-4 mb-4 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            {t("noChartData", lang)}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-slate-200/50 dark:stroke-zinc-700/50"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={55}
                domain={["auto", "auto"]}
                tickFormatter={(v: number) => formatRate(v)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => label}
                    formatter={(value) => [
                      `${formatRate(value as number)} ${krwUnit}`,
                      `1 ${baseCurrency}`,
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke={color}
                strokeWidth={2}
                fill="url(#rateGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: "white" }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>

      {/* Stats */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t("high", lang), value: high, cls: "text-red-500" },
            { label: t("low", lang), value: low, cls: "text-blue-500" },
            { label: t("avg", lang), value: avg, cls: "text-slate-600 dark:text-slate-300" },
          ].map(({ label, value, cls }) => (
            <div
              key={label}
              className="bg-white/80 dark:bg-zinc-800/80 rounded-xl p-3 text-center shadow-sm"
            >
              <p className="text-[10px] font-medium text-slate-400 mb-1">{label}</p>
              <p className={`text-xs font-bold tabular-nums ${cls}`}>
                {formatRate(value)} {krwUnit}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
