import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import CartClient from '@/components/cart/CartClient';

interface CartPageProps {
  params: Promise<{ lang: string }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return <CartClient lang={lang} dict={dict} />;
}






