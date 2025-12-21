import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { getCategories } from '@/lib/categories';
import { Lang } from '@/types';
import ContactFormSection from '@/components/ContactFormSection';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const categories = await getCategories(lang);

  return (
    <div className="py-16 md:py-20 bg-[#F9FAFB]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle center subtitle={dict.contact.subtitle}>
          {dict.contact.title}
        </SectionTitle>

        <div className="max-w-2xl mx-auto">
          <ContactFormSection lang={lang} dict={dict} categories={categories} />

          <Card className="mt-12">
            <h2 className="text-2xl font-bold text-[#111827] mb-4">
              {lang === 'fr' && 'Autres moyens de contact'}
              {lang === 'en' && 'Other ways to reach us'}
              {lang === 'ar' && 'طرق أخرى للتواصل'}
            </h2>
            <div className="space-y-4 text-[#4B5563]">
              <p>
                <strong className="text-[#111827]">Email:</strong> contact@effinor.com
              </p>
              <p>
                <strong className="text-[#111827]">Phone:</strong> +33 (0)1 XX XX XX XX
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
