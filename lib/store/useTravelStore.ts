import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Photo = {
  key: string;
  url: string;
};

export type Expense = {
  id: string;
  tripId: string;
  date: string;
  amount: number;
  category: string;
  memo: string;
  location?: string;
  lat?: number;
  lng?: number;
  photos?: Photo[];
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
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
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
      updateTrip: (id, updates) =>
        set((s) => ({
          trips: s.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTrip: (id) =>
        set((s) => ({
          trips: s.trips.filter((t) => t.id !== id),
          expenses: s.expenses.filter((e) => e.tripId !== id),
        })),
      addExpense: (expense) =>
        set((s) => ({ expenses: [...s.expenses, expense] })),
      updateExpense: (id, updates) =>
        set((s) => ({
          expenses: s.expenses.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
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
