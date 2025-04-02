"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Menu, X, Globe, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";

// Define props interface
interface NavbarContentProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isScrolled: boolean;
  locale: string;
  alternateLocale: string;
  switchLocale: (newLocale: string) => void;
}

export default function NavbarContent({
  isMenuOpen,
  setIsMenuOpen,
  isScrolled,
  alternateLocale,
  switchLocale
}: NavbarContentProps) {
  // Use translations
  const t = useTranslations();
  
  // Get user session
  const { data: session, status } = useSession();
  const loading = status === "loading";
  
  // User dropdown state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    if (isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Handle user menu toggle (prevent event bubbling)
  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

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
          <Link href={`/`} className="flex items-center">
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
            <Link href={`/`} className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-80 transition-colors">
              {t('navigation.home')}
            </Link>
            <Link href={`/about`} className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-80 transition-colors">
              {t('navigation.about')}
            </Link>
            <Link href={`/future-vision`} className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-80 transition-colors">
              {t('navigation.futureVision')}
            </Link>
            <Link href={`/ai-magic`} className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-80 transition-colors">
              {t('navigation.AI Showcase')}
            </Link>
            <Link href={`/subscription`} className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-80 transition-colors">
              {t('navigation.pricing')}
            </Link>

            {/* Language Toggle */}
            <button 
              onClick={(e) => { e.stopPropagation(); switchLocale(alternateLocale); }}
              className={`flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg ${
                isScrolled 
                  ? "bg-white/20 text-pink-400 hover:bg-white/30" 
                  : "bg-[var(--primary)]/20 text-pink-400 hover:bg-[var(--primary)]/30"
              } transition-colors`}
            >
              <Globe size={16} />
              <span className="text-sm font-semibold">{t('common.languageSwitch')}</span>
            </button>

            {/* Login/Register Buttons or User Profile */}
            {loading ? (
              // Loading state
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session?.user ? (
              // Logged in state
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500">
                    {session.user.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-sm font-bold">
                        {session.user.name?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium text-white">
                    {session.user.name || "User"}
                  </span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      {t('navigation.profile')}
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      {t('navigation.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Logged out state
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/login`} 
                  className={`px-3 py-1.5 text-base font-semibold rounded-lg ${
                    isScrolled 
                      ? "text-pink-500 hover:bg-white/20" 
                      : "text-pink-400 hover:bg-gray-100"
                  } transition-colors`}
                >
                  {t('navigation.login')}
                </Link>
                <Link 
                  href={`/register`} 
                  className="px-3 py-1.5 text-base font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg hover:from-pink-600 hover:to-violet-600 transition-colors"
                >
                  {t('navigation.register')}
                </Link>
              </div>
            )}
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
              href={`/`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href={`/about`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.about')}
            </Link>
            <Link 
              href={`/future-vision`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.futureVision')}
            </Link>
            <Link 
              href={`/ai-magic`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.AI Showcase')}
            </Link>
            <Link 
              href={`/subscription`}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.pricing')}
            </Link>

            <div className="flex items-center justify-between pt-2 pb-1 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {/* Mobile Language Toggle */}
                <button 
                  onClick={() => switchLocale(alternateLocale)}
                  className="flex items-center space-x-1 p-2 rounded-lg bg-gray-200 text-gray-700"
                >
                  <Globe size={18} />
                  <span className="text-xs font-medium">{t('common.languageSwitch')}</span>
                </button>
              </div>

              {/* Mobile Login/Register */}
              {!session ? (
                <div>
                  <Link 
                    href={`/login`} 
                    className="inline-block px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navigation.login')}
                  </Link>
                  <Link 
                    href={`/register`} 
                    className="inline-block ml-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg hover:from-pink-600 hover:to-violet-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navigation.register')}
                  </Link>
                </div>
              ) : (
                <div>
                  <Link 
                    href="/profile"
                    className="inline-block px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} className="inline mr-1" />
                    {t('navigation.profile')}
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="inline-block ml-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    <LogOut size={16} className="inline mr-1" />
                    {t('navigation.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}