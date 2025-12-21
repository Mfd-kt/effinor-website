import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <div className="py-16 md:py-20 bg-[#F9FAFB]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle>
          {dict.nav.about}
        </SectionTitle>

        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[#4B5563] mb-8">
              {lang === 'fr' && (
                <>
                  Effinor est un acteur majeur de l'efficacité énergétique et des solutions techniques pour bâtiments professionnels, industriels et tertiaires. Depuis plus de 10 ans, nous accompagnons nos clients dans leurs projets d'optimisation énergétique.
                </>
              )}
              {lang === 'en' && (
                <>
                  Effinor is a major player in energy efficiency and technical solutions for professional, industrial and tertiary buildings. For over 10 years, we have been supporting our clients in their energy optimization projects.
                </>
              )}
              {lang === 'ar' && (
                <>
                  إيفينور هو لاعب رئيسي في كفاءة الطاقة والحلول التقنية للمباني المهنية والصناعية والتجارية. لأكثر من 10 سنوات، ندعم عملائنا في مشاريع تحسين الطاقة.
                </>
              )}
            </p>

            <Card>
              <h2 className="text-2xl font-bold text-[#111827] mb-4">
                {dict.why.title}
              </h2>
              <ul className="space-y-4 text-[#4B5563]">
                <li>
                  <strong className="text-[#111827]">{dict.why.expertise.title}:</strong>{' '}
                  {dict.why.expertise.description}
                </li>
                <li>
                  <strong className="text-[#111827]">{dict.why.cee.title}:</strong>{' '}
                  {dict.why.cee.description}
                </li>
                <li>
                  <strong className="text-[#111827]">{dict.why.turnkey.title}:</strong>{' '}
                  {dict.why.turnkey.description}
                </li>
                <li>
                  <strong className="text-[#111827]">{dict.why.support.title}:</strong>{' '}
                  {dict.why.support.description}
                </li>
              </ul>
            </Card>

            <div className="text-center mt-12">
              <Link href={`/${lang}/contact`}>
                <Button variant="primary">{dict.hero.ctaPrimary}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
