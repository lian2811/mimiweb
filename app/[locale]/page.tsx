"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  // 動畫變體
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="min-h-screen">
        {/* 英雄區域 */}
        <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-32 pb-20 md:pt-16 md:pb-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-full max-w-7xl">
              <svg className="absolute right-0 top-0 opacity-10 dark:opacity-5" width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="400" cy="400" r="400" fill="url(#paint0_radial_1_2)" />
                <defs>
                  <radialGradient id="paint0_radial_1_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
                    <stop stopColor="#EC4899" />
                    <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
              <svg className="absolute left-0 bottom-0 opacity-10 dark:opacity-5" width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="400" cy="400" r="400" fill="url(#paint0_radial_1_3)" />
                <defs>
                  <radialGradient id="paint0_radial_1_3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#EC4899" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div 
                className="md:w-1/2"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <span className="inline-block bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-300 font-medium text-sm py-1 px-3 rounded-full mb-4">
                  ✨ {t('home.hero.title')}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">MiMi AI</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mt-2 block">
                    {t('home.hero.subtitle')}
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                  透過MiMi AI的前瞻性解決方案，體驗未來科技的無限可能，從數據分析到智能自動化，為您的業務提供全面AI支持。
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/${locale}/register`} className="px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg hover:from-pink-600 hover:to-violet-600 transition-colors duration-300 shadow-lg">
                    {t('home.hero.cta')}
                  </Link>
                  <Link href={`/${locale}/about`} className="px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                    {t('navigation.about')}
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative w-full h-80 lg:h-96">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur-xl opacity-20 dark:opacity-30 animate-pulse"></div>
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/50 dark:border-gray-800/50 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 shadow-2xl">
                    <div className="absolute top-0 w-full h-8 bg-gray-100/80 dark:bg-gray-800/80 flex items-center px-2">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="pt-10 p-4 h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 mr-3">
                            <span>AI</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 font-medium">MiMi 助手</div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3 shadow-sm max-w-[80%]">
                          您好！我是MiMi AI助手，有什麼我能幫您的嗎？
                        </div>
                        
                        <div className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 p-3 rounded-lg mb-3 shadow-sm max-w-[80%] self-end">
                          你好！請幫我分析一下最近的市場趨勢。
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3 shadow-sm">
                          <p className="mb-2">根據最新數據，市場呈現以下趨勢：</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>AI技術應用增長率達35%</li>
                            <li>數據分析服務需求上升28%</li>
                            <li>智能自動化解決方案市場擴大</li>
                            <li>企業數字轉型投資增加</li>
                          </ul>
                        </div>
                        
                        <div className="mt-auto flex">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-full flex items-center w-full p-1">
                            <input type="text" className="bg-transparent border-none outline-none flex-1 px-3 py-1 text-sm" placeholder="輸入您的問題..." />
                            <button className="bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-full w-7 h-7 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 特色區塊 */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                {t('home.features.title')}
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto"></div>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* 特色1 */}
              <motion.div 
                className="bg-gradient-to-br from-pink-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 shadow-xl"
                variants={fadeIn}
              >
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-2xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t('home.features.feature1.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('home.features.feature1.description')}
                </p>
              </motion.div>

              {/* 特色2 */}
              <motion.div 
                className="bg-gradient-to-br from-pink-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 shadow-xl"
                variants={fadeIn}
              >
                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-2xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t('home.features.feature2.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('home.features.feature2.description')}
                </p>
              </motion.div>

              {/* 特色3 */}
              <motion.div 
                className="bg-gradient-to-br from-pink-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 shadow-xl"
                variants={fadeIn}
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t('home.features.feature3.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('home.features.feature3.description')}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 訂閱計劃 */}
        <section className="py-20 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                {t('subscription.plans')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                選擇適合您需求的計劃，開始使用 MiMi AI 提升您的業務效率
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto mt-6"></div>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* 基本方案 */}
              <motion.div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden"
                variants={fadeIn}
              >
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('subscription.basic.title')}
                  </h3>
                  <div className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    {t('subscription.basic.price')}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {t.raw('subscription.basic.features').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-500 to-violet-500">
                  <Link href={`/${locale}/subscription`} className="block w-full py-2 px-4 bg-white dark:bg-slate-900 text-center font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    {t('subscription.subscribe')}
                  </Link>
                </div>
              </motion.div>

              {/* 專業方案 */}
              <motion.div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden scale-105 relative z-10"
                variants={fadeIn}
              >
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-center py-1 text-sm font-medium">
                  最受歡迎
                </div>
                <div className="p-8 pt-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('subscription.pro.title')}
                  </h3>
                  <div className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    {t('subscription.pro.price')}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {t.raw('subscription.pro.features').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-500 to-violet-500">
                  <Link href={`/${locale}/subscription`} className="block w-full py-2 px-4 bg-white dark:bg-slate-900 text-center font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    {t('subscription.subscribe')}
                  </Link>
                </div>
              </motion.div>

              {/* 企業方案 */}
              <motion.div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden"
                variants={fadeIn}
              >
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('subscription.enterprise.title')}
                  </h3>
                  <div className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    {t('subscription.enterprise.price')}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {t.raw('subscription.enterprise.features').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-500 to-violet-500">
                  <Link href={`/${locale}/ai-magic`} className="block w-full py-2 px-4 bg-white dark:bg-slate-900 text-center font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    {t('subscription.contact')}
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 行動召喚 */}
        <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute right-0 top-0" width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="200" fill="url(#paint0_radial_1_4)" />
              <defs>
                <radialGradient id="paint0_radial_1_4" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 200) rotate(90) scale(200)">
                  <stop stopColor="#EC4899" />
                  <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="bg-gradient-to-br from-pink-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-12 shadow-xl text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                準備好體驗未來的 AI 了嗎？
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                立即註冊 MiMi AI，開啟智能化體驗之旅，讓我們為您的業務帶來革命性的改變。
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href={`/${locale}/register`}
                  className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg hover:from-pink-600 hover:to-violet-600 transition-colors duration-300 shadow-lg"
                >
                  {t('navigation.register')}
                </Link>
                <Link 
                  href={`/${locale}/ai-magic`}
                  className="px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  {t('navigation.AI Showcase')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}