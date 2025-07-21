import { create } from "zustand";

type state = {
  language: string;
  setLanguage: (value: string) => void;
};

export const useLangueStore = create<state>((set) => ({
  language: "ko",
  setLanguage: (value) => set({ language: value }),
}));
