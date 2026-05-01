import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import ScrollReset from "@/components/ScrollReset"; // ← 別ファイルに切り出す

export const metadata: Metadata = {
  title: "Outline",
  description: "A quiet, uniform showcase for personal works.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-[#f9f5ef] text-gray-800 min-h-screen antialiased flex flex-col">
        <I18nProvider>
          <ScrollReset />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
