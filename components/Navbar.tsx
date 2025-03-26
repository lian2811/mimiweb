"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Globe } from "lucide-react";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
 
  // 獲取當前語言
  const locale = pathname.split('/')[1];
  const alternateLocale = locale === 'en' ? 'zh' : 'en';

  // 替換路徑中的語言部分
  const switchLocale = (path: string, newLocale: string) => {
    const pathSegments = path.split('/');
    if (pathSegments.length > 1) {
      pathSegments[1] = newLocale;
    }
    return pathSegments.join('/');
  };

  // 檢測頁面滾動以改變導航欄樣式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? "bg-gray-900/50 backdrop-blur-sm py-2" 
          : "bg-gradient-to-r from-gray-900/90 to-[var(--primary)]/30 backdrop-blur-md shadow-md py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Image */}
          <Link href={`/${locale}`} className="flex items-center">
            <img
              src="/mimi_ai_round.png" // 使用 public 資料夾中的圖像
              alt="Logo"
              className={`w-10 h-10 rounded-full transition-opacity duration-300 ${
                isScrolled ? "opacity-70" : "opacity-100"
              }`}
            />
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              MiMi AI
            </span>
            <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full">
              Beta
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href={`/${locale}`} className={`text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] ${
              pathname === `/${locale}` 
                ? "" 
                : "hover:opacity-80"
            } transition-colors`}> {/* 改為漸變文字 */}
              {t('navigation.home')}
            </Link>
            <Link href={`/${locale}/about`} className={`text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] ${
              pathname === `/${locale}/about` 
                ? "" 
                : "hover:opacity-80"
            } transition-colors`}> {/* 改為漸變文字 */}
              {t('navigation.about')}
            </Link>
            <Link href={`/${locale}/subscription`} className={`text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] ${
              pathname === `/${locale}/subscription` 
                ? "" 
                : "hover:opacity-80"
            } transition-colors`}> {/* 改為漸變文字 */}
              {t('navigation.pricing')}
            </Link>
            <Link href={`/${locale}/ai-magic`} className={`text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] ${
              pathname === `/${locale}/ai-magic` 
                ? "" 
                : "hover:opacity-80"
            } transition-colors`}> {/* 改為漸變文字 */}
              {t('navigation.AI Showcase')}
            </Link>

            {/* Language Toggle */}
            <Link 
              href={switchLocale(pathname, alternateLocale)}
              className={`flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg ${
                isScrolled 
                  ? "bg-white/20 text-pink-400 hover:bg-white/30" 
                  : "bg-[var(--primary)]/20 text-pink-400 hover:bg-[var(--primary)]/30"
              } transition-colors`}
            >
              <Globe size={16} />
              <span className="text-sm font-semibold">{t('common.languageSwitch')}</span>
            </Link>

            {/* Login/Register Buttons */}
            <div className="flex items-center space-x-2">
              <Link 
                href={`/${locale}/login`} 
                className={`px-3 py-1.5 text-base font-semibold rounded-lg ${
                  isScrolled 
                    ? "text-pink-500 hover:bg-white/20" 
                    : "text-pink-400 hover:bg-gray-100"
                } transition-colors`}
              >
                {t('navigation.login')}
              </Link>
              <Link 
                href={`/${locale}/register`} 
                className="px-3 py-1.5 text-base font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg hover:from-pink-600 hover:to-violet-600 transition-colors"
              >
                {t('navigation.register')}
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                isScrolled ? "text-pink-500 hover:bg-white/20" : "text-pink-400 hover:bg-gray-100"
              } transition-colors`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <Link 
              href={`/${locale}`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href={`/${locale}/about`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.about')}
            </Link>
            <Link 
              href={`/${locale}/subscription`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.pricing')}
            </Link>
            <Link 
              href={`/${locale}/ai-magic`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.AI Showcase')}
            </Link>

            <div className="flex items-center justify-between pt-2 pb-1 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {/* Mobile Language Toggle */}
                <Link 
                  href={switchLocale(pathname, alternateLocale)} 
                  className="flex items-center space-x-1 p-2 rounded-lg bg-gray-200 text-gray-700"
                >
                  <Globe size={18} />
                  <span className="text-xs font-medium">{t('common.languageSwitch')}</span>
                </Link>
              </div>

              <div>
                <Link 
                  href={`/${locale}/login`} 
                  className="inline-block px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.login')}
                </Link>
                <Link 
                  href={`/${locale}/register`} 
                  className="inline-block ml-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg hover:from-pink-600 hover:to-violet-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.register')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}