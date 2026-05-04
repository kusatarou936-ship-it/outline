import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import ScrollReset from "./components/ScrollReset";

const siteUrl = process.env.SITE_URL;
if (!siteUrl) {
  throw new Error("SITE_URL is not set. Set process.env.SITE_URL.");
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Outline",
  description: "Quiet Showcase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-[#f9f5ef] text-gray-800 min-h-screen antialiased">
        <I18nProvider>
          <ScrollReset />
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
