import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SakuraEffect from "@/components/SakuraEffect";
import TiffanyBubbles from "@/components/TiffanyBubbles";
import AuthProvider from "@/app/(norm)/providers/AuthProvider";
import "@/app/globals.css";
import React from "react";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'MiMi AI',
  description: 'MiMi AI',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 获取当前语言环境和消息
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 antialiased`}>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <SakuraEffect />
              <TiffanyBubbles />
            </div>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}