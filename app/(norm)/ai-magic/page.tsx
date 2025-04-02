'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AIExamples from '@/app/(norm)/ai-magic/AIExamples';
import { useTranslations } from 'next-intl';

export default function AIMagic() {
  const t = useTranslations('ai-magic');
  
  return (
    <div className="min-h-screen pt-24">
      <div className="min-h-screen w-full py-4 px-4 bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-8">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* 主要内容：AI示例 */}
          <motion.div 
            className="mb-16 h-[70vh]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AIExamples />
          </motion.div>

          {/* 装饰元素 */}
          <div className="absolute top-40 right-10 w-40 h-40 bg-[var(--primary)]/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-40 left-10 w-60 h-60 bg-[var(--secondary)]/10 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </div>
  );
}

