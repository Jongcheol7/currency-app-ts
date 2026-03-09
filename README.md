# 환율 계산기 (Currency Calculator)

실시간 환율 정보를 기반으로 다중 통화 간 환산을 제공하는 웹 애플리케이션입니다.
주변 환전소 위치도 Google Maps를 통해 확인할 수 있습니다.

## 주요 기능

- **실시간 환율 계산** — 최대 4개 통화를 동시에 비교하며 숫자 패드로 금액을 입력하면 즉시 환산
- **다국어 지원** — 한국어, English, 日本語, 中文, Español 5개 언어 전환
- **환전소 지도** — Google Maps 기반으로 현재 위치 주변 환전소 검색, 장소 검색 및 지도 이동 후 재검색
- **모바일 반응형** — 모바일에서는 통화 카드 3개, 데스크탑에서는 4개 표시
- **환율 자동 갱신** — GitHub Actions가 매시 정각 외부 API를 호출하여 DB에 최신 환율 저장

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS v4, shadcn/ui (new-york) |
| 상태 관리 | Zustand (기본 통화, 언어 설정) |
| 서버 데이터 | React Query (@tanstack/react-query) |
| 데이터베이스 | PostgreSQL + Prisma ORM |
| 호스팅 | Vercel (앱), Supabase (DB) |
| 지도 | Google Maps API (@react-google-maps/api) |
| 환율 API | ExchangeRate-API (v6) |
| CI/CD | GitHub Actions (환율 갱신 스케줄러) |

## 시작하기

### 사전 요구사항

- Node.js 18+
- PostgreSQL 데이터베이스
- [ExchangeRate-API](https://www.exchangerate-api.com/) API 키
- [Google Maps API](https://console.cloud.google.com/) 키 (Places 라이브러리 활성화)

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/currencyapp"
DIRECT_URL="postgresql://user:password@localhost:5432/currencyapp"
EXCHANGE_RATE_API_KEY="your-exchangerate-api-key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# Prisma 마이그레이션 및 클라이언트 생성
npx prisma migrate dev
npx prisma generate

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 환율 데이터 초기 등록

개발 서버 실행 후 아래 명령으로 환율 데이터를 DB에 저장합니다:

```bash
curl -X POST http://localhost:3000/api/current-rates
```

## 프로젝트 구조

```
app/
├── (currency)/currency/   # 환율 계산 페이지
├── (map)/map/             # 환전소 지도 페이지
├── api/current-rates/     # 환율 조회(GET) / 갱신(POST) API
├── layout.tsx             # 루트 레이아웃 (React Query Provider)
└── page.tsx               # 홈 (환율 계산 페이지로 연결)

modules/
├── currency/              # 환율 페이지 컴포넌트 (CurrencyCard, NumberPad 등)
├── map/                   # 지도 페이지 컴포넌트
└── common/                # 공통 컴포넌트 (Header)

lib/
├── countryInfo.ts          # 국가별 이름·통화단위 다국어 데이터
├── store/                 # Zustand 스토어 (기본통화, 언어)
├── prisma.ts              # Prisma 클라이언트 인스턴스
└── utils.ts               # 유틸리티 함수

hooks/                     # 커스텀 훅 (useExchangeRates, useIsMobile)
components/ui/             # shadcn/ui 컴포넌트
prisma/schema.prisma       # DB 스키마 (CurrentRate, ExchangeRate)
public/flags/              # 국가 국기 SVG 파일
```

## 빌드

```bash
npm run build    # prisma generate + next build
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```
