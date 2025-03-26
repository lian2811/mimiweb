"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function SubscriptionPage() {
  const t = useTranslations();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  
  // 訂閱方案資料
  const plans = [
    {
      id: "basic",
      title: t("subscription.basic.title"),
      monthlyPrice: "NT$350",
      annualPrice: "NT$3,500",
      features: t("subscription.basic.features").split("\n"),
      popular: false,
      ctaText: t("subscription.subscribe"),
      ctaColor: "bg-gray-600 hover:bg-gray-700",
      borderColor: "border-gray-200 dark:border-gray-800",
      shadow: "shadow-sm"
    },
    {
      id: "pro",
      title: t("subscription.pro.title"),
      monthlyPrice: "NT$950",
      annualPrice: "NT$9,500",
      features: t("subscription.pro.features").split("\n"),
      popular: true,
      ctaText: t("subscription.subscribe"),
      ctaColor: "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600",
      borderColor: "border-pink-500",
      shadow: "shadow-lg"
    },
    {
      id: "enterprise",
      title: t("subscription.enterprise.title"),
      monthlyPrice: t("subscription.enterprise.price"),
      annualPrice: t("subscription.enterprise.price"),
      features: t("subscription.enterprise.features").split("\n"),
      popular: false,
      ctaText: t("subscription.contact"),
      ctaColor: "bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600",
      borderColor: "border-gray-200 dark:border-gray-800",
      shadow: "shadow-sm"
    }
  ];

  // 切換月付/年付的處理函數
  const toggleBillingPeriod = () => {
    setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly");
  };

  // 滑塊的動畫變體
  const sliderVariants = {
    monthly: { x: 0 },
    annual: { x: "100%" }
  };

  // 價格標籤的動畫變體
  const priceVariants = {
    active: { opacity: 1, y: 0 },
    inactive: { opacity: 0, y: 10 }
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="py-10 min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-20">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] sm:text-5xl md:text-6xl">
              {t("subscription.title")}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              選擇最適合您需求的 MiMi AI 方案，享受先進 AI 助理的全部功能。
            </p>
            
            {/* 月付/年付切換 */}
            <div className="mt-12 relative inline-block">
              <div className="flex items-center justify-center space-x-4">
                <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                  月付方案
                </span>
                
                {/* 切換按鈕 */}
                <button 
                  onClick={toggleBillingPeriod}
                  className="relative inline-flex h-8 w-16 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
                  aria-pressed={billingPeriod === "annual"}
                  aria-labelledby="billing-period-label"
                >
                  <span className="sr-only">切換帳單週期</span>
                  <motion.span 
                    className="inline-block h-6 w-6 transform rounded-full bg-white dark:bg-violet-500 shadow-md m-1"
                    variants={sliderVariants}
                    animate={billingPeriod}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
                
                <span className={`text-sm font-medium ${billingPeriod === "annual" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                  年付方案
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    省 20%
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* 訂閱方案卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-2xl border ${plan.borderColor} ${plan.shadow} overflow-hidden bg-white dark:bg-slate-900 transition-all hover:scale-105 duration-300`}
              >
                {/* 熱門標籤 */}
                {plan.popular && (
                  <div className="absolute top-0 w-full text-center py-1.5 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm font-semibold">
                    最受歡迎
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? "pt-12" : ""}`}>
                  {/* 方案標題 */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.title}</h3>
                  
                  {/* 方案價格 */}
                  <div className="mt-6 h-20 relative">
                    <motion.div
                      className="absolute w-full"
                      variants={priceVariants}
                      animate={billingPeriod === "monthly" ? "active" : "inactive"}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-baseline">
                        <span className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                          {plan.monthlyPrice}
                        </span>
                        <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                          / 月
                        </span>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute w-full"
                      variants={priceVariants}
                      animate={billingPeriod === "annual" ? "active" : "inactive"}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-baseline">
                        <span className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                          {plan.annualPrice}
                        </span>
                        <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                          / 年
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* 功能列表 */}
                  <ul className="mt-10 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 行動按鈕 */}
                  <div className="mt-12">
                    <a
                      href="#"
                      className={`block w-full text-center py-3 px-6 rounded-md shadow text-white font-medium ${plan.ctaColor} transition-colors`}
                    >
                      {plan.ctaText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ 部分 */}
          <div className="mt-32 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
              常見問題
            </h2>
            
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  我可以隨時更改訂閱方案嗎？
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  是的，您可以隨時升級或降級您的訂閱計劃。升級會立即生效，降級將在當前結算週期結束後生效。
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  如果我不滿意服務，可以退款嗎？
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  我們提供 14 天的退款保證。如果您在購買後 14 天內對服務不滿意，可以聯繫我們的客戶支持團隊申請全額退款。
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  企業方案有哪些客製化選項？
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  我們的企業方案可以根據您公司的具體需求進行客製化。這包括專屬模型訓練、API 集成、更高級的安全性設置和專屬支援等。請聯繫我們的銷售團隊了解更多詳情。
                </p>
              </div>
            </div>
          </div>

          {/* 行動呼籲 */}
          <div className="mt-24 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              還有其他問題？請聯繫我們的客戶支持團隊
            </p>
            <a 
              href="#" 
              className="mt-3 inline-block text-pink-500 dark:text-pink-400 font-medium hover:underline"
            >
              support@mimiai.example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}