"use client";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import { useTravelData } from "@/hooks/useTravelData";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Plane, Loader2 } from "lucide-react";
import Link from "next/link";
import AddTripModal from "../travel/AddTripModal";
import type { Expense } from "@/lib/store/useTravelStore";
import { CountryInfo } from "@/lib/countryInfo";

const TRIP_COLORS = [
  "bg-blue-200/60 dark:bg-blue-800/40",
  "bg-emerald-200/60 dark:bg-emerald-800/40",
  "bg-orange-200/60 dark:bg-orange-800/40",
  "bg-violet-200/60 dark:bg-violet-800/40",
  "bg-pink-200/60 dark:bg-pink-800/40",
  "bg-cyan-200/60 dark:bg-cyan-800/40",
];

const TRIP_DOT_COLORS = [
  "bg-blue-400",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-violet-400",
  "bg-pink-400",
  "bg-cyan-400",
];

function formatDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function isSameDay(dateStr: string, y: number, m: number, d: number) {
  return dateStr === formatDateKey(y, m, d);
}

function isInRange(dateStr: string, start: string, end: string) {
  return dateStr >= start && dateStr <= end;
}

export default function CalendarMain() {
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const { trips, expenses, loading, addTrip } = useTravelData();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [addTripDefaultDate, setAddTripDefaultDate] = useState<string>("");

  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

  // 해당 월의 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; dateKey: string }[] = [];

    // 이전 달
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const pm = viewMonth === 0 ? 11 : viewMonth - 1;
      const py = viewMonth === 0 ? viewYear - 1 : viewYear;
      days.push({ day: d, isCurrentMonth: false, dateKey: formatDateKey(py, pm, d) });
    }

    // 현재 달
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, isCurrentMonth: true, dateKey: formatDateKey(viewYear, viewMonth, d) });
    }

    // 다음 달 (6줄 채우기)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nm = viewMonth === 11 ? 0 : viewMonth + 1;
      const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
      days.push({ day: d, isCurrentMonth: false, dateKey: formatDateKey(ny, nm, d) });
    }

    return days;
  }, [viewYear, viewMonth]);

  // 날짜별 지출 합계
  const expenseByDate = useMemo(() => {
    const map: Record<string, { total: number; items: Expense[] }> = {};
    for (const e of expenses) {
      if (!map[e.date]) map[e.date] = { total: 0, items: [] };
      map[e.date].total += e.amount;
      map[e.date].items.push(e);
    }
    return map;
  }, [expenses]);

  // 이번 달 총 지출 (여행별로 분류)
  const monthlyTrips = useMemo(() => {
    const monthStart = formatDateKey(viewYear, viewMonth, 1);
    const monthEnd = formatDateKey(viewYear, viewMonth, new Date(viewYear, viewMonth + 1, 0).getDate());
    return trips.filter((trip) => trip.startDate <= monthEnd && trip.endDate >= monthStart);
  }, [trips, viewYear, viewMonth]);

  // 날짜에 해당하는 여행 찾기
  const getTripsForDate = (dateKey: string) => {
    return trips.filter((trip) => isInRange(dateKey, trip.startDate, trip.endDate));
  };

  // 여행별 색상 인덱스
  const tripColorMap = useMemo(() => {
    const map: Record<string, number> = {};
    trips.forEach((trip, i) => {
      map[trip.id] = i % TRIP_COLORS.length;
    });
    return map;
  }, [trips]);

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // 선택된 날짜의 여행 및 지출
  const selectedTrips = selectedDate ? getTripsForDate(selectedDate) : [];
  const selectedExpenses = selectedDate ? (expenseByDate[selectedDate]?.items ?? []) : [];

  // 월 이름
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString(lang, { year: "numeric", month: "long" });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* 여행 추가 모달 */}
      {showAddTrip && (
        <AddTripModal
          onClose={() => setShowAddTrip(false)}
          onSave={async (data) => {
            await addTrip(data);
            setShowAddTrip(false);
          }}
        />
      )}

      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mt-2 mb-3">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-white/70 dark:hover:bg-zinc-800 transition-colors">
          <ChevronLeft className="size-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{monthName}</h2>
          <button
            onClick={goToToday}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 dark:bg-slate-200 text-white dark:text-zinc-900"
          >
            {t("today", lang)}
          </button>
        </div>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-white/70 dark:hover:bg-zinc-800 transition-colors">
          <ChevronRight className="size-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {dayKeys.map((key, i) => (
          <div
            key={key}
            className={`text-center text-[10px] font-semibold py-1 ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-slate-400"
            }`}
          >
            {t(key, lang)}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 bg-white/80 dark:bg-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
        {calendarDays.map(({ day, isCurrentMonth, dateKey }, idx) => {
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const dayTrips = getTripsForDate(dateKey);
          const dayExpense = expenseByDate[dateKey];
          const dayOfWeek = idx % 7;

          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              className={`relative flex flex-col items-center py-1.5 min-h-[52px] border-b border-r border-slate-100/50 dark:border-zinc-700/30 transition-colors ${
                isSelected
                  ? "bg-slate-100 dark:bg-zinc-700"
                  : "hover:bg-slate-50 dark:hover:bg-zinc-700/50"
              }`}
            >
              {/* 여행 배경 */}
              {dayTrips.length > 0 && (
                <div className={`absolute inset-0 ${TRIP_COLORS[tripColorMap[dayTrips[0].id] ?? 0]}`} />
              )}

              {/* 날짜 숫자 */}
              <span
                className={`relative z-10 text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday
                    ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-zinc-900 font-bold"
                    : !isCurrentMonth
                    ? "text-slate-300 dark:text-zinc-600"
                    : dayOfWeek === 0
                    ? "text-red-500"
                    : dayOfWeek === 6
                    ? "text-blue-500"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {day}
              </span>

              {/* 여행 도트 */}
              {dayTrips.length > 0 && (
                <div className="relative z-10 flex gap-0.5 mt-0.5">
                  {dayTrips.slice(0, 3).map((trip) => (
                    <div
                      key={trip.id}
                      className={`size-1.5 rounded-full ${TRIP_DOT_COLORS[tripColorMap[trip.id] ?? 0]}`}
                    />
                  ))}
                </div>
              )}

              {/* 지출 금액 */}
              {dayExpense && isCurrentMonth && (
                <span className="relative z-10 text-[8px] font-medium text-orange-500 dark:text-orange-400 mt-0.5 truncate max-w-full px-0.5">
                  {dayExpense.total >= 10000
                    ? `${(dayExpense.total / 10000).toFixed(0)}만`
                    : dayExpense.total >= 1000
                    ? `${(dayExpense.total / 1000).toFixed(1)}k`
                    : dayExpense.total.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 이번 달 여행 목록 */}
      {monthlyTrips.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1">
            {t("tripSchedule", lang)}
          </h3>
          <div className="space-y-2">
            {monthlyTrips.map((trip) => {
              const colorIdx = tripColorMap[trip.id] ?? 0;
              const tripExpenses = expenses.filter((e) => e.tripId === trip.id);
              const total = tripExpenses.reduce((s, e) => s + e.amount, 0);
              const countryData = CountryInfo[trip.currency];
              const unit = countryData?.unit[lang] ?? trip.currency;

              return (
                <Link
                  key={trip.id}
                  href="/travel"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${TRIP_COLORS[colorIdx]} transition-colors`}
                >
                  <div className={`size-2.5 rounded-full ${TRIP_DOT_COLORS[colorIdx]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {trip.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {trip.startDate} ~ {trip.endDate}
                    </p>
                  </div>
                  {total > 0 && (
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {total.toLocaleString()} {unit}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 선택된 날짜 상세 */}
      {selectedDate && (
        <div className="mt-4 bg-white/80 dark:bg-zinc-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString(lang, {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </h3>
            <button
              onClick={() => {
                setAddTripDefaultDate(selectedDate);
                setShowAddTrip(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-600 transition-colors"
            >
              <Plus className="size-3.5" />
              {t("addTrip", lang)}
            </button>
          </div>

          {/* 해당 날짜의 여행 */}
          {selectedTrips.length > 0 && (
            <div className="space-y-2 mb-3">
              {selectedTrips.map((trip) => {
                const colorIdx = tripColorMap[trip.id] ?? 0;
                return (
                  <Link
                    key={trip.id}
                    href="/travel"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-700/50 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-700"
                  >
                    <Plane className={`size-4 ${TRIP_DOT_COLORS[colorIdx].replace("bg-", "text-")}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{trip.name}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {trip.startDate} ~ {trip.endDate}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* 해당 날짜의 지출 */}
          {selectedExpenses.length > 0 ? (
            <div className="space-y-1.5">
              {selectedExpenses.map((expense) => {
                const trip = trips.find((t) => t.id === expense.tripId);
                const unit = trip ? (CountryInfo[trip.currency]?.unit[lang] ?? trip.currency) : "";
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{getCategoryEmoji(expense.category)}</span>
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        {expense.memo || t(expense.category, lang)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {expense.amount.toLocaleString()} {unit}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : selectedTrips.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-4">{t("noSchedule", lang)}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function getCategoryEmoji(category: string) {
  const map: Record<string, string> = {
    food: "\uD83C\uDF5C",
    transport: "\uD83D\uDE8C",
    shopping: "\uD83D\uDECD\uFE0F",
    accommodation: "\uD83C\uDFE8",
    sightseeing: "\uD83C\uDFDB\uFE0F",
    other: "\uD83D\uDCCC",
  };
  return map[category] ?? "\uD83D\uDCCC";
}
