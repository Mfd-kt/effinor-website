import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <div className="py-16 md:py-24 bg-[#F9FAFB]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/${lang}/blog`}
            className="text-[#10B981] font-medium hover:text-[#059669] mb-8 inline-flex items-center gap-2 transition-colors"
          >
            ← {dict.nav.blog}
          </Link>

          <Card padding="lg">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6">
              {lang === 'fr' && 'Article de blog'}
              {lang === 'en' && 'Blog post'}
              {lang === 'ar' && 'مقال المدونة'}
            </h1>

            <p className="text-[#4B5563] mb-4">
              <strong className="text-[#111827]">Slug:</strong> {slug}
            </p>

            <p className="text-[#4B5563]">
              {lang === 'fr' && 'Cette page est prête pour afficher les articles de blog. Le contenu sera connecté à Supabase dans une prochaine étape.'}
              {lang === 'en' && 'This page is ready to display blog posts. Content will be connected to Supabase in a next step.'}
              {lang === 'ar' && 'هذه الصفحة جاهزة لعرض مقالات المدونة. سيتم ربط المحتوى بـ Supabase في خطوة قادمة.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
