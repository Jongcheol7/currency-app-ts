import ReactQueryClientProvider from "@/components/common/ReactQueryProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-gray-200">
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  );
}
