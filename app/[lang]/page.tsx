import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { getCategories } from '@/lib/categories';
import { Lang } from '@/types';
import Link from 'next/link';
import SolutionsSection from '@/components/SolutionsSection';
import WhySection from '@/components/WhySection';
import ProcessSection from '@/components/ProcessSection';
import ContactFormSection from '@/components/ContactFormSection';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const categories = await getCategories(lang);
  const isRTL = lang === 'ar';

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      {/* HERO avec formulaire en haut à droite */}
      <section className="w-full effinor-gradient text-white py-16 md:py-20">
        <div
          className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8 ${
            isRTL ? 'md:flex-row-reverse' : 'md:flex-row'
          }`}
        >
          {/* Colonne gauche : texte hero */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            {dict.hero.badge && (
              <Badge variant="amber" className="bg-[#F59E0B]/20 text-[#FBBF24] mb-6 w-fit">
                {dict.hero.badge}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              {dict.hero.title}
            </h1>

            <p className="text-base md:text-lg text-gray-200 mb-8">
              {dict.hero.subtitle}
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
            >
              <Link href={`/${lang}/contact`}>
                <Button variant="primary" className="bg-[#10B981] hover:bg-[#059669]">
                  {dict.hero.ctaPrimary}
                </Button>
              </Link>
              <Link href={`/${lang}/solutions/luminaire`}>
                <Button variant="secondary" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  {dict.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>

          {/* Colonne droite : formulaire lead */}
          <div className="w-full md:w-1/2">
            <ContactFormSection lang={lang} dict={dict} categories={categories} compact={true} />
          </div>
        </div>
      </section>

      {/* Sections suivantes */}
      <SolutionsSection lang={lang} dict={dict} />
      <WhySection dict={dict} />
      <ProcessSection dict={dict} />
    </main>
  );
}
