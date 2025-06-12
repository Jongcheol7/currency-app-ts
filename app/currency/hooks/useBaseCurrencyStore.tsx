import { create } from "zustand";

type state = {
  baseCurrency: string;
  setBaseCurrency: (value: string) => void;
};

export const useBaseCurrencyStore = create<state>((set) => ({
  baseCurrency: "",
  setBaseCurrency: (value) => set({ baseCurrency: value }),
}));
