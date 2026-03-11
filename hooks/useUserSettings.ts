"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useCallback } from "react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useLangueStore } from "@/lib/store/useLangueStore";

type SettingsData = {
  isDark: boolean;
  language: string;
  cardCount: number;
  selectedCurrencies: string[];
  focusCard: number;
  inputAmount: string;
};

type CurrencySettings = {
  cardCount: number;
  selectedCurrencies: string[];
  focusCard: number;
  inputAmount: string;
};

let currencySettingsRef: CurrencySettings = {
  cardCount: 4,
  selectedCurrencies: ["KRW", "USD", "VND", "JPY"],
  focusCard: 0,
  inputAmount: "0",
};

let onCurrencySettingsLoaded: ((s: CurrencySettings) => void) | null = null;

export function registerCurrencySettingsCallback(
  cb: (s: CurrencySettings) => void
) {
  onCurrencySettingsLoaded = cb;
}

export function updateCurrencySettings(s: CurrencySettings) {
  currencySettingsRef = s;
}

export function useUserSettings() {
  const { data: session } = useSession();
  const { isDark, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLangueStore();
  const loadedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load settings from server on login
  useEffect(() => {
    if (!session?.user || loadedRef.current) return;
    loadedRef.current = true;

    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SettingsData | null) => {
        if (!data) return;

        // Apply dark mode
        if (data.isDark !== isDark) {
          toggleTheme();
        }

        // Apply language
        if (data.language && data.language !== language) {
          setLanguage(data.language);
        }

        // Apply currency settings
        if (data.cardCount && data.selectedCurrencies) {
          currencySettingsRef = {
            cardCount: data.cardCount,
            selectedCurrencies: data.selectedCurrencies as string[],
            focusCard: data.focusCard ?? 0,
            inputAmount: data.inputAmount ?? "0",
          };
          onCurrencySettingsLoaded?.(currencySettingsRef);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  // Save settings to server (debounced)
  const saveSettings = useCallback(
    (partial: Partial<SettingsData>) => {
      if (!session?.user) return;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partial),
        }).catch(() => {});
      }, 500);
    },
    [session?.user]
  );

  return { saveSettings, isLoggedIn: !!session?.user };
}
