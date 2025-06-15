type CountryNames = {
  ko: string;
  en: string;
  ja: string;
  zh: string;
  es: string;
};

type CurrencyUnit = {
  ko: string;
  en: string;
  ja: string;
  zh: string;
  es: string;
};

type CountryData = {
  flag: string;
  names: CountryNames;
  unit: CurrencyUnit;
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
    unit: { ko: "원", en: "won", ja: "ウォン", zh: "韩元", es: "won" },
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
    unit: { ko: "달러", en: "dollar", ja: "ドル", zh: "美元", es: "dólar" },
  },
  JPY: {
    flag: "/flags/jp.svg",
    names: { ko: "일본", en: "Japan", ja: "日本", zh: "日本", es: "Japón" },
    unit: { ko: "엔", en: "yen", ja: "円", zh: "日元", es: "yen" },
  },
  CNY: {
    flag: "/flags/cn.svg",
    names: { ko: "중국", en: "China", ja: "中国", zh: "中国", es: "China" },
    unit: { ko: "위안", en: "yuan", ja: "元", zh: "人民币", es: "yuan" },
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
    unit: { ko: "동", en: "dong", ja: "ドン", zh: "越南盾", es: "dong" },
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
    unit: { ko: "유로", en: "euro", ja: "ユーロ", zh: "欧元", es: "euro" },
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
    unit: { ko: "파운드", en: "pound", ja: "ポンド", zh: "英镑", es: "libra" },
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
    unit: {
      ko: "호주 달러",
      en: "Australian dollar",
      ja: "オーストラリアドル",
      zh: "澳元",
      es: "dólar australiano",
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
    unit: {
      ko: "캐나다 달러",
      en: "Canadian dollar",
      ja: "カナダドル",
      zh: "加元",
      es: "dólar canadiense",
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
    unit: {
      ko: "싱가포르 달러",
      en: "Singapore dollar",
      ja: "シンガポールドル",
      zh: "新元",
      es: "dólar singapurense",
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
    unit: { ko: "바트", en: "baht", ja: "バーツ", zh: "泰铢", es: "baht" },
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
    unit: { ko: "페소", en: "peso", ja: "ペソ", zh: "比索", es: "peso" },
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
    unit: {
      ko: "루피아",
      en: "rupiah",
      ja: "ルピア",
      zh: "印尼盾",
      es: "rupia",
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
    unit: {
      ko: "링깃",
      en: "ringgit",
      ja: "リンギット",
      zh: "马币",
      es: "ringgit",
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
    unit: {
      ko: "홍콩 달러",
      en: "Hong Kong dollar",
      ja: "香港ドル",
      zh: "港元",
      es: "dólar de Hong Kong",
    },
  },
  TWD: {
    flag: "/flags/tw.svg",
    names: { ko: "대만", en: "Taiwan", ja: "台湾", zh: "台湾", es: "Taiwán" },
    unit: {
      ko: "신타이완 달러",
      en: "New Taiwan dollar",
      ja: "ニュー台湾ドル",
      zh: "新台币",
      es: "nuevo dólar taiwanés",
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
    unit: {
      ko: "뉴질랜드 달러",
      en: "New Zealand dollar",
      ja: "ニュージーランドドル",
      zh: "纽元",
      es: "dólar neozelandés",
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
    unit: { ko: "루블", en: "ruble", ja: "ルーブル", zh: "卢布", es: "rublo" },
  },
  INR: {
    flag: "/flags/in.svg",
    names: { ko: "인도", en: "India", ja: "インド", zh: "印度", es: "India" },
    unit: { ko: "루피", en: "rupee", ja: "ルピー", zh: "卢比", es: "rupia" },
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
    unit: { ko: "헤알", en: "real", ja: "レアル", zh: "雷亚尔", es: "real" },
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
    unit: { ko: "페소", en: "peso", ja: "ペソ", zh: "比索", es: "peso" },
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
    unit: { ko: "리라", en: "lira", ja: "リラ", zh: "里拉", es: "lira" },
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
    unit: { ko: "리얄", en: "riyal", ja: "リヤル", zh: "里亚尔", es: "riyal" },
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
    unit: {
      ko: "디르함",
      en: "dirham",
      ja: "ディルハム",
      zh: "迪拉姆",
      es: "dírham",
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
    unit: { ko: "랜드", en: "rand", ja: "ランド", zh: "兰特", es: "rand" },
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
    unit: { ko: "프랑", en: "franc", ja: "フラン", zh: "法郎", es: "franco" },
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
    unit: {
      ko: "크로나",
      en: "krona",
      ja: "クローナ",
      zh: "克朗",
      es: "corona",
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
    unit: {
      ko: "크로네",
      en: "krone",
      ja: "クローネ",
      zh: "克朗",
      es: "corona noruega",
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
    unit: {
      ko: "크로네",
      en: "krone",
      ja: "クローネ",
      zh: "克朗",
      es: "corona danesa",
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
    unit: {
      ko: "즈워티",
      en: "zloty",
      ja: "ズウォティ",
      zh: "兹罗提",
      es: "esloti",
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
    unit: {
      ko: "코루나",
      en: "koruna",
      ja: "コルナ",
      zh: "克朗",
      es: "corona checa",
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
    unit: {
      ko: "포린트",
      en: "forint",
      ja: "フォリント",
      zh: "福林",
      es: "forinto",
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
    unit: {
      ko: "셰켈",
      en: "shekel",
      ja: "シェケル",
      zh: "谢克尔",
      es: "shéquel",
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
    unit: {
      ko: "파운드",
      en: "pound",
      ja: "ポンド",
      zh: "镑",
      es: "libra egipcia",
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
    unit: { ko: "페소", en: "peso", ja: "ペソ", zh: "比索", es: "peso" },
  },
  CLP: {
    flag: "/flags/cl.svg",
    names: { ko: "칠레", en: "Chile", ja: "チリ", zh: "智利", es: "Chile" },
    unit: {
      ko: "페소",
      en: "peso",
      ja: "ペソ",
      zh: "比索",
      es: "peso chileno",
    },
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
    unit: {
      ko: "페소",
      en: "peso",
      ja: "ペソ",
      zh: "比索",
      es: "peso colombiano",
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
    unit: {
      ko: "루피",
      en: "rupee",
      ja: "ルピー",
      zh: "卢比",
      es: "rupia pakistaní",
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
    unit: { ko: "타카", en: "taka", ja: "タカ", zh: "塔卡", es: "taka" },
  },
};
