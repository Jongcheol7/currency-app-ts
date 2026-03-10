"use client";
import { CountryInfo } from "@/lib/countryInfo";
import { useTravelData } from "@/hooks/useTravelData";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import { Plane, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AddTripModal from "./AddTripModal";
import TripDetail from "./TripDetail";
import type { Trip } from "@/lib/store/useTravelStore";

export default function TravelMain() {
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const { trips, expenses, loading, addTrip, deleteTrip, addExpense, updateExpense, deleteExpense, refresh } = useTravelData();
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleAddTrip = async (data: {
    name: string;
    currency: string;
    startDate: string;
    endDate: string;
  }) => {
    await addTrip(data);
    setShowAddTrip(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        불러오는 중...
      </div>
    );
  }

  if (selectedTrip) {
    return (
      <TripDetail
        trip={selectedTrip}
        expenses={expenses}
        onBack={() => {
          setSelectedTrip(null);
          refresh();
        }}
        addExpense={addExpense}
        updateExpense={updateExpense}
        deleteExpense={deleteExpense}
      />
    );
  }

  return (
    <div>
      {showAddTrip && (
        <AddTripModal
          onClose={() => setShowAddTrip(false)}
          onSave={handleAddTrip}
        />
      )}

      {/* Trip list header */}
      <div className="flex items-center justify-between mt-2 mb-4">
        <p className="text-sm text-slate-400 font-medium">
          {trips.length}개 여행
        </p>
        <button
          onClick={() => setShowAddTrip(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 active:bg-slate-900 px-3 py-1.5 rounded-full transition-colors shadow-sm"
        >
          <Plus className="size-3.5" />
          {t("addTrip", lang)}
        </button>
      </div>

      {/* Trip list */}
      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <Plane className="size-12 mb-3" />
          <p className="text-sm">{t("noTrips", lang)}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {trips.map((trip) => {
            const tripTotal = expenses
              .filter((e) => e.tripId === trip.id)
              .reduce((sum, e) => sum + e.amount, 0);
            const countryData = CountryInfo[trip.currency];
            const flag = countryData?.flag;
            const unitName = countryData?.unit[lang] ?? trip.currency;

            return (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className="bg-white/80 hover:bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {flag && (
                    <Image
                      src={flag}
                      width={36}
                      height={27}
                      alt={trip.currency}
                      className="rounded-sm shadow-sm shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {trip.startDate} ~ {trip.endDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-700 tabular-nums">
                      {tripTotal.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">{unitName}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTrip(trip.id);
                    }}
                    className="p-2 rounded-full hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 className="size-4 text-slate-300 hover:text-red-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
