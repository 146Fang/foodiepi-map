import type { Metadata } from "next";
import "./globals.css";
// 導入 AppSearchProvider
import { AppSearchProvider } from "@/contexts/AppSearch";

export const metadata: Metadata = {
  title: "FoodiePi Map",
  description: "Web3 App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        {/* 補上 Provider，這是讓 Header 正常運作的關鍵 */}
        <AppSearchProvider>
          {children}
        </AppSearchProvider>
      </body>
    </html>
  );
}