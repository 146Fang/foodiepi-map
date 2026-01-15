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
        {/* 必須傳入 onSearch 函式以滿足 TypeScript 要求 */}
        <AppSearchProvider onSearch={(term: string) => { console.log('Searching:', term); }}>
          {children}
        </AppSearchProvider>
      </body>
    </html>
  );
}