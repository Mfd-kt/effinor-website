import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import ContactFormSection from '@/components/ContactFormSection';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getSeoContentBySlug } from '@/lib/services/seo-content';
import { extractContactInfo } from '@/lib/utils/contact';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    return {
      title: 'Contact',
    };
  }

  const content = await getSeoContentBySlug('contact', lang as Lang);

  if (!content) {
    return {
      title: 'Contact - Effinor',
    };
  }

  return {
    title: content.metaTitle || content.title,
    description: content.metaDescription,
    keywords: content.metaKeywords,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const validLang = lang as Lang;
  const dict = getDictionary(validLang);
  const isRTL = validLang === 'ar';

  // Récupérer le contenu depuis Supabase
  const content = await getSeoContentBySlug('contact', validLang);

  // Extraire les informations de contact depuis le contenu HTML
  const contactInfo = content ? extractContactInfo(content.content) : {
    email: validLang === 'fr' ? 'contact@effinor.fr' : validLang === 'en' ? 'contact@effinor.fr' : 'contact@effinor.fr',
    phone: validLang === 'fr' ? '09 78 45 50 63' : validLang === 'en' ? '+33 9 78 45 50 63' : '+33 9 78 45 50 63',
    address: validLang === 'fr' ? "Tour Europa, Av. de l'Europe, 94320 Thiais" : validLang === 'en' ? "Europa Tower, Av. de l'Europe, 94320 Thiais, France" : "برج أوروبا، شارع أوروبا، 94320 تييه، فرنسا",
    hours: validLang === 'fr' ? 'Lun-Ven: 8h-18h' : validLang === 'en' ? 'Mon-Fri: 8am-6pm' : 'الإثنين-الجمعة: 8ص-6م',
  };

  return (
    <div className={`py-16 md:py-20 bg-[#F9FAFB] min-h-screen ${isRTL ? 'rtl' : ''}`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle center subtitle={dict.contact.subtitle}>
          {content?.title || dict.contact.title}
        </SectionTitle>

        <div className="max-w-4xl mx-auto">
          {/* Formulaire de contact */}
          <ContactFormSection lang={validLang} dict={dict} />

          {/* Informations de contact depuis la base de données */}
          <Card className="mt-12" padding="lg">
            <h2 className="text-2xl font-bold text-[#111827] mb-6">
              {validLang === 'fr' && 'Autres moyens de contact'}
              {validLang === 'en' && 'Other ways to reach us'}
              {validLang === 'ar' && 'طرق أخرى للتواصل'}
            </h2>

            {/* Contenu HTML depuis la base de données */}
            {content && (
              <div
                className={`prose prose-sm max-w-none prose-headings:text-[#111827] prose-headings:font-bold prose-p:text-[#4B5563] prose-strong:text-[#111827] ${isRTL ? 'prose-rtl' : ''}`}
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            )}

            {/* Informations de contact structurées (fallback si pas de contenu) */}
            {!content && (
              <div className="space-y-4 text-[#4B5563]">
                {contactInfo.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-[#111827] block mb-1">
                        {validLang === 'fr' && 'Email'}
                        {validLang === 'en' && 'Email'}
                        {validLang === 'ar' && 'البريد الإلكتروني'}
                      </strong>
                      <a href={`mailto:${contactInfo.email}`} className="text-[#10B981] hover:underline">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-[#111827] block mb-1">
                        {validLang === 'fr' && 'Téléphone'}
                        {validLang === 'en' && 'Phone'}
                        {validLang === 'ar' && 'الهاتف'}
                      </strong>
                      <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-[#10B981] hover:underline">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-[#111827] block mb-1">
                        {validLang === 'fr' && 'Adresse'}
                        {validLang === 'en' && 'Address'}
                        {validLang === 'ar' && 'العنوان'}
                      </strong>
                      <p>{contactInfo.address}</p>
                    </div>
                  </div>
                )}

                {contactInfo.hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-[#111827] block mb-1">
                        {validLang === 'fr' && 'Horaires'}
                        {validLang === 'en' && 'Opening Hours'}
                        {validLang === 'ar' && 'ساعات العمل'}
                      </strong>
                      <p>{contactInfo.hours}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
