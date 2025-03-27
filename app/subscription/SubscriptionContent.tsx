// Server component for subscription page (no "use client" directive)
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { CheckIcon } from "lucide-react";

// Define the props interface
interface SubscriptionContentProps {
  locale: string;
  billingPeriod: 'monthly' | 'annual';
  setBillingPeriod: (period: 'monthly' | 'annual') => void;
  fadeIn: Variants; // Using framer-motion's Variants type instead of any
  staggerContainer: Variants; // Using framer-motion's Variants type instead of any
}

export default function SubscriptionContent({
  billingPeriod,
  setBillingPeriod,
  fadeIn,
  staggerContainer
}: SubscriptionContentProps) {
  const t = useTranslations('subscription');

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 py-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 切換按鈕 */}
        <motion.div 
          className="flex justify-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gray-100 dark:bg-slate-700 p-1 rounded-lg flex">
            <button
              className={`py-2 px-6 rounded-md text-sm font-medium ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              } transition-all duration-200`}
              onClick={() => setBillingPeriod('monthly')}
            >
              {t('monthly')}
            </button>
            <button
              className={`py-2 px-6 rounded-md text-sm font-medium ${
                billingPeriod === 'annual'
                  ? 'bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              } transition-all duration-200`}
              onClick={() => setBillingPeriod('annual')}
            >
              <div className="flex items-center">
                {t('annually')}
                <span className="ml-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs py-0.5 px-2 rounded-full">
                  {t('savePercent')}
                </span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* 價格卡片 */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Free Plan */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden"
            variants={fadeIn}
          >
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('plans.free.name')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 h-12">{t('plans.free.description')}</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {t('plans.free.price')}
                </span>
              </p>
              <Link 
                href="/register"
                className="mt-6 block w-full py-3 px-4 rounded-lg text-center font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('plans.free.cta')}
              </Link>
            </div>
            <div className="px-8 pb-8">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('includes')}</p>
              <ul className="space-y-4">
                {[
                  'plans.free.features.feature1',
                  'plans.free.features.feature2',
                  'plans.free.features.feature3',
                  'plans.free.features.feature4',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {t(feature)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Pro Plan */}
          <motion.div 
            className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 rounded-2xl shadow-xl border border-pink-500/20 dark:border-violet-500/20 overflow-hidden relative z-10 transform md:scale-105"
            variants={fadeIn}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              {t('popular')}
            </div>
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('plans.pro.name')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 h-12">{t('plans.pro.description')}</p>
              <p className="mt-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  {billingPeriod === 'monthly' 
                    ? t('plans.pro.priceMonthly')
                    : t('plans.pro.priceAnnual')}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {billingPeriod === 'monthly' 
                    ? t('perMonth')
                    : t('perMonthAnnual')}
                </span>
              </p>
              <Link 
                href="/register"
                className="mt-6 block w-full py-3 px-4 rounded-lg text-center font-medium bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600 transition-colors"
              >
                {t('plans.pro.cta')}
              </Link>
            </div>
            <div className="px-8 pb-8">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('includes')}</p>
              <ul className="space-y-4">
                {[
                  'plans.pro.features.feature1',
                  'plans.pro.features.feature2',
                  'plans.pro.features.feature3',
                  'plans.pro.features.feature4',
                  'plans.pro.features.feature5',
                  'plans.pro.features.feature6',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {t(feature)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Enterprise Plan */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden"
            variants={fadeIn}
          >
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('plans.enterprise.name')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 h-12">{t('plans.enterprise.description')}</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {t('plans.enterprise.price')}
                </span>
              </p>
              <Link 
                href="/contact"
                className="mt-6 block w-full py-3 px-4 rounded-lg text-center font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('plans.enterprise.cta')}
              </Link>
            </div>
            <div className="px-8 pb-8">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('includes')}</p>
              <ul className="space-y-4">
                {[
                  'plans.enterprise.features.feature1',
                  'plans.enterprise.features.feature2',
                  'plans.enterprise.features.feature3',
                  'plans.enterprise.features.feature4',
                  'plans.enterprise.features.feature5',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {t(feature)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* FAQ 區域 */}
        <motion.div 
          className="mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('faq.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  {t(`faq.q${i}`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t(`faq.a${i}`)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}