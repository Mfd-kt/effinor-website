import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPublishedPosts, getPostBySlug } from '@/lib/services/blog';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import { markdownToHtml } from '@/lib/utils/markdown';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isValidLang(lang)) {
    return {
      title: 'Article',
    };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article introuvable',
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.seoOgImageUrl || post.coverImageUrl ? [post.seoOgImageUrl || post.coverImageUrl || ''] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const validLang = lang as Lang;
  const dict = getDictionary(validLang);
  const isRTL = validLang === 'ar';

  // Récupérer l'article depuis Supabase
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Locale pour date-fns
  const dateLocale = validLang === 'fr' ? fr : validLang === 'en' ? enUS : ar;

  return (
    <div className={`py-16 md:py-24 bg-[#F9FAFB] min-h-screen ${isRTL ? 'rtl' : ''}`}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <Link href={`/${validLang}/blog`} className="inline-block mb-8">
          <Button variant="outline" className="text-sm">
            ← {validLang === 'fr' ? 'Retour au blog' : validLang === 'en' ? 'Back to blog' : 'العودة إلى المدونة'}
          </Button>
        </Link>

        {/* Image de couverture */}
        {post.coverImageUrl && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        {/* En-tête de l'article */}
        <header className="mb-8">
          {post.category && (
            <span className="inline-block text-sm font-semibold text-[#10B981] mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-[#4B5563] mb-6">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
            {post.publishedAt && (
              <span>
                {format(new Date(post.publishedAt), 'PPP', { locale: dateLocale })}
              </span>
            )}
            {post.authorName && (
              <>
                <span>•</span>
                <span>{post.authorName}</span>
              </>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-[#F3F4F6] text-[#6B7280] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Contenu de l'article */}
        <article
          className={`prose prose-lg max-w-none prose-headings:text-[#111827] prose-headings:font-bold prose-p:text-[#4B5563] prose-p:leading-relaxed prose-a:text-[#10B981] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#111827] prose-ul:text-[#4B5563] prose-ol:text-[#4B5563] prose-li:text-[#4B5563] prose-img:rounded-lg prose-img:shadow-md ${isRTL ? 'prose-rtl' : ''}`}
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />

        {/* Footer de l'article */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link href={`/${validLang}/blog`}>
              <Button variant="outline">
                ← {validLang === 'fr' ? 'Retour au blog' : validLang === 'en' ? 'Back to blog' : 'العودة إلى المدونة'}
              </Button>
            </Link>
            {post.updatedAt && post.updatedAt.getTime() !== post.createdAt.getTime() && (
              <p className="text-sm text-[#6B7280]">
                {validLang === 'fr' && `Mis à jour le ${format(new Date(post.updatedAt), 'PPP', { locale: dateLocale })}`}
                {validLang === 'en' && `Updated on ${format(new Date(post.updatedAt), 'PPP', { locale: dateLocale })}`}
                {validLang === 'ar' && `تم التحديث في ${format(new Date(post.updatedAt), 'PPP', { locale: dateLocale })}`}
              </p>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
