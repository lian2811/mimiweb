"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { signIn } from "next-auth/react";

// Define login form data type
interface LoginFormData {
  email: string;
  password: string;
}

// Define the props interface
interface LoginContentProps {
  isLoading: boolean;
  error: string | null;
  register: UseFormRegister<LoginFormData>;
  handleSubmit: UseFormHandleSubmit<LoginFormData>;
  onSubmit: (data: LoginFormData) => Promise<void>;
  errors: FieldErrors<LoginFormData>;
}

export default function LoginContent({
  isLoading,
  error,
  register,
  handleSubmit,
  onSubmit,
  errors
}: LoginContentProps) {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md mx-auto px-4 sm:px-6 pt-20">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="p-8">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                {t('login.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('login.subtitle')}
              </p>
            </motion.div>

            {error && (
              <motion.div 
                className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('login.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                  placeholder={t('login.emailPlaceholder')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{t('login.emailError')}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('login.passwordLabel')}
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                  placeholder={t('login.passwordPlaceholder')}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{t('login.passwordError')}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    {t('login.rememberMe')}
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="#" className="font-medium text-pink-600 hover:text-pink-500">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 relative"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('login.loggingIn')}
                    </>
                  ) : (
                    t('login.loginButton')
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                    {t('login.orContinueWith')}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <FaGoogle className="h-5 w-5 text-red-500" />
                  <span className="sr-only">Sign in with Google</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => signIn('github', { callbackUrl: '/' })}
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <FaGithub className="h-5 w-5 text-gray-800 dark:text-white" />
                  <span className="sr-only">Sign in with GitHub</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('login.noAccount')}{' '}
                <Link href="/register" className="font-medium text-pink-600 hover:text-pink-500">
                  {t('login.registerLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}