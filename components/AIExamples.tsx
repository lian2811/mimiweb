'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

// 定义示例类型
interface Example {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const AIExamples = () => {
  const [activeExample, setActiveExample] = useState<string>('ziwei');
  const pathname = usePathname();
  
  // 检测当前语言，默认为中文
  const locale = pathname.startsWith('/en') ? 'en' : 'zh';
  
  // 根据当前语言选择文本
  const texts = {
    en: {
      title: 'AI Demo Examples',
      ziwei: {
        title: 'Purple Star Astrology',
        description: 'Personal astrology analysis based on birth date and time',
        buttonText: 'View Purple Star Chart',
        comingSoon: 'Coming Soon!'
      },
      tarot: {
        title: 'Tarot Reading',
        description: 'Digital tarot card reading, explore the mysteries of fate',
        comingSoon: 'Coming Soon! Stay tuned for our tarot card reading system.'
      },
      astrology: {
        title: 'Horoscope',
        description: 'Daily, weekly, and monthly predictions based on star signs',
        comingSoon: 'Coming Soon! Our AI will provide personalized horoscope analysis.'
      },
      numerology: {
        title: 'Numerology',
        description: 'Explore how numbers influence your life and personality',
        comingSoon: 'Coming Soon! Explore the mysterious connection between numbers and your destiny.'
      }
    },
    zh: {
      title: 'AI 展示範例',
      ziwei: {
        title: '紫微命盤',
        description: '基於出生日期時間的個人紫微斗數分析',
        buttonText: '查看紫微命盤',
        comingSoon: '即將推出！'
      },
      tarot: {
        title: '塔羅牌占卜',
        description: '數字化塔羅牌占卜，探索命運的奧秘',
        comingSoon: '功能即將推出！敬請期待我們的塔羅牌占卜系統。'
      },
      astrology: {
        title: '星座運勢',
        description: '基於星象的每日、每週和每月運勢預測',
        comingSoon: '功能即將推出！我們的AI將提供個性化的星座運勢分析。'
      },
      numerology: {
        title: '數字能量',
        description: '探索數字對你生活和性格的影響',
        comingSoon: '功能即將推出！探索數字與你命運的神秘連結。'
      }
    }
  };
  
  const t = texts[locale as 'en' | 'zh'];

  // 示例列表
  const examples: Example[] = [
    {
      id: 'ziwei',
      title: t.ziwei.title,
      description: t.ziwei.description,
      icon: <span className="text-2xl">✨</span>,
      component: (
        <div className="h-full flex items-center justify-center p-4">
          <Link 
            href={`/${locale}/ziwei`} 
            className="flex items-center justify-center bg-gradient-to-r from-[#0abab5] to-[#FFB7C5] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
          >
            {t.ziwei.buttonText}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      )
    },
    {
      id: 'tarot',
      title: t.tarot.title,
      description: t.tarot.description,
      icon: <span className="text-2xl">🔮</span>,
      component: (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#0abab5]">{t.tarot.title}</h3>
          <p className="mb-6">{t.tarot.comingSoon}</p>
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
      title: t.astrology.title,
      description: t.astrology.description,
      icon: <span className="text-2xl">⭐</span>,
      component: (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#0abab5]">{t.astrology.title}</h3>
          <p className="mb-6">{t.astrology.comingSoon}</p>
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
      title: t.numerology.title,
      description: t.numerology.description,
      icon: <span className="text-2xl">🔢</span>,
      component: (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#0abab5]">{t.numerology.title}</h3>
          <p className="mb-6">{t.numerology.comingSoon}</p>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <motion.div 
                key={num}
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#0abab5]/30 to-[#FFB7C5]/30 rounded-lg text-xl font-bold"
                whileHover={{ y: -8, scale: 1.2 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring", 
                  stiffness: 300 
                }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
  ];

  // 获取当前激活的示例
  const currentExample = examples.find(ex => ex.id === activeExample) || examples[0];

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-slate-800">
      {/* 左侧示例列表 */}
      <div className="w-full md:w-64 lg:w-80 flex-shrink-0 border-r border-gray-100 dark:border-slate-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="font-bold text-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0abab5] to-[#FFB7C5]">
            {t.title}
          </h2>
          <div className="space-y-2">
            {examples.map(example => (
              <motion.button
                key={example.id}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                  activeExample === example.id 
                    ? 'bg-gradient-to-r from-[#0abab5]/10 to-[#FFB7C5]/10 border-l-4 border-[#0abab5]' 
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => setActiveExample(example.id)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#0abab5]/20 to-[#FFB7C5]/20 flex items-center justify-center">
                  {example.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{example.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{example.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧内容展示区 */}
      <motion.div 
        className="flex-grow h-full overflow-y-auto bg-gradient-to-br from-[#0abab5]/5 to-[#FFB7C5]/5"
        key={activeExample}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentExample.component}
      </motion.div>
    </div>
  );
};

export default AIExamples;