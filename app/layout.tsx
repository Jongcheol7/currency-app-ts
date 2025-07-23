import ReactQueryClientProvider from "@/components/common/ReactQueryProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-2 bg-gray-200">
        {/* <body className="px-36  bg-gray-200"> */}
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  );
}
