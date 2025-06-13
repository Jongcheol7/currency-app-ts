type CountryNames = {
  [key: string]: string;
};
type CountryData = {
  flag: string;
  names: CountryNames;
};
export const CountryInfo: Record<string, CountryData> = {
  KRW: {
    flag: "/flags/kr.svg",
    names: {
      ko: "대한민국",
      en: "Korea",
      ja: "大韓民国",
      zh: "韩国",
      es: "Corea del Sur",
    },
  },
  USD: {
    flag: "/flags/us.svg",
    names: {
      ko: "미국",
      en: "United States",
      ja: "アメリカ合衆国",
      zh: "美国",
      es: "Estados Unidos",
    },
  },
  JPY: {
    flag: "/flags/jp.svg",
    names: { ko: "일본", en: "Japan", ja: "日本", zh: "日本", es: "Japón" },
  },
  CNY: {
    flag: "/flags/cn.svg",
    names: { ko: "중국", en: "China", ja: "中国", zh: "中国", es: "China" },
  },
  VND: {
    flag: "/flags/vn.svg",
    names: {
      ko: "베트남",
      en: "Vietnam",
      ja: "ベトナム",
      zh: "越南",
      es: "Vietnam",
    },
  },
  EUR: {
    flag: "/flags/eu.svg",
    names: {
      ko: "유럽연합",
      en: "European Union",
      ja: "欧州連合",
      zh: "欧盟",
      es: "Unión Europea",
    },
  },
  GBP: {
    flag: "/flags/gb.svg",
    names: {
      ko: "영국",
      en: "United Kingdom",
      ja: "イギリス",
      zh: "英国",
      es: "Reino Unido",
    },
  },
  AUD: {
    flag: "/flags/au.svg",
    names: {
      ko: "호주",
      en: "Australia",
      ja: "オーストラリア",
      zh: "澳大利亚",
      es: "Australia",
    },
  },
  CAD: {
    flag: "/flags/ca.svg",
    names: {
      ko: "캐나다",
      en: "Canada",
      ja: "カナダ",
      zh: "加拿大",
      es: "Canadá",
    },
  },
  SGD: {
    flag: "/flags/sg.svg",
    names: {
      ko: "싱가포르",
      en: "Singapore",
      ja: "シンガポール",
      zh: "新加坡",
      es: "Singapur",
    },
  },
  THB: {
    flag: "/flags/th.svg",
    names: {
      ko: "태국",
      en: "Thailand",
      ja: "タイ",
      zh: "泰国",
      es: "Tailandia",
    },
  },
  PHP: {
    flag: "/flags/ph.svg",
    names: {
      ko: "필리핀",
      en: "Philippines",
      ja: "フィリピン",
      zh: "菲律宾",
      es: "Filipinas",
    },
  },
  IDR: {
    flag: "/flags/id.svg",
    names: {
      ko: "인도네시아",
      en: "Indonesia",
      ja: "インドネシア",
      zh: "印度尼西亚",
      es: "Indonesia",
    },
  },
  MYR: {
    flag: "/flags/my.svg",
    names: {
      ko: "말레이시아",
      en: "Malaysia",
      ja: "マレーシア",
      zh: "马来西亚",
      es: "Malasia",
    },
  },
  HKD: {
    flag: "/flags/hk.svg",
    names: {
      ko: "홍콩",
      en: "Hong Kong",
      ja: "香港",
      zh: "香港",
      es: "Hong Kong",
    },
  },
  TWD: {
    flag: "/flags/tw.svg",
    names: {
      ko: "대만",
      en: "Taiwan",
      ja: "台湾",
      zh: "台湾",
      es: "Taiwán",
    },
  },
  NZD: {
    flag: "/flags/nz.svg",
    names: {
      ko: "뉴질랜드",
      en: "New Zealand",
      ja: "ニュージーランド",
      zh: "新西兰",
      es: "Nueva Zelanda",
    },
  },
  RUB: {
    flag: "/flags/ru.svg",
    names: {
      ko: "러시아",
      en: "Russia",
      ja: "ロシア",
      zh: "俄罗斯",
      es: "Rusia",
    },
  },
  INR: {
    flag: "/flags/in.svg",
    names: {
      ko: "인도",
      en: "India",
      ja: "インド",
      zh: "印度",
      es: "India",
    },
  },
  BRL: {
    flag: "/flags/br.svg",
    names: {
      ko: "브라질",
      en: "Brazil",
      ja: "ブラジル",
      zh: "巴西",
      es: "Brasil",
    },
  },
  MXN: {
    flag: "/flags/mx.svg",
    names: {
      ko: "멕시코",
      en: "Mexico",
      ja: "メキシコ",
      zh: "墨西哥",
      es: "México",
    },
  },
  TRY: {
    flag: "/flags/tr.svg",
    names: {
      ko: "튀르키예",
      en: "Turkey",
      ja: "トルコ",
      zh: "土耳其",
      es: "Turquía",
    },
  },
  SAR: {
    flag: "/flags/sa.svg",
    names: {
      ko: "사우디아라비아",
      en: "Saudi Arabia",
      ja: "サウジアラビア",
      zh: "沙特阿拉伯",
      es: "Arabia Saudita",
    },
  },
  AED: {
    flag: "/flags/ae.svg",
    names: {
      ko: "아랍에미리트",
      en: "UAE",
      ja: "アラブ首長国連邦",
      zh: "阿联酋",
      es: "Emiratos Árabes Unidos",
    },
  },
  ZAR: {
    flag: "/flags/za.svg",
    names: {
      ko: "남아프리카",
      en: "South Africa",
      ja: "南アフリカ",
      zh: "南非",
      es: "Sudáfrica",
    },
  },
  CHF: {
    flag: "/flags/ch.svg",
    names: {
      ko: "스위스",
      en: "Switzerland",
      ja: "スイス",
      zh: "瑞士",
      es: "Suiza",
    },
  },
  SEK: {
    flag: "/flags/se.svg",
    names: {
      ko: "스웨덴",
      en: "Sweden",
      ja: "スウェーデン",
      zh: "瑞典",
      es: "Suecia",
    },
  },
  NOK: {
    flag: "/flags/no.svg",
    names: {
      ko: "노르웨이",
      en: "Norway",
      ja: "ノルウェー",
      zh: "挪威",
      es: "Noruega",
    },
  },
  DKK: {
    flag: "/flags/dk.svg",
    names: {
      ko: "덴마크",
      en: "Denmark",
      ja: "デンマーク",
      zh: "丹麦",
      es: "Dinamarca",
    },
  },
  PLN: {
    flag: "/flags/pl.svg",
    names: {
      ko: "폴란드",
      en: "Poland",
      ja: "ポーランド",
      zh: "波兰",
      es: "Polonia",
    },
  },
  CZK: {
    flag: "/flags/cz.svg",
    names: {
      ko: "체코",
      en: "Czech Republic",
      ja: "チェコ",
      zh: "捷克",
      es: "Chequia",
    },
  },
  HUF: {
    flag: "/flags/hu.svg",
    names: {
      ko: "헝가리",
      en: "Hungary",
      ja: "ハンガリー",
      zh: "匈牙利",
      es: "Hungría",
    },
  },
  ILS: {
    flag: "/flags/il.svg",
    names: {
      ko: "이스라엘",
      en: "Israel",
      ja: "イスラエル",
      zh: "以色列",
      es: "Israel",
    },
  },
  EGP: {
    flag: "/flags/eg.svg",
    names: {
      ko: "이집트",
      en: "Egypt",
      ja: "エジプト",
      zh: "埃及",
      es: "Egipto",
    },
  },
  ARS: {
    flag: "/flags/ar.svg",
    names: {
      ko: "아르헨티나",
      en: "Argentina",
      ja: "アルゼンチン",
      zh: "阿根廷",
      es: "Argentina",
    },
  },
  CLP: {
    flag: "/flags/cl.svg",
    names: { ko: "칠레", en: "Chile", ja: "チリ", zh: "智利", es: "Chile" },
  },
  COP: {
    flag: "/flags/co.svg",
    names: {
      ko: "콜롬비아",
      en: "Colombia",
      ja: "コロンビア",
      zh: "哥伦比亚",
      es: "Colombia",
    },
  },
  PKR: {
    flag: "/flags/pk.svg",
    names: {
      ko: "파키스탄",
      en: "Pakistan",
      ja: "パキスタン",
      zh: "巴基斯坦",
      es: "Pakistán",
    },
  },
  BDT: {
    flag: "/flags/bd.svg",
    names: {
      ko: "방글라데시",
      en: "Bangladesh",
      ja: "バングラデシュ",
      zh: "孟加拉国",
      es: "Bangladés",
    },
  },
};
