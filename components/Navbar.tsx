"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

// Import the NavbarContent component which will be defined below
import NavbarContent from "./NavbarContent";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userLocale, setUserLocale] = useState<string>('en');
  const [alternateLocale, setAlternateLocale] = useState<string>('zh');

  // Fetch the user's preferred language from cookies
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const locale = document.cookie
        .split('; ')
        .find((row) => row.startsWith('locale='))
        ?.split('=')[1] || 'en';

      setUserLocale(locale);
      setAlternateLocale(locale === 'en' ? 'zh' : 'en');
    }
  }, []);

  // Function to switch the locale
  const router = useRouter();

  const switchLocale = (newLocale: string): void => {
    if (typeof document !== 'undefined') {
      const currentLocale = document.cookie
        .split('; ')
        .find((row) => row.startsWith('locale='))
        ?.split('=')[1];
  
      if (currentLocale !== newLocale) {
        document.cookie = `locale=${newLocale};`;
        // 立即更新 state
        setUserLocale(newLocale);
        setAlternateLocale(newLocale === 'en' ? 'zh' : 'en');
        router.refresh(); // 軟刷新，不會整個跳轉閃爍
      }
    }
  };

  // Detect page scroll to change navbar style
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

  // Pass all necessary props to the server component
  return (
    <NavbarContent 
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      isScrolled={isScrolled}
      locale={userLocale}
      alternateLocale={alternateLocale}
      switchLocale={switchLocale} />
  );
}