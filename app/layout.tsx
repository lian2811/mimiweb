import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SakuraEffect from "@/components/SakuraEffect";
import TiffanyBubbles from "@/components/TiffanyBubbles";
import "./globals.css";
import React from "react";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 antialiased`}>
        <NextIntlClientProvider>
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