"use client";
import { Button } from "@/components/ui/button";
import { CountryInfo } from "@/lib/countryInfo";
import type { Expense, Trip } from "@/lib/store/useTravelStore";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import {
  ArrowLeft,
  Plus,
  Trash2,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Bed,
  Camera,
  Package,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import ExpenseDetail from "./ExpenseDetail";

const CATEGORY_STYLES: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; bg: string; iconColor: string; accent: string }
> = {
  food: { icon: UtensilsCrossed, bg: "bg-orange-50", iconColor: "text-orange-500", accent: "border-orange-200" },
  transport: { icon: Car, bg: "bg-blue-50", iconColor: "text-blue-500", accent: "border-blue-200" },
  shopping: { icon: ShoppingBag, bg: "bg-pink-50", iconColor: "text-pink-500", accent: "border-pink-200" },
  accommodation: { icon: Bed, bg: "bg-violet-50", iconColor: "text-violet-500", accent: "border-violet-200" },
  sightseeing: { icon: Camera, bg: "bg-emerald-50", iconColor: "text-emerald-500", accent: "border-emerald-200" },
  other: { icon: Package, bg: "bg-slate-50", iconColor: "text-slate-500", accent: "border-slate-200" },
};

const DEFAULT_STYLE = CATEGORY_STYLES.other;

type Props = {
  trip: Trip;
  expenses: Expense[];
  onBack: () => void;
  addExpense: (data: { tripId: string; date: string; amount: number; category: string; memo: string }) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
};

export default function TripDetail({
  trip,
  expenses,
  onBack,
  addExpense,
  updateExpense,
  deleteExpense,
}: Props) {
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  const tripExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.tripId === trip.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [expenses, trip.id]
  );

  const total = tripExpenses.reduce((sum, e) => sum + e.amount, 0);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    for (const expense of tripExpenses) {
      if (!groups[expense.date]) groups[expense.date] = [];
      groups[expense.date].push(expense);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [tripExpenses]);

  const countryData = CountryInfo[trip.currency];
  const flag = countryData?.flag;
  const unitName = countryData?.unit[lang] ?? trip.currency;

  const handleAddExpense = async (data: {
    date: string;
    amount: number;
    category: string;
    memo: string;
  }) => {
    await addExpense({ tripId: trip.id, ...data });
    setShowAddExpense(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays =
      lang === "ko"
        ? ["일", "월", "화", "수", "목", "금", "토"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${month}/${day} (${weekdays[d.getDay()]})`;
  };

  const currentExpense = selectedExpense
    ? expenses.find((e) => e.id === selectedExpense.id)
    : null;

  if (currentExpense) {
    return (
      <ExpenseDetail
        expense={currentExpense}
        currencyCode={trip.currency}
        onBack={() => setSelectedExpense(null)}
        updateExpense={updateExpense}
        deleteExpense={deleteExpense}
      />
    );
  }

  return (
    <div className="pb-24">
      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          onSave={handleAddExpense}
          defaultDate={trip.startDate}
          currencyCode={trip.currency}
        />
      )}

      {/* Trip info header */}
      <div className="flex items-center gap-3 mt-2 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/70 transition-colors"
        >
          <ArrowLeft className="size-5 text-slate-500" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          {flag && (
            <Image
              src={flag}
              width={28}
              height={21}
              alt={trip.currency}
              className="rounded-sm shadow-sm"
            />
          )}
          <div>
            <h2 className="font-bold text-slate-800 text-sm">{trip.name}</h2>
            <p className="text-xs text-slate-400">
              {trip.startDate} ~ {trip.endDate}
            </p>
          </div>
        </div>
      </div>

      {/* Total summary */}
      <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow-sm">
        <p className="text-xs text-slate-400 mb-1">{t("total", lang)}</p>
        <p className="text-2xl font-bold text-slate-800 tabular-nums">
          {total.toLocaleString()}{" "}
          <span className="text-sm font-medium text-slate-400">{unitName}</span>
        </p>
      </div>

      {/* Expenses by date */}
      {groupedByDate.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          {t("noExpenses", lang)}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([date, dateExpenses]) => {
            const dayTotal = dateExpenses.reduce((s, e) => s + e.amount, 0);
            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-xs font-semibold text-slate-500">
                    {formatDate(date)}
                  </p>
                  <p className="text-xs font-bold text-slate-600 tabular-nums">
                    {dayTotal.toLocaleString()} {trip.currency}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {dateExpenses.map((expense) => {
                    const style = CATEGORY_STYLES[expense.category] || DEFAULT_STYLE;
                    const Icon = style.icon;
                    return (
                      <div
                        key={expense.id}
                        onClick={() => setSelectedExpense(expense)}
                        className={`relative overflow-hidden rounded-2xl border ${style.accent} ${style.bg} p-3 flex flex-col items-center text-center hover:scale-[1.03] transition-transform duration-150 cursor-pointer`}
                      >
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (deletingExpenseId) return;
                            setDeletingExpenseId(expense.id);
                            try {
                              await deleteExpense(expense.id);
                            } finally {
                              setDeletingExpenseId(null);
                            }
                          }}
                          disabled={deletingExpenseId === expense.id}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full hover:bg-white/60 transition-colors"
                        >
                          {deletingExpenseId === expense.id ? (
                            <Loader2 className="size-3 text-slate-300 animate-spin" />
                          ) : (
                            <Trash2 className="size-3 text-slate-300 hover:text-red-400" />
                          )}
                        </button>
                        <div className={`p-2.5 rounded-full bg-white/60 mb-2`}>
                          <Icon className={`size-5 ${style.iconColor}`} />
                        </div>
                        <p className={`text-[11px] font-semibold ${style.iconColor} mb-1`}>
                          {t(expense.category, lang)}
                        </p>
                        <p className="text-[15px] font-extrabold text-slate-800 tabular-nums leading-tight">
                          {expense.amount.toLocaleString()}
                        </p>
                        {expense.memo && (
                          <p className="text-[10px] text-slate-400 truncate w-full mt-1.5 bg-white/50 rounded-full px-2 py-0.5">
                            {expense.memo}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating add button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
        <Button
          onClick={() => setShowAddExpense(true)}
          className="rounded-full px-5 py-3 shadow-lg shadow-blue-200/50 h-auto"
        >
          <Plus className="size-4 mr-1.5" />
          {t("addExpense", lang)}
        </Button>
      </div>
    </div>
  );
}
