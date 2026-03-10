import ReactQueryClientProvider from "@/components/common/ReactQueryProvider";
import SessionProvider from "@/components/common/SessionProvider";
import "./globals.css";

export const metadata = {
  title: "환율",
  icons: {
    icon: "/currency-logo.png", // 또는 "/favicon.png", "/favicon.svg"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ 모바일 화면 최적화를 위한 필수 메타 태그 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>환율</title>
        <link rel="icon" href="/currency-logo.png" />
      </head>
      <body className="bg-gradient-to-b from-slate-100 to-slate-200 min-h-screen">
        <div className="sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-3">
          <SessionProvider>
            <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
