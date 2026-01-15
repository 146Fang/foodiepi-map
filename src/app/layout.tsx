import type { Metadata } from "next";
import "./globals.css";
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
        {/* 傳入一個空的箭頭函式 () => {} 以滿足 TypeScript 的 onSearch 要求 */}
        <AppSearchProvider onSearch={() => {}}>
          {children}
        </AppSearchProvider>
      </body>
    </html>
  );
}