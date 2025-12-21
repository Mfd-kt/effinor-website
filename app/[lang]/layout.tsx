import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LangLayoutProps) {
  const { lang } = await params;
  
  if (!isValidLang(lang)) {
    return {};
  }

  const dict = getDictionary(lang);
  
  return {
    title: `Effinor - ${dict.nav.home}`,
    description: dict.hero.subtitle,
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Header lang={lang} dict={dict} />
      <main className="flex-grow">{children}</main>
      <Footer lang={lang} dict={dict} />
    </div>
  );
}
