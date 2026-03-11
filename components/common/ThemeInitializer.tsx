"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/useThemeStore";

export default function ThemeInitializer() {
  const isDark = useThemeStore((s) => s.isDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return null;
}
