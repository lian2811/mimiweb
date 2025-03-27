// This is a server component (no "use client" directive)
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

// Define props interface
interface FooterContentProps {
  locale: string;
  currentYear: number;
}

export default function FooterContent({
  locale,
  currentYear
}: FooterContentProps) {
  // Use translations in the server component
  const t = useTranslations('');

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
              {t('footer.tagline')}
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footer.products')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`/${locale}/ai-magic`} className="text-base text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                  {t('footer.aiShowcase')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/subscription`} className="text-base text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footer.company')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`/about`} className="text-base text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                  {t('footer.blog')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footer.contact')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <Mail size={20} className="mr-2 text-gray-400 mt-1" />
                <span className="text-base text-gray-600 dark:text-gray-400">
                  contact@mimiai.example.com
                </span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-2 text-gray-400 mt-1" />
                <span className="text-base text-gray-600 dark:text-gray-400">
                  +886 2 1234 5678
                </span>
              </li>
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-gray-400 mt-1" />
                <span className="text-base text-gray-600 dark:text-gray-400">
                  {t('footer.address')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
          <p className="text-base text-center text-gray-500 dark:text-gray-400">
            © {currentYear} MiMi AI. {t('footer.rights')}
          </p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}