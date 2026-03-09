import type { LangCode } from "./types";

const translations: Record<string, Record<LangCode, string>> = {
  currencyCalculator: {
    ko: "환율 계산기",
    en: "Currency Calculator",
    ja: "為替計算機",
    zh: "汇率计算器",
    es: "Calculadora de divisas",
  },
  exchange: {
    ko: "환전소",
    en: "Exchange",
    ja: "両替所",
    zh: "兑换处",
    es: "Casa de cambio",
  },
  exchangeLocation: {
    ko: "환전소 위치",
    en: "Exchange Locations",
    ja: "両替所の場所",
    zh: "兑换处位置",
    es: "Ubicación de cambio",
  },
  back: {
    ko: "뒤로가기",
    en: "Back",
    ja: "戻る",
    zh: "返回",
    es: "Volver",
  },
  searchPlaceholder: {
    ko: "장소 검색 (예: 강남역)",
    en: "Search place (e.g. Gangnam)",
    ja: "場所検索 (例: 渋谷駅)",
    zh: "搜索地点 (例: 江南站)",
    es: "Buscar lugar (ej: Gangnam)",
  },
  researchMap: {
    ko: "현재 지도 위치로 재검색",
    en: "Search this area",
    ja: "この地図で再検索",
    zh: "在当前地图位置重新搜索",
    es: "Buscar en esta área",
  },
  findMe: {
    ko: "내 위치 찾기",
    en: "Find me",
    ja: "現在地",
    zh: "我的位置",
    es: "Mi ubicación",
  },
};

export function t(key: string, lang: LangCode): string {
  return translations[key]?.[lang] ?? translations[key]?.["ko"] ?? key;
}
