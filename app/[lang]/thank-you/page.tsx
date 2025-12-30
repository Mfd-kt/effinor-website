import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ThankYouPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const isRTL = lang === 'ar';

  const messages = {
    title: {
      fr: 'Merci pour votre demande !',
      en: 'Thank you for your request!',
      ar: 'شكرًا لك على طلبك!',
    },
    subtitle: {
      fr: 'Votre demande a bien été reçue. Notre équipe vous contactera dans les plus brefs délais.',
      en: 'Your request has been received. Our team will contact you as soon as possible.',
      ar: 'تم استلام طلبك. سيتواصل فريقنا معك في أقرب وقت ممكن.',
    },
    backHome: {
      fr: 'Retour à l\'accueil',
      en: 'Back to home',
      ar: 'العودة إلى الصفحة الرئيسية',
    },
    browseProducts: {
      fr: 'Voir nos produits',
      en: 'Browse our products',
      ar: 'تصفح منتجاتنا',
    },
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-16 md:py-24">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Card className="p-8 md:p-12 text-center" padding="lg">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-[#10B981] mx-auto" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4">
            {messages.title[lang]}
          </h1>

          <p className="text-lg text-[#4B5563] mb-8">
            {messages.subtitle[lang]}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link href={`/${lang}`}>
              <Button variant="primary">
                {messages.backHome[lang]}
              </Button>
            </Link>
            <Link href={`/${lang}/products`}>
              <Button variant="secondary">
                {messages.browseProducts[lang]}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}






