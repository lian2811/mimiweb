"use client"

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from 'react-icons/fa';

// 定義表單驗證架構
const registerSchema = z.object({
  name: z.string().min(2, { message: "名稱至少需要2個字符" }),
  email: z.string().email({ message: "請輸入有效的電子郵件地址" }),
  password: z.string().min(6, { message: "密碼至少需要6個字符" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "密碼不匹配",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // 模擬註冊 API 呼叫
      // 在真實環境中，這裡應該是向後端 API 發送請求來創建用戶
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '註冊失敗');
      }
      
      // 註冊成功後，自動登入用戶
      const loginResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (loginResult?.error) {
        console.error('自動登入失敗:', loginResult.error);
        // 註冊成功但登入失敗，導向登入頁面
        router.push('/login');
        return;
      }
      
      // 註冊並登入成功，導向首頁
      router.push('/');
      router.refresh(); // 重新整理頁面以更新狀態
    } catch (err: any) {
      setError(err.message || "註冊失敗。請稍後再試。");
      console.error("註冊錯誤:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 處理社交登入
  const handleSocialSignIn = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="min-h-screen pt-20">
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
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-8 pt-14 text-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-1">
                {t('auth.register')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('auth.haveAccount')} <Link href={`/login`} className="text-pink-500 hover:underline">{t('auth.signIn')}</Link>
              </p>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-2 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="text-left">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    名稱
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
                    placeholder="您的名稱"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>
                  )}
                </div>
                
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
                    <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="text-left">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('auth.password')}
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-red-500 text-xs">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="text-left">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('auth.confirmPassword')}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${errors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-red-500 text-xs">{errors.confirmPassword.message}</p>
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
                  {isLoading ? t('common.loading') : t('auth.signUp')}
                </button>
              </form>
              
              <div className="mt-8 flex items-center justify-center">
                <hr className="flex-grow border-gray-200 dark:border-gray-700" />
                <span className="px-4 text-sm text-gray-500 dark:text-gray-400">或使用</span>
                <hr className="flex-grow border-gray-200 dark:border-gray-700" />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSocialSignIn('github')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300"
                  disabled={isLoading}
                >
                  <FaGithub className="w-5 h-5 mr-2" />
                  <span>GitHub</span>
                </button>
                <button 
                  onClick={() => handleSocialSignIn('google')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300"
                  disabled={isLoading}
                >
                  <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
                  <span>Google</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}