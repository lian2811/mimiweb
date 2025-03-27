'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AIExamplesContent from './AIExamplesContent';

const AIExamples = () => {
  const [activeExample, setActiveExample] = useState<string>('ziwei');
  const pathname = usePathname();
  
  // 检测当前语言，默认为中文
  const locale = pathname.startsWith('/en') ? 'en' : 'zh';

  return (
    <AIExamplesContent 
      activeExample={activeExample}
      setActiveExample={setActiveExample}
      locale={locale}
    />
  );
};

export default AIExamples;