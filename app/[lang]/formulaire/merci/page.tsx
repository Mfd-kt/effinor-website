import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface MerciPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: MerciPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    return {
      title: 'Merci',
    };
  }

  return {
    title: 'Merci - Effinor',
    description: 'Votre formulaire a été envoyé avec succès',
  };
}

export default async function MerciPage({ params }: MerciPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const validLang = lang as Lang;
  const dict = getDictionary(validLang);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#111827] mb-4">
            {dict.detailedForm.success}
          </h1>
          <p className="text-[#6B7280] mb-8">
            Nous avons bien reçu votre formulaire et nous vous recontacterons rapidement.
          </p>
          <Link href={`/${validLang}`}>
            <Button variant="primary">
              Retour à l'accueil
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}



