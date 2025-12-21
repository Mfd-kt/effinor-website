import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import CheckoutClient from '@/components/cart/CheckoutClient';

interface CheckoutPageProps {
  params: Promise<{ lang: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return <CheckoutClient lang={lang} dict={dict} />;
}






