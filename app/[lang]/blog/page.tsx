import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPublishedPosts } from '@/lib/services/blog';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import type { Metadata } from 'next';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    return {
      title: 'Blog',
    };
  }

  const dict = getDictionary(lang as Lang);

  return {
    title: `${dict.nav.blog} - Effinor`,
    description: lang === 'fr' 
      ? 'Découvrez nos articles sur l\'efficacité énergétique et les solutions techniques pour bâtiments.'
      : lang === 'en'
      ? 'Discover our articles on energy efficiency and technical solutions for buildings.'
      : 'اكتشف مقالاتنا حول كفاءة الطاقة والحلول التقنية للمباني.',
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const validLang = lang as Lang;
  const dict = getDictionary(validLang);
  const isRTL = validLang === 'ar';

  // Récupérer les articles publiés depuis Supabase
  const posts = await getPublishedPosts();

  // Locale pour date-fns
  const dateLocale = validLang === 'fr' ? fr : validLang === 'en' ? enUS : ar;

  return (
    <div className={`py-16 md:py-24 bg-[#F9FAFB] min-h-screen ${isRTL ? 'rtl' : ''}`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          center 
          subtitle={
            validLang === 'fr' 
              ? 'Découvrez nos articles sur l\'efficacité énergétique et les solutions techniques pour bâtiments.'
              : validLang === 'en'
              ? 'Discover our articles on energy efficiency and technical solutions for buildings.'
              : 'اكتشف مقالاتنا حول كفاءة الطاقة والحلول التقنية للمباني.'
          }
        >
          {dict.nav.blog}
        </SectionTitle>

        {posts.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <Card className="text-center" padding="lg">
              <p className="text-[#4B5563] mb-6">
                {validLang === 'fr' && 'Le blog sera bientôt disponible. Revenez bientôt pour découvrir nos articles !'}
                {validLang === 'en' && 'The blog will be available soon. Come back soon to discover our articles!'}
                {validLang === 'ar' && 'المدونة ستكون متاحة قريباً. عد قريباً لاكتشاف مقالاتنا!'}
              </p>
              <Link href={`/${validLang}`}>
                <Button variant="primary">
                  {dict.nav.home} →
                </Button>
              </Link>
            </Card>
          </div>
        ) : (
          <>
            {/* Indicateur de langue actuelle */}
            <div className="mt-8 mb-4 flex items-center justify-center gap-2">
              <span className="text-sm text-[#6B7280]">
                {validLang === 'fr' && 'Articles en français'}
                {validLang === 'en' && 'Articles in English'}
                {validLang === 'ar' && 'مقالات بالعربية'}
              </span>
              <span className="text-[#6B7280]">•</span>
              <span className="text-sm text-[#6B7280]">
                {validLang === 'fr' && 'Tous les articles'}
                {validLang === 'en' && 'All articles'}
                {validLang === 'ar' && 'جميع المقالات'}
              </span>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {posts.map((post) => {
                const postLang = post.lang || 'fr';
                const langFlags: Record<string, string> = {
                  fr: '🇫🇷',
                  en: '🇬🇧',
                  ar: '🇸🇦',
                };
                const langLabels: Record<string, string> = {
                  fr: 'FR',
                  en: 'EN',
                  ar: 'AR',
                };

                return (
                  <Link 
                    key={post.id} 
                    href={`/${postLang}/blog/${post.slug}`}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow p-0">
                      {post.coverImageUrl && (
                        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                          <Image
                            src={post.coverImageUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          {post.category && (
                            <span className="inline-block text-xs font-semibold text-[#10B981]">
                              {post.category}
                            </span>
                          )}
                          {postLang && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#F3F4F6] text-[#6B7280] rounded-full">
                              {langFlags[postLang]} {langLabels[postLang]}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#10B981] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-[#4B5563] text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-[#6B7280]">
                          {post.publishedAt && (
                            <span>
                              {format(new Date(post.publishedAt), 'PPP', { locale: dateLocale })}
                            </span>
                          )}
                          {post.authorName && (
                            <span>{post.authorName}</span>
                          )}
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-[#F3F4F6] text-[#6B7280] rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
