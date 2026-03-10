"use client";
import { Button } from "@/components/ui/button";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Bed,
  Camera,
  Package,
  X,
} from "lucide-react";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onSave: (expense: { date: string; amount: number; category: string; memo: string }) => void;
  defaultDate: string;
  currencyCode: string;
};

const CATEGORIES = [
  { key: "food", icon: UtensilsCrossed },
  { key: "transport", icon: Car },
  { key: "shopping", icon: ShoppingBag },
  { key: "accommodation", icon: Bed },
  { key: "sightseeing", icon: Camera },
  { key: "other", icon: Package },
] as const;

export default function AddExpenseModal({
  onClose,
  onSave,
  defaultDate,
  currencyCode,
}: Props) {
  const { language } = useLangueStore();
  const lang = language as LangCode;

  const [date, setDate] = useState(defaultDate);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [memo, setMemo] = useState("");

  const handleSave = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;
    onSave({ date, amount: parsed, category, memo: memo.trim() });
  };

  return (
    <div>
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white z-50 w-80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-800">
            {t("addExpense", lang)}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="size-4 text-slate-400" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Category */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">
              카테고리
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs transition-all ${
                    category === key
                      ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="size-4" />
                  {t(key, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              {t("amount", lang)} ({currencyCode})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              inputMode="decimal"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              날짜
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Memo */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              {t("memo", lang)}
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="e.g. 라멘"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onClose}
            >
              {t("cancel", lang)}
            </Button>
            <Button
              className="flex-1 rounded-xl"
              onClick={handleSave}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {t("save", lang)}
            </Button>
          </div>
        </div>
      </div>

      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
        onClick={onClose}
      />
    </div>
  );
}
