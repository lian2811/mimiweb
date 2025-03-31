"use client";

import { useTranslations } from "next-intl";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// 動態導入 Lottie 和 Three.js 相關組件
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// 導入 Lottie 動畫 JSON 文件
import robotAnimation from "./animations/robot.json";
import floatingBubbles from "./animations/floating-bubbles.json";
import aiCommunication from "./animations/ai-communication.json";
import cuteAgent from "./animations/cute-creatures.json";

// 定義組件 props 接口
interface FutureVisionContentProps {
  fadeIn: Variants;
  staggerContainer: Variants;
  floatAnimation: Variants;
}

// 定義頁面內容接口
interface PageContent {
  id: number;
  title: string;
  content: React.ReactNode;
}

export default function FutureVisionContent({
}: FutureVisionContentProps) {
  const t = useTranslations('futureVision');
  const [showFullCanvas, setShowFullCanvas] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDirection, setPageDirection] = useState(0); // -1 左翻, 1 右翻, 0 初始
  const [isAnimating, setIsAnimating] = useState(false);

  // 生物卡片數據
  const creatures = [
    {
      name: t('creatures.aiAssistant.name'),
      description: t('creatures.aiAssistant.description'),
      animation: robotAnimation,
      color: "from-blue-400 to-purple-500"
    },
    {
      name: t('creatures.personalAgent.name'),
      description: t('creatures.personalAgent.description'),
      animation: cuteAgent,
      color: "from-pink-400 to-orange-400"
    },
    {
      name: t('creatures.smartCompanion.name'),
      description: t('creatures.smartCompanion.description'),
      animation: aiCommunication,
      color: "from-green-400 to-teal-500"
    }
  ];

  // 處理視窗大小變化
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setShowFullCanvas(false);
      }
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 翻頁處理函數
  const goToPage = (pageNumber: number) => {
    if (isAnimating) return;
    
    if (pageNumber < 0) {
      pageNumber = pages.length - 1;
    } else if (pageNumber >= pages.length) {
      pageNumber = 0;
    }
    
    setPageDirection(pageNumber > currentPage ? 1 : -1);
    setIsAnimating(true);
    setCurrentPage(pageNumber);
  };

  // 創建童話書頁面
  const renderHero = () => (
    <div className="relative h-full flex flex-col justify-center items-center">
      <motion.div 
        className="absolute top-5 right-5 w-32 h-32"
        animate={{
          rotate: [0, 10, 0, -10, 0],
          y: [0, -5, 0, -5, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Lottie 
          animationData={floatingBubbles} 
          loop={true}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-center">
          {t('hero.title')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">{t('hero.titleHighlight')}</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl mx-auto">
          {t('hero.subtitle')}
        </p>
        
        <div className="w-full h-48 sm:h-64 my-8 relative">
          <Lottie 
            animationData={floatingBubbles} 
            loop={true} 
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setShowFullCanvas(!showFullCanvas)}
            className="py-3 px-6 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {showFullCanvas ? t('hero.hideCreatures') : t('hero.exploreCreatures')}
          </button>
          <Link 
            href="/ai-magic"
            className="py-3 px-6 border-2 border-pink-300 dark:border-purple-400 text-gray-700 dark:text-gray-200 font-semibold rounded-full hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-all duration-300"
          >
            {t('hero.learnMore')}
          </Link>
        </div>
      </motion.div>
    </div>
  );

  const renderCreatures = () => (
    <div className="h-full flex flex-col justify-center overflow-y-auto py-4">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center items-center mb-4">
          <motion.div 
            className="w-10 h-10 mr-3"
            animate={{
              rotate: [0, 20, 0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FFC0CB"/>
              <circle cx="9" cy="9" r="1.5" fill="black"/>
              <circle cx="15" cy="9" r="1.5" fill="black"/>
              <path d="M8 14C8 14 10 16 12 16C14 16 16 14 16 14" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>
          
          <h2 className="text-3xl font-bold">
            {t('creatureShowcase.title')}
          </h2>
          
          <motion.div 
            className="w-10 h-10 ml-3"
            animate={{
              rotate: [0, -20, 0, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#C0FFEE"/>
              <circle cx="9" cy="9" r="1.5" fill="black"/>
              <circle cx="15" cy="9" r="1.5" fill="black"/>
              <path d="M8 13C8 13 10 17 12 17C14 17 16 13 16 13" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </div>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('creatureShowcase.subtitle')}
        </p>
        <div className="h-1 w-24 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-4"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 max-w-5xl mx-auto px-4">
        {creatures.map((creature, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-pink-100 dark:border-purple-800 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.2 }
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
            }}
          >
            <div className={`h-40 bg-gradient-to-r ${creature.color} p-4 flex items-center justify-center`}>
              <div className="w-32 h-32">
                <Lottie 
                  animationData={creature.animation} 
                  loop={true} 
                />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{creature.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{creature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderVision = () => (
    <div className="h-full flex flex-col justify-center overflow-y-auto py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="flex justify-center items-center">
          <motion.div 
            className="w-10 h-10 mr-3"
            animate={{
              rotate: 360,
              transition: { duration: 10, repeat: Infinity, ease: "linear" }
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FFD700"/>
              <path d="M12 7L15 12L12 17L9 12L12 7Z" fill="#FFA500"/>
            </svg>
          </motion.div>
          
          <h2 className="text-3xl font-bold">
            {t('vision.title')}
          </h2>
          
          <motion.div 
            className="w-10 h-10 ml-3"
            animate={{
              rotate: -360,
              transition: { duration: 10, repeat: Infinity, ease: "linear" }
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FFD700"/>
              <path d="M12 7L15 12L12 17L9 12L12 7Z" fill="#FFA500"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              className="flex items-start bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-2 border-purple-100 dark:border-purple-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                  {i}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t(`vision.point${i}.title`)}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t(`vision.point${i}.description`)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-20 blur-xl rounded-2xl"></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border-2 border-pink-100 dark:border-purple-800 p-6">
            <div className="w-full h-64">
              <Lottie 
                animationData={aiCommunication} 
                loop={true} 
              />
            </div>
            <div className="text-center mt-6">
              <h3 className="text-xl font-bold mb-2">{t('vision.highlight.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t('vision.highlight.description')}</p>
              <Link 
                href="/ai-magic" 
                className="inline-flex items-center py-2 px-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium rounded-full"
              >
                {t('vision.highlight.cta')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAIDemo = () => (
    <div className="h-full flex flex-col justify-center overflow-y-auto py-4">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center items-center mb-4">
          <motion.div 
            className="w-12 h-12 mr-3"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Lottie 
              animationData={robotAnimation} 
              loop={true} 
            />
          </motion.div>
          
          <h2 className="text-3xl font-bold">
            {t('aiDemo.title')}
          </h2>
          
          <motion.div 
            className="w-12 h-12 ml-3"
            animate={{
              y: [0, -10, 0],
              rotate: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          >
            <Lottie 
              animationData={cuteAgent} 
              loop={true} 
            />
          </motion.div>
        </div>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('aiDemo.subtitle')}
        </p>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border-2 border-pink-100 dark:border-purple-800 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-slate-700 dark:to-slate-800 p-2 rounded-t-xl">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
            <div className="text-sm font-medium">{t('aiDemo.windowTitle')}</div>
            <div className="w-16"></div> {/* 空白佔位，保持對稱 */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="order-2 md:order-1">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 space-y-4 border border-gray-100 dark:border-slate-700 shadow-inner">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8 6a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"></path>
                    </svg>
                  </div>
                  <div className="ml-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-3 text-sm">
                    <p>{t('aiDemo.conversation.greeting')}</p>
                  </div>
                </div>

                <div className="flex items-start justify-end">
                  <div className="mr-4 bg-gray-100 dark:bg-slate-700 rounded-2xl p-3 text-sm">
                    <p>{t('aiDemo.conversation.user1')}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8 6a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"></path>
                    </svg>
                  </div>
                  <div className="ml-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-3 text-sm">
                    <p>{t('aiDemo.conversation.ai1')}</p>
                  </div>
                </div>

                <div className="flex items-start justify-end">
                  <div className="mr-4 bg-gray-100 dark:bg-slate-700 rounded-2xl p-3 text-sm">
                    <p>{t('aiDemo.conversation.user2')}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8 6a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"></path>
                    </svg>
                  </div>
                  <div className="ml-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-3 text-sm">
                    <p>{t('aiDemo.conversation.ai2')}</p>
                  </div>
                </div>

                <div className="flex items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <input 
                    type="text" 
                    placeholder={t('aiDemo.inputPlaceholder')}
                    className="flex-grow bg-gray-100 dark:bg-slate-700 rounded-full py-2 px-4 text-sm focus:outline-none border border-gray-200 dark:border-slate-600" 
                    readOnly
                  />
                  <button className="ml-2 p-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center order-1 md:order-2">
              <motion.div 
                className="w-full h-56 sm:h-64"
                animate={{
                  scale: [1, 1.05, 1],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Lottie 
                  animationData={robotAnimation} 
                  loop={true} 
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderCta = () => (
    <div className="h-full flex flex-col justify-center items-center">
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <motion.div 
            className="w-24 h-24 mx-auto mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Lottie 
              animationData={cuteAgent} 
              loop={true} 
            />
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {t('cta.description')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/ai-magic"
            className="py-3 px-8 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
          >
            {t('cta.primaryButton')}
          </Link>
          <Link 
            href="/about"
            className="py-3 px-8 border-2 border-pink-300 dark:border-purple-400 text-gray-700 dark:text-gray-200 font-semibold rounded-full hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-all duration-300"
          >
            {t('cta.secondaryButton')}
          </Link>
        </div>
      </motion.div>
    </div>
  );

  // 童話書頁面
  const pages: PageContent[] = [
    {
      id: 0,
      title: "Hero",
      content: renderHero()
    },
    {
      id: 1,
      title: "Creatures",
      content: renderCreatures()
    },
    {
      id: 2,
      title: "Vision",
      content: renderVision()
    },
    {
      id: 3,
      title: "Demo",
      content: renderAIDemo()
    },
    {
      id: 4,
      title: "CTA",
      content: renderCta()
    }
  ];

  // 動畫完成後重設方向
  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  // 頁面變體
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  // 頁面過渡
  const pageTransition = {
    type: "tween",
    duration: 0.7,
    ease: "easeInOut"
  };

  return (
    <div className="min-h-screen pt-16">

      {/* 主要內容 */}
      <div className="relative z-10 min-h-screen pt-8 pb-12 px-4 sm:px-6 mx-auto">
        {/* 童話書外觀 - 增加最大寬度 */}
        <div className="w-full h-[calc(100vh-180px)] min-h-[500px] max-w-[1400px] mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[30px] border-[15px] border-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 shadow-[0_0_30px_rgba(248,113,255,0.2)] overflow-hidden relative">
          {/* 書頁裝飾 */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 角落裝飾 */}
            <div className="absolute top-4 left-4 w-16 h-16">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4C8 4 20 4 20 20" stroke="#FFB0D9" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 9C8 8 15 8 15 20" stroke="#FFB0D9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="absolute top-4 right-4 w-16 h-16">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4C16 4 4 4 4 20" stroke="#C5B0FF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 9C16 8 9 8 9 20" stroke="#C5B0FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="absolute bottom-4 left-4 w-16 h-16">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20C8 20 20 20 20 4" stroke="#FFB0D9" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 15C8 16 15 16 15 4" stroke="#FFB0D9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="absolute bottom-4 right-4 w-16 h-16">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 20C16 20 4 20 4 4" stroke="#C5B0FF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 15C16 16 9 16 9 4" stroke="#C5B0FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          
          {/* 童話書內容動畫 */}
          <AnimatePresence initial={false} custom={pageDirection} onExitComplete={handleAnimationComplete}>
            <motion.div
              key={currentPage}
              custom={pageDirection}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute inset-0 p-6 sm:p-10 lg:p-16"
            >
              {pages[currentPage].content}
            </motion.div>
          </AnimatePresence>

          {/* 翻頁按鈕 - 調整位置 */}
          <button 
            onClick={() => goToPage(currentPage - 1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center z-20 hover:bg-pink-50 dark:hover:bg-purple-900 transition-colors"
            disabled={isAnimating}
            aria-label="Previous page"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8 text-pink-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button 
            onClick={() => goToPage(currentPage + 1)}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center z-20 hover:bg-pink-50 dark:hover:bg-purple-900 transition-colors"
            disabled={isAnimating}
            aria-label="Next page"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8 text-pink-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* 書籤裝飾 */}
          <div className="absolute top-0 right-12 w-10 h-20 bg-gradient-to-b from-pink-400 to-purple-400 rounded-b-lg shadow-md"></div>
        </div>

        {/* 頁碼指示器 */}
        <div className="mt-6 flex justify-center items-center gap-3">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentPage === index 
                  ? "bg-pink-500 dark:bg-purple-400" 
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-pink-300 dark:hover:bg-purple-700"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}