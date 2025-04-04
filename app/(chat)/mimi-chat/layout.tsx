import React from 'react';
import { Inter } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import SakuraEffect from "@/components/SakuraEffect";
import TiffanyBubbles from "@/components/TiffanyBubbles";
import AuthProvider from "@/app/providers/AuthProvider";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'MiMi Chat',
  description: 'MiMi AI Chat Interface',
};

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 获取当前语言环境和消息
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-slate-950 text-white antialiased overflow-hidden`}>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <SakuraEffect />
            <TiffanyBubbles />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}