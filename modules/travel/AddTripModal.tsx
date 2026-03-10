"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryInfo } from "@/lib/countryInfo";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onSave: (trip: { name: string; currency: string; startDate: string; endDate: string }) => Promise<void> | void;
};

export default function AddTripModal({ onClose, onSave }: Props) {
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const currencies = Object.keys(CountryInfo);

  const today = new Date().toISOString().split("T")[0];
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("JPY");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), currency, startDate, endDate });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white z-50 w-80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-800">
            {t("addTrip", lang)}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="size-4 text-slate-400" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Trip name */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              {t("tripName", lang)}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 도쿄 여행"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              통화
            </label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full bg-white border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((code) => (
                  <SelectItem key={code} value={code}>
                    {CountryInfo[code].names[lang]} ({code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                {t("startDate", lang)}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                {t("endDate", lang)}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>
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
              disabled={!name.trim() || saving}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : t("save", lang)}
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
