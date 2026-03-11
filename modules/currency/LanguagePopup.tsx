import { Button } from "@/components/ui/button";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Check, Languages } from "lucide-react";
import { useState } from "react";

type Props = {
  setIsLanPopShow: (value: boolean) => void;
};

const LANGUAGES = [
  { value: "ko", label: "한국어", sub: "Korean" },
  { value: "en", label: "English", sub: "English" },
  { value: "ja", label: "日本語", sub: "Japanese" },
  { value: "zh", label: "中文", sub: "Chinese" },
  { value: "es", label: "Español", sub: "Spanish" },
] as const;

export default function LanguegePopup({ setIsLanPopShow }: Props) {
  const { language, setLanguage } = useLangueStore();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleConfirm = () => {
    setLanguage(selectedLanguage);
    setIsLanPopShow(false);
  };

  return (
    <div>
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 z-50 w-72 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <Languages className="size-5 text-slate-600 dark:text-slate-300" />
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t("language", language as LangCode)}</h1>
        </div>

        <RadioGroup
          value={selectedLanguage}
          onValueChange={(value) => setSelectedLanguage(value)}
          className="px-2 pb-2"
        >
          {LANGUAGES.map(({ value, label, sub }) => (
            <label
              key={value}
              htmlFor={value}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                selectedLanguage === value
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  : "hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={value}
                  id={value}
                  className="sr-only"
                />
                <span className="font-medium text-sm">{label}</span>
                {label !== sub && (
                  <span className="text-xs text-slate-400">{sub}</span>
                )}
              </div>
              {selectedLanguage === value && (
                <Check className="size-4 text-blue-500" />
              )}
            </label>
          ))}
        </RadioGroup>

        <div className="px-4 pb-4 pt-1">
          <Button
            className="w-full rounded-xl"
            onClick={handleConfirm}
          >
            {t("confirm", language as LangCode)}
          </Button>
        </div>
      </div>

      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
        onClick={() => setIsLanPopShow(false)}
      />
    </div>
  );
}
