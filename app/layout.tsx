import ReactQueryClientProvider from "@/components/common/ReactQueryProvider";
import SessionProvider from "@/components/common/SessionProvider";
import ThemeInitializer from "@/components/common/ThemeInitializer";
import SettingsSync from "@/components/common/SettingsSync";
import "./globals.css";

export const metadata = {
  title: "환율",
  icons: {
    icon: "/currency-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>환율</title>
        <link rel="icon" href="/currency-logo.png" />
      </head>
      <body className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-zinc-950 min-h-screen transition-colors">
        <ThemeInitializer />
        <div className="sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-3">
          <SessionProvider>
            <ReactQueryClientProvider>
              <SettingsSync />
              {children}
            </ReactQueryClientProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
