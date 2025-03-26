import { NextIntlClientProvider } from 'next-intl';
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SakuraEffect from "@/components/SakuraEffect";
import TiffanyBubbles from "@/components/TiffanyBubbles";
import "../globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params properly
  const { locale } = await params;

  // Load translation files
  const messages = (await import(`../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <SakuraEffect />
              <TiffanyBubbles />
            </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}