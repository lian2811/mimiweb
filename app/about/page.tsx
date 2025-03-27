"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function About() {
  const t = useTranslations();

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
      {/* 頁面標題 */}
      <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-full max-w-7xl">
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
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
              {t('about.title')}
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* 我們的使命 */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                {t('about.mission')}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {t('about.missionText')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                在 MiMi AI，我們致力於開發前沿的人工智能解決方案，幫助企業優化流程、增強決策能力並提高客戶滿意度。我們相信，透過將尖端技術與人性化體驗相結合，我們可以為企業和個人創造真正的價值。
              </p>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 opacity-20 blur-lg"></div>
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-violet-500 p-1">
                    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl p-8">
                      <div className="relative w-full h-48 md:h-64">
                        <svg className="w-full h-full text-pink-500 dark:text-pink-400" viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M140.5 40C121.7 30 115.5 13.2 100 13.2 84.5 13.2 78.3 30 59.5 40 40.7 50 24.5 49 20 62c-4.5 13 4.2 30 10 48 5.8 18 8.8 36.8 23 43 14.2 6.2 33.8-3.3 47-3.3 13.2 0 32.8 9.5 47 3.3 14.2-6.2 17.2-25 23-43 5.8-18 14.5-35 10-48-4.5-13-20.7-12-39.5-22Z" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M65 94c3.3 0 8-3.4 8-9s-4.7-9-8-9c-3.4 0-8 3.4-8 9s4.6 9 8 9Z" />
                          <path d="M134 94c3.3 0 8-3.4 8-9s-4.7-9-8-9c-3.4 0-8 3.4-8 9s4.6 9 8 9Z" />
                          <path d="M100 121.8c6.9 0 16-4.7 16-13s-9.1-13-16-13c-6.9 0-16 4.7-16 13s9.1 13 16 13Z" />
                          <path d="M160.1 70.2c-3.8-10.4-17.2-15.7-33.4-13.5" strokeWidth="12" strokeLinecap="round" />
                          <path d="M39.9 70.2c3.8-10.4 17.2-15.7 33.4-13.5" strokeWidth="12" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 我們的願景 */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-400 to-violet-500 p-1">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                    <div className="p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      <h3 className="text-lg font-bold mt-4">全球影響力</h3>
                    </div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-violet-500 p-1 translate-y-4">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                    <div className="p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <h3 className="text-lg font-bold mt-4">用戶中心</h3>
                    </div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 p-1 -translate-y-4">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                    <div className="p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                      <h3 className="text-lg font-bold mt-4">創新技術</h3>
                    </div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-400 to-pink-500 p-1">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                    <div className="p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                      <h3 className="text-lg font-bold mt-4">驅動成長</h3>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                {t('about.vision')}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {t('about.visionText')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                我們的願景是創建一個世界，在這個世界中，先進的人工智能技術可以被每個企業和個人所利用，無論其規模或背景如何。我們努力打破技術障礙，使強大的 AI 工具變得直觀、友善且易於使用，讓更多人能夠享受到技術進步帶來的好處。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 我們的團隊 */}
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
              {t('about.team')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              我們由一群充滿熱情的人工智能專家、工程師和設計師組成，致力於打造最好的 AI 體驗。
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto mt-6"></div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* 團隊成員 1 */}
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeIn}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-pink-400 to-violet-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">陳明智</h3>
              <p className="text-pink-500 dark:text-pink-400 font-medium">共同創辦人 & CEO</p>
              <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                擁有15年科技產業經驗，專注於人工智能和機器學習的創新應用。
              </p>
            </motion.div>

            {/* 團隊成員 2 */}
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeIn}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-violet-400 to-blue-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">林美玲</h3>
              <p className="text-violet-500 dark:text-violet-400 font-medium">共同創辦人 & CTO</p>
              <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                AI 研究專家，曾在頂尖科技公司領導機器學習團隊。
              </p>
            </motion.div>

            {/* 團隊成員 3 */}
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeIn}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-blue-400 to-green-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">王俊傑</h3>
              <p className="text-blue-500 dark:text-blue-400 font-medium">產品總監</p>
              <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                專注於打造直觀且易於使用的 AI 產品體驗。
              </p>
            </motion.div>

            {/* 團隊成員 4 */}
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeIn}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-green-400 to-yellow-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex itemsCenter justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">張雅婷</h3>
              <p className="text-green-500 dark:text-green-400 font-medium">設計總監</p>
              <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                熱衷於創造美觀且功能性強大的用戶界面和體驗。
              </p>
            </motion.div>
          </motion.div>
                  {/* 联系方式 */}
                  <motion.div 
                    className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4, staggerChildren: 0.1 }}
                  >
                    <ContactCard 
                      title="聯絡信箱"
                      icon="✉️"
                      content="support@mimiai.example.com"
                    />
                    <ContactCard 
                      title="社群媒體"
                      icon="📱"
                      content="@MimiAI"
                    />
                    <ContactCard 
                      title="服務時間"
                      icon="🕒"
                      content="每天 24 小時"
                    />
                  </motion.div>
          
        </div>
      </section>
    </div>
  );
}

// 联系卡片组件
const ContactCard = ({ title, icon, content }: { title: string, icon: string, content: string }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700"
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0abab5]/20 to-[#FFB7C5]/20 flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{content}</p>
    </motion.div>
  );
};