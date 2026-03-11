"use client";
import { useEffect } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useLangueStore } from "@/lib/store/useLangueStore";

export default function SettingsSync() {
  const { saveSettings, isLoggedIn } = useUserSettings();
  const isDark = useThemeStore((s) => s.isDark);
  const language = useLangueStore((s) => s.language);

  // Auto-save dark mode changes
  useEffect(() => {
    if (!isLoggedIn) return;
    saveSettings({ isDark });
  }, [isDark, isLoggedIn, saveSettings]);

  // Auto-save language changes
  useEffect(() => {
    if (!isLoggedIn) return;
    saveSettings({ language });
  }, [language, isLoggedIn, saveSettings]);

  return null;
}
