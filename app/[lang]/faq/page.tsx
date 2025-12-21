import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import { getSeoContentBySlug } from '@/lib/services/seo-content';
import type { Metadata } from 'next';

interface FaqPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    return {
      title: 'FAQ',
    };
  }

  const content = await getSeoContentBySlug('faq', lang as Lang);

  if (!content) {
    return {
      title: 'FAQ - Effinor',
    };
  }

  return {
    title: content.metaTitle || content.title,
    description: content.metaDescription,
    keywords: content.metaKeywords,
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const validLang = lang as Lang;
  const isRTL = validLang === 'ar';

  // Récupérer le contenu depuis Supabase
  const content = await getSeoContentBySlug('faq', validLang);

  // Si le contenu n'existe pas, afficher une page 404
  if (!content) {
    notFound();
  }

  return (
    <div className={`py-16 md:py-20 bg-[#F9FAFB] min-h-screen ${isRTL ? 'rtl' : ''}`}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Titre de la page */}
        <h1 className={`text-4xl md:text-5xl font-bold text-[#1F2937] mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {content.title}
        </h1>

        {/* Contenu */}
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

