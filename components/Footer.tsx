"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <Link href={`/${locale}`} className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                MiMi AI
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              提供前瞻性人工智能解決方案，幫助您的業務在數字時代蓬勃發展。
            </p>
            <div className="mt-4 flex space-x-3">
              <a href="#" aria-label="Facebook" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              快速連結
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link href={`/${locale}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                {t('navigation.home')}
              </Link>
              <Link href={`/${locale}/about`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                {t('navigation.about')}
              </Link>
              <Link href={`/${locale}/subscription`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                {t('navigation.pricing')}
              </Link>
              <Link href={`/${locale}/ai-magic`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                {t('navigation.AI Showcase')}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              法律條款
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link href={`/${locale}/privacy`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                {t('footer.privacy')}
              </Link>
              <Link href={`/${locale}/terms`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                {t('footer.terms')}
              </Link>
              <Link href={`/${locale}/cookies`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Cookie 政策
              </Link>
              <Link href={`/${locale}/security`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                安全性政策
              </Link>
            </nav>
          </div>

          {/* 產品展示 */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              產品展示
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">support@mimiai.example.com</span>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">+886 2 1234 5678</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">台北市信義區信義路五段7號</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} MiMi AI. {t('footer.rights')}
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-4">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                隱私政策
              </a>
              <span className="hidden md:inline text-gray-600 dark:text-gray-400">•</span>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                服務條款
              </a>
              <span className="hidden md:inline text-gray-600 dark:text-gray-400">•</span>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Cookie 政策
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}