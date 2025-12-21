import Link from 'next/link';
import { Lang, Dictionary } from '@/types';
import { Logo } from '@/components/ui/Logo';

interface FooterProps {
  lang: Lang;
  dict: Dictionary;
}

export default function Footer({ lang, dict }: FooterProps) {
  const isRTL = lang === 'ar';

  return (
    <footer className="bg-[#0F172A] text-gray-300">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isRTL ? 'md:text-right' : ''}`}>
          {/* Logo et description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo size={32} />
              <h3 className="text-xl font-bold text-white">EFFINOR</h3>
            </div>
            <p className="text-sm text-gray-400">
              Solutions d'efficacité énergétique pour bâtiments professionnels, industriels et tertiaires.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}`} className="hover:text-white transition-colors text-gray-400">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/solutions/luminaire`} className="hover:text-white transition-colors text-gray-400">
                  {dict.nav.solutions}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/about`} className="hover:text-white transition-colors text-gray-400">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="hover:text-white transition-colors text-gray-400">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/seo/mentions-legales`} className="hover:text-white transition-colors text-gray-400">
                  {dict.footer.legal}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/seo/politique-confidentialite`} className="hover:text-white transition-colors text-gray-400">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/seo/cgv`} className="hover:text-white transition-colors text-gray-400">
                  {dict.footer.cgv}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="hover:text-white transition-colors text-gray-400">
                  {dict.footer.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E293B] mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Effinor. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
