import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import ScrollReset from "./components/ScrollReset";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "Outline",
  description: "Quiet Showcase",
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
