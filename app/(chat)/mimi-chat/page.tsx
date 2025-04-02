'use client';

import MimiChatContent from './MimiChatContent';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function MimiChatPage() {
  return (
    <div className={`flex flex-col h-screen w-screen bg-gradient-to-br from-slate-950 to-slate-900 ${poppins.className}`}>
      <MimiChatContent />
    </div>
  );
}