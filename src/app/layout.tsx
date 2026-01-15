import type { Metadata } from "next";
import "./globals.css";
// 導入你的 Provider
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
        {/* 核心修復：
          報錯是因為 AppSearchProvider 要求一個必須的 onSearch 屬性。
          我們在這裡傳入一個空的箭頭函式 (term: string) => {}，
          這能滿足 TypeScript 的類型檢查，讓編譯順利通過。
        */}
        <AppSearchProvider onSearch={(term: string) => { console.log("Root search:", term); }}>
          {children}
        </AppSearchProvider>
      </body>
    </html>
  );
}