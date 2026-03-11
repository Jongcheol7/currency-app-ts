"use client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useTravelStore, type Trip, type Expense, type Photo } from "@/lib/store/useTravelStore";

// 로그인 시 DB, 비로그인 시 localStorage 사용
export function useTravelData() {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;
  const store = useTravelStore();

  const [trips, setTrips] = useState<(Trip & { expenses?: Expense[] })[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 fetch
  const fetchTrips = useCallback(async () => {
    if (status === "loading") return;

    if (!isLoggedIn) {
      setTrips(
        store.trips.map((t) => ({
          ...t,
          expenses: store.expenses.filter((e) => e.tripId === t.id),
        }))
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/trips");
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, status, store.trips, store.expenses]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // 여행 추가
  const addTrip = useCallback(
    async (data: { name: string; currency: string; startDate: string; endDate: string }) => {
      if (!isLoggedIn) {
        store.addTrip({ id: crypto.randomUUID(), ...data });
        return;
      }

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchTrips();
      }
    },
    [isLoggedIn, store, fetchTrips]
  );

  // 여행 수정
  const updateTrip = useCallback(
    async (id: string, updates: Partial<{ name: string; currency: string; startDate: string; endDate: string }>) => {
      if (!isLoggedIn) {
        store.updateTrip(id, updates);
        return;
      }

      const res = await fetch("/api/trips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        await fetchTrips();
      }
    },
    [isLoggedIn, store, fetchTrips]
  );

  // 여행 삭제
  const deleteTrip = useCallback(
    async (id: string) => {
      if (!isLoggedIn) {
        store.deleteTrip(id);
        return;
      }

      const res = await fetch("/api/trips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchTrips();
      }
    },
    [isLoggedIn, store, fetchTrips]
  );

  // 지출 추가
  const addExpense = useCallback(
    async (data: { tripId: string; date: string; amount: number; category: string; memo: string }) => {
      if (!isLoggedIn) {
        store.addExpense({ id: crypto.randomUUID(), ...data });
        return;
      }

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchTrips();
      }
    },
    [isLoggedIn, store, fetchTrips]
  );

  // 지출 수정
  const updateExpense = useCallback(
    async (id: string, updates: Partial<Expense>) => {
      if (!isLoggedIn) {
        store.updateExpense(id, updates);
        return;
      }

      const res = await fetch("/api/expenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        await fetchTrips();
      }
    },
    [isLoggedIn, store, fetchTrips]
  );

  // 지출 삭제
  const deleteExpense = useCallback(
    async (id: string) => {
      if (!isLoggedIn) {
        store.deleteExpense(id);
        return;
      }

      const res = await fetch("/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchTrips();
      }
    },
    [isLoggedIn, store, fetchTrips]
  );

  // 모든 지출 합치기 (trips에 포함된 expenses 평탄화)
  const allExpenses: Expense[] = trips.flatMap((t) =>
    (t.expenses ?? []).map((e) => ({
      ...e,
      photos: (e.photos as Photo[] | undefined) ?? [],
    }))
  );

  return {
    trips,
    expenses: allExpenses,
    loading,
    isLoggedIn,
    addTrip,
    updateTrip,
    deleteTrip,
    addExpense,
    updateExpense,
    deleteExpense,
    refresh: fetchTrips,
  };
}
