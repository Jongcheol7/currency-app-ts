export type LangCode = "ko" | "en" | "ja" | "zh" | "es";

export type CountryNames = Record<LangCode, string>;

export type CurrencyUnit = Record<LangCode, string>;

export type CountryData = {
  flag: string;
  names: CountryNames;
  unit: CurrencyUnit;
};
