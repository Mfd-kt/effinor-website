'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lang, Dictionary } from '@/types';
import { switchLanguage } from '@/lib/routing';
import { Logo } from '@/components/ui/Logo';
import { ChevronDown } from 'lucide-react';
import CartIconButton from '@/components/cart/CartIconButton';

interface HeaderProps {
  lang: Lang;
  dict: Dictionary;
}

export default function Header({ lang, dict }: HeaderProps) {
  const pathname = usePathname();
  const isRTL = lang === 'ar';
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const languages: { code: Lang; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  // Solutions avec leurs slugs
  const solutions = [
    { slug: 'luminaire', label: dict.nav.solutions_lighting },
    { slug: 'ventilation', label: dict.nav.solutions_ventilation },
    { slug: 'irve', label: dict.nav.solutions_irve },
    { slug: 'etude', label: dict.nav.solutions_study },
  ];

  const isSolutionsPage = pathname?.includes('/solutions') ?? false;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href={`/${lang}`} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Logo size={36} />
            <span className="text-xl font-bold text-[#111827]">EFFINOR</span>
          </Link>

          {/* Navigation */}
          <nav className={`hidden md:flex items-center gap-6 lg:gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link
              href={`/${lang}`}
              className={`text-sm font-medium transition-colors ${
                pathname === `/${lang}`
                  ? 'text-[#10B981]'
                  : 'text-[#111827] hover:text-[#10B981]'
              }`}
            >
              {dict.nav.home}
            </Link>

            {/* Menu Solutions avec dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  isSolutionsPage
                    ? 'text-[#10B981]'
                    : 'text-[#111827] hover:text-[#10B981]'
                }`}
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                type="button"
              >
                {dict.nav.solutions}
                <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {solutionsOpen && (
                <div
                  className={`absolute top-full pt-2 w-56 z-50 ${
                    isRTL ? 'right-0' : 'left-0'
                  }`}
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  {solutions.map((solution) => (
                    <Link
                      key={solution.slug}
                      href={`/${lang}/solutions/${solution.slug}`}
                      className="block px-4 py-2.5 text-sm text-[#111827] hover:bg-[#10B981]/10 hover:text-[#10B981] transition-colors cursor-pointer"
                      onClick={() => setSolutionsOpen(false)}
                    >
                      {solution.label}
                    </Link>
                  ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/${lang}/about`}
              className={`text-sm font-medium transition-colors ${
                pathname === `/${lang}/about`
                  ? 'text-[#10B981]'
                  : 'text-[#111827] hover:text-[#10B981]'
              }`}
            >
              {dict.nav.about}
            </Link>
            <Link
              href={`/${lang}/blog`}
              className={`text-sm font-medium transition-colors ${
                pathname === `/${lang}/blog`
                  ? 'text-[#10B981]'
                  : 'text-[#111827] hover:text-[#10B981]'
              }`}
            >
              {dict.nav.blog}
            </Link>
            <Link
              href={`/${lang}/faq`}
              className={`text-sm font-medium transition-colors ${
                pathname === `/${lang}/faq`
                  ? 'text-[#10B981]'
                  : 'text-[#111827] hover:text-[#10B981]'
              }`}
            >
              {dict.nav.faq}
            </Link>
            <Link
              href={`/${lang}/contact`}
              className={`text-sm font-medium transition-colors ${
                pathname === `/${lang}/contact`
                  ? 'text-[#10B981]'
                  : 'text-[#111827] hover:text-[#10B981]'
              }`}
            >
              {dict.nav.contact}
            </Link>
          </nav>

          {/* Panier et sélecteur de langue */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Icône panier */}
            <CartIconButton lang={lang} />

            {/* Sélecteur de langue */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {languages.map(({ code, label }) => (
              <Link
                key={code}
                href={switchLanguage(pathname, code)}
                className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                  lang === code
                    ? 'text-[#10B981] bg-[#10B981]/10'
                    : 'text-[#4B5563] hover:text-[#10B981]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}
