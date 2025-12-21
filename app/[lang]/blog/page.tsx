import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <div className="py-16 md:py-24 bg-[#F9FAFB]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle center subtitle={
          lang === 'fr' ? 'Découvrez nos articles sur l\'efficacité énergétique et les solutions techniques pour bâtiments.' :
          lang === 'en' ? 'Discover our articles on energy efficiency and technical solutions for buildings.' :
          'اكتشف مقالاتنا حول كفاءة الطاقة والحلول التقنية للمباني.'
        }>
          {dict.nav.blog}
        </SectionTitle>

        <div className="max-w-2xl mx-auto">
          <Card className="text-center" padding="lg">
            <p className="text-[#4B5563] mb-6">
              {lang === 'fr' && 'Le blog sera bientôt disponible. Revenez bientôt pour découvrir nos articles !'}
              {lang === 'en' && 'The blog will be available soon. Come back soon to discover our articles!'}
              {lang === 'ar' && 'المدونة ستكون متاحة قريباً. عد قريباً لاكتشاف مقالاتنا!'}
            </p>
            <Link href={`/${lang}`}>
              <Button variant="primary">
                {dict.nav.home} →
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
