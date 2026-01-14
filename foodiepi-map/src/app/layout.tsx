import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}