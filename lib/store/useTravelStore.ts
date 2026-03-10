import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Expense = {
  id: string;
  tripId: string;
  date: string;
  amount: number;
  category: string;
  memo: string;
};

export type Trip = {
  id: string;
  name: string;
  currency: string;
  startDate: string;
  endDate: string;
};

type TravelState = {
  trips: Trip[];
  expenses: Expense[];
  addTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  getTripExpenses: (tripId: string) => Expense[];
  getTripTotal: (tripId: string) => number;
};

export const useTravelStore = create<TravelState>()(
  persist(
    (set, get) => ({
      trips: [],
      expenses: [],
      addTrip: (trip) => set((s) => ({ trips: [...s.trips, trip] })),
      deleteTrip: (id) =>
        set((s) => ({
          trips: s.trips.filter((t) => t.id !== id),
          expenses: s.expenses.filter((e) => e.tripId !== id),
        })),
      addExpense: (expense) =>
        set((s) => ({ expenses: [...s.expenses, expense] })),
      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
      getTripExpenses: (tripId) =>
        get().expenses.filter((e) => e.tripId === tripId),
      getTripTotal: (tripId) =>
        get()
          .expenses.filter((e) => e.tripId === tripId)
          .reduce((sum, e) => sum + e.amount, 0),
    }),
    { name: "travel-storage" }
  )
);
