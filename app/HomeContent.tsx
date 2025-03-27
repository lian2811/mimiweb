// Server component for Home page (no "use client" directive)
import { useTranslations } from "next-intl";
import Link from 'next/link';
import { motion, Variants } from "framer-motion";

// Define the props interface
interface HomeContentProps {
  locale: string;
  fadeIn: Variants; // Using framer-motion's Variants type instead of any
  staggerContainer: Variants; // Using framer-motion's Variants type instead of any
}

export default function HomeContent({
  locale,
  fadeIn,
  staggerContainer
}: HomeContentProps) {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen pt-24">
      <div className="min-h-screen">
        {/* 英雄區域 */}
        <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-32 pb-20 md:pt-16 md:pb-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-full max-w-7xl">
              {/* 背景裝飾 */}
              <div className="absolute top-1/3 right-10 w-72 h-72 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center lg:space-x-10">
              <motion.div 
                className="lg:w-1/2 mb-10 lg:mb-0"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  {t('hero.title1')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">{t('hero.titleHighlight')}</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href={`/ai-magic`}
                    className="py-3 px-6 text-center bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {t('hero.primaryCta')}
                  </Link>
                  <Link 
                    href={`/about`}
                    className="py-3 px-6 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
                  >
                    {t('hero.secondaryCta')}
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 opacity-20 blur-lg rounded-2xl"></div>
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">MiMi AI Assistant</div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start justify-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0"></div>
                          <div className="ml-4 bg-gradient-to-r from-pink-500/10 to-violet-500/10 rounded-lg p-3 text-sm max-w-sm">
                            <p>{t('hero.chatExample.greeting')}</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-end">
                          <div className="mr-4 bg-gray-100 dark:bg-slate-700 rounded-lg p-3 text-sm max-w-sm">
                            <p>{t('hero.chatExample.user')}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                        </div>
                        <div className="flex items-start justify-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0"></div>
                          <div className="ml-4 bg-gradient-to-r from-pink-500/10 to-violet-500/10 rounded-lg p-3 text-sm max-w-sm">
                            <p>{t('hero.chatExample.ai')}</p>
                          </div>
                        </div>
                        <div className="flex items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                          <input 
                            type="text" 
                            placeholder={t('hero.chatExample.placeholder')}
                            className="flex-grow bg-gray-100 dark:bg-slate-700 rounded-lg py-2 px-4 text-sm focus:outline-none" 
                            readOnly
                          />
                          <button className="ml-2 p-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-20 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">{t('hero.trustedBy')}</p>
                <div className="flex flex-wrap justify-center gap-8 opacity-70">
                  {/* 示例品牌標誌 - 可以替換為實際品牌 */}
                  <div className="h-8 w-auto grayscale dark:brightness-200">
                    <svg className="h-full" viewBox="0 0 124 34" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.996 34h16.242l-4.014-6.982H7.982L11.996 34Zm9.04-15.767L16.55 9.228l-4.486 9.005h8.972Zm6.144 12.311 8.972-17.977h-5.868l-6.495 13.012h-15.55L1.744 12.567H-4.65e-06l8.972 17.977h18.208Z" />
                    </svg>
                  </div>
                  <div className="h-8 w-auto grayscale dark:brightness-200">
                    <svg className="h-full" width="98" height="28" viewBox="0 0 98 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.967 26.453c-.182 1.542.977 2.936 2.585 3.115 1.608.18 3.053-.916 3.235-2.458.182-1.541-.977-2.935-2.585-3.114-1.608-.183-3.053.915-3.235 2.457ZM16.596 9.98c0 .836-.635 1.512-1.497 1.585-.863.073-1.614-.489-1.678-1.25-.064-.762.566-1.442 1.406-1.524.84-.08 1.566.36 1.725 1.027.03.053.044.108.044.162ZM7.398 26.453c-.182 1.542.977 2.936 2.585 3.115 1.608.18 3.053-.916 3.235-2.458.182-1.541-.977-2.935-2.585-3.114-1.608-.183-3.053.915-3.235 2.457Z" />
                    </svg>
                  </div>
                  <div className="h-7 w-auto grayscale dark:brightness-200">
                    <svg className="h-full" width="129" height="28" viewBox="0 0 129 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M46.15 9.346c-3.348 0-6.058 2.707-6.058 6.058 0 3.35 2.71 6.058 6.058 6.058s6.058-2.708 6.058-6.058c0-3.35-2.71-6.058-6.058-6.058Zm0 9.999c-2.17 0-3.942-1.768-3.942-3.94 0-2.174 1.767-3.942 3.941-3.942 2.175 0 3.942 1.768 3.942 3.941 0 2.173-1.772 3.941-3.942 3.941Z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 特點展示區域 */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('features.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t('features.subtitle')}
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto mt-8"></div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Feature 1 */}
              <motion.div 
                className="bg-gray-50 dark:bg-slate-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-slate-700"
                variants={fadeIn}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400/30 to-violet-400/30 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.feature1.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t('features.feature1.description')}</p>
                <Link href={`/${locale}/ai-magic`} className="text-pink-500 font-medium inline-flex items-center">
                  {t('features.learnMore')}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                className="bg-gray-50 dark:bg-slate-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-slate-700"
                variants={fadeIn}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.feature2.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t('features.feature2.description')}</p>
                <Link href={`/${locale}/ai-magic`} className="text-blue-500 font-medium inline-flex items-center">
                  {t('features.learnMore')}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                className="bg-gray-50 dark:bg-slate-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-slate-700"
                variants={fadeIn}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-violet-400/30 to-purple-400/30 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.feature3.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t('features.feature3.description')}</p>
                <Link href={`/${locale}/ai-magic`} className="text-violet-500 font-medium inline-flex items-center">
                  {t('features.learnMore')}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA 區域 */}
        <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-16">
                  <h2 className="text-3xl font-bold mb-6">{t('cta.title')}</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    {t('cta.description')}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <Link 
                      href={`/subscription`}
                      className="py-3 px-6 bg-gradient-to-r from-pink-500 to-violet-500 text-center text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {t('cta.primaryButton')}
                    </Link>
                    <Link 
                      href={`/about`}
                      className="py-3 px-6 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300"
                    >
                      {t('cta.secondaryButton')}
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-violet-500 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white p-8 z-10 text-center">
                      <h3 className="text-2xl font-bold mb-4">{t('cta.highlightTitle')}</h3>
                      <p className="text-lg opacity-90 mb-6">{t('cta.highlightText')}</p>
                      <div className="font-bold text-3xl">{t('cta.discount')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}