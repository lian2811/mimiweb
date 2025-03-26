"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 定義表單驗證架構
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // 在這裡添加真實的登入邏輯
      console.log("登入資料:", data);
      
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 假設登入成功，重定向到首頁
      router.push(`/${locale}`);
    } catch (err) {
      setError("登入失敗。請檢查您的電子郵件和密碼。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="relative h-20 bg-gradient-to-r from-pink-500 to-violet-500">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 rounded-full p-1.5 shadow-lg">
              <div className="bg-gradient-to-r from-pink-500 to-violet-500 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-8 pt-14 text-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-1">
              {t('auth.login')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('auth.noAccount')} <Link href={`/${locale}/register`} className="text-pink-500 hover:underline">{t('auth.signUp')}</Link>
            </p>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-2 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-xs">{errors.email.message || "有效的電子郵件地址是必需的"}</p>
                )}
              </div>
              
              <div className="text-left">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.password')}
                  </label>
                  <Link href={`/${locale}/forgot-password`} className="text-xs text-pink-500 hover:underline">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-red-500 text-xs">{errors.password.message || "密碼至少需要6個字符"}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? t('common.loading') : t('auth.signIn')}
              </button>
            </form>
            
            <div className="mt-8 flex items-center justify-center">
              <hr className="flex-grow border-gray-200 dark:border-gray-700" />
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400">或使用</span>
              <hr className="flex-grow border-gray-200 dark:border-gray-700" />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.84 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.338-3.369-1.338-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.934.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>GitHub</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M23.5 12.5c0-.86-.07-1.7-.22-2.5h-11v5h6.25a5.35 5.35 0 01-2.33 3.58v2.97h3.77a11.46 11.46 0 003.53-9.05zm0 0"/>
                  <path fill="currentColor" d="M12.25 24c3.15 0 5.79-1.04 7.72-2.83l-3.77-2.97a7.16 7.16 0 01-3.95 1.1 7.16 7.16 0 01-6.74-5H1.6v3.06A12.25 12.25 0 0012.25 24zm0 0"/>
                  <path fill="currentColor" d="M5.53 14.3a7.25 7.25 0 010-4.6V6.64H1.6a12.3 12.3 0 000 10.72L5.53 14.3zm0 0"/>
                  <path fill="currentColor" d="M12.25 4.8a6.59 6.59 0 014.67 1.83l3.36-3.36a11.7 11.7 0 00-8.03-3.12A12.25 12.25 0 001.6 6.64l3.93 3.06a7.16 7.16 0 016.72-4.9zm0 0"/>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}