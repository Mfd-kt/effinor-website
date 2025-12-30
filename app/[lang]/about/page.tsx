import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import Link from 'next/link';
import { getSeoContentBySlug } from '@/lib/services/seo-content';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    return {
      title: 'À propos',
    };
  }

  const content = await getSeoContentBySlug('a-propos', lang as Lang);

  if (!content) {
    return {
      title: 'À propos - Effinor',
    };
  }

  return {
    title: content.metaTitle || content.title,
    description: content.metaDescription,
    keywords: content.metaKeywords,
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const validLang = lang as Lang;
  const dict = getDictionary(validLang);
  const isRTL = validLang === 'ar';

  // Récupérer le contenu depuis Supabase
  const content = await getSeoContentBySlug('a-propos', validLang);

  // Si le contenu n'existe pas, afficher un message ou utiliser le contenu par défaut
  if (!content) {
    return (
      <div className={`py-16 md:py-20 bg-[#F9FAFB] min-h-screen ${isRTL ? 'rtl' : ''}`}>
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl md:text-5xl font-bold text-[#1F2937] mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {dict.nav.about}
          </h1>
          <div className={`max-w-4xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-xl text-[#4B5563] mb-8">
              {validLang === 'fr' && (
                <>
                  Effinor est un acteur majeur de l'efficacité énergétique et des solutions techniques pour bâtiments professionnels, industriels et tertiaires. Depuis plus de 10 ans, nous accompagnons nos clients dans leurs projets d'optimisation énergétique.
                </>
              )}
              {validLang === 'en' && (
                <>
                  Effinor is a major player in energy efficiency and technical solutions for professional, industrial and tertiary buildings. For over 10 years, we have been supporting our clients in their energy optimization projects.
                </>
              )}
              {validLang === 'ar' && (
                <>
                  إيفينور هو لاعب رئيسي في كفاءة الطاقة والحلول التقنية للمباني المهنية والصناعية والتجارية. لأكثر من 10 سنوات، ندعم عملائنا في مشاريع تحسين الطاقة.
                </>
              )}
            </p>
            <div className="text-center mt-12">
              <Link href={`/${validLang}/contact`}>
                <Button variant="default">{dict.hero.ctaPrimary}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-16 md:py-20 bg-[#F9FAFB] min-h-screen ${isRTL ? 'rtl' : ''}`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Titre de la page */}
        <h1 className={`text-4xl md:text-5xl font-bold text-[#1F2937] mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {content.title}
        </h1>

        {/* Contenu depuis la base de données */}
        <div
          className={`seo-content prose prose-lg max-w-none prose-headings:text-[#1F2937] prose-headings:font-bold prose-p:text-[#4B5563] prose-p:leading-relaxed prose-a:text-[#10B981] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1F2937] prose-ul:text-[#4B5563] prose-ol:text-[#4B5563] prose-li:text-[#4B5563] ${isRTL ? 'prose-rtl' : ''}`}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        {/* Date de mise à jour */}
        {content.updatedAt && (
          <div className={`mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
            {validLang === 'fr' && (
              <p>Dernière mise à jour : {new Date(content.updatedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
            )}
            {validLang === 'en' && (
              <p>Last updated: {new Date(content.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
            )}
            {validLang === 'ar' && (
              <p>آخر تحديث: {new Date(content.updatedAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
