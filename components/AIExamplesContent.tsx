// Server component (no "use client" directive)
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Define the props interface
interface AIExamplesContentProps {
  activeExample: string;
  setActiveExample: (id: string) => void;
  locale: string;
}

// Define example interface
interface Example {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function AIExamplesContent({
  activeExample,
  setActiveExample,
}: AIExamplesContentProps) {
  const t = useTranslations('ai-magic');

  // 示例列表
  const examples: Example[] = [
    {
      id: 'ziwei',
      title: t('examples.ziwei.title'),
      description: t('examples.ziwei.description'),
      icon: <span className="text-2xl">✨</span>,
      component: (
        <div className="h-full flex items-center justify-center p-4">
          <Link 
            href="/ziwei" 
            className="flex items-center justify-center bg-gradient-to-r from-[#0abab5] to-[#FFB7C5] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
          >
            {t('examples.ziwei.buttonText')}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      )
    },
    {
      id: 'tarot',
      title: t('examples.tarot.title'),
      description: t('examples.tarot.description'),
      icon: <span className="text-2xl">🔮</span>,
      component: (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#0abab5]">{t('examples.tarot.title')}</h3>
          <p className="mb-6">{t('examples.tarot.comingSoon')}</p>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <motion.div 
                key={i}
                className="aspect-[2/3] bg-gradient-to-br from-[#0abab5]/30 to-[#FFB7C5]/30 rounded-lg shadow-md"
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'astrology',
      title: t('examples.astrology.title'),
      description: t('examples.astrology.description'),
      icon: <span className="text-2xl">⭐</span>,
      component: (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#0abab5]">{t('examples.astrology.title')}</h3>
          <p className="mb-6">{t('examples.astrology.comingSoon')}</p>
          <div className="grid grid-cols-4 gap-4 max-w-lg">
            {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((sign, i) => (
              <motion.div 
                key={i}
                className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#0abab5]/20 to-[#FFB7C5]/20 rounded-full text-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {sign}
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'numerology',
      title: t('examples.numerology.title'),
      description: t('examples.numerology.description'),
      icon: <span className="text-2xl">🔢</span>,
      component: (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#0abab5]">{t('examples.numerology.title')}</h3>
          <p className="mb-6">{t('examples.numerology.comingSoon')}</p>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <motion.div 
                key={num}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#0abab5]/20 to-[#FFB7C5]/20 text-xl font-bold"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  ];

  // 获取当前示例
  const currentExample = examples.find(ex => ex.id === activeExample) || examples[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8">
      {/* 左側選擇器 */}
      <div className="flex-shrink-0 w-full md:w-1/3">
        <h2 className="text-3xl font-bold mb-8 text-center md:text-left">{t('examplesTitle')}</h2>
        <div className="flex flex-wrap md:flex-col justify-center md:justify-start gap-4">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all w-full text-left ${
                activeExample === example.id
                  ? "bg-gradient-to-r from-[#0abab5] to-[#FFB7C5] text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 shadow-md hover:shadow-lg"
              }`}
            >
              <div>{example.icon}</div>
              <div>
                <div className="font-bold">{example.title}</div>
                <div className="text-xs opacity-80">{example.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 右側展示區域 */}
      <motion.div
        key={currentExample.id}
        className="flex-grow bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 min-h-[400px] border border-gray-100 dark:border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentExample.component}
      </motion.div>
    </div>
  );
}