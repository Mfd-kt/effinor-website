import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { getProductsByCategorySlug } from '@/lib/products';
import { Lang } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductCard from '@/components/products/ProductCard';
import ProductTypeFilter from '@/components/products/ProductTypeFilter';
import ContactFormSection from '@/components/ContactFormSection';
import { Check, Package, Headphones, Truck } from 'lucide-react';

interface EtudePageProps {
  params: Promise<{ lang: string }>;
}

// Contenu spécifique à la page Étude
const pageContent = {
  fr: {
    hero: {
      title: 'Études techniques — Accompagnement pour vos projets d\'efficacité énergétique',
      subtitle: 'Audit, dimensionnement et préconisations techniques. Des études sur mesure pour optimiser vos installations.',
      bullets: [
        'Expertise technique : analyse complète de vos besoins',
        'Recommandations : solutions adaptées à vos contraintes',
        'Accompagnement : du diagnostic à la mise en œuvre',
      ],
      ctaPrimary: 'Voir nos prestations',
      ctaSecondary: 'Demander un devis',
    },
    trustBar: {
      items: ['Expertise technique', 'Conseil personnalisé', 'Suivi de projet'],
    },
    products: {
      title: 'Nos prestations d\'études les plus demandées',
      seeAll: 'Voir tout le catalogue',
    },
    guide: {
      title: 'Comment se déroule une étude technique ?',
      items: [
        {
          title: 'Audit et diagnostic',
          description: 'Analyse de votre bâtiment, de vos équipements et de vos consommations actuelles.',
        },
        {
          title: 'Dimensionnement',
          description: 'Calculs techniques pour définir les équipements adaptés à vos besoins spécifiques.',
        },
        {
          title: 'Préconisations',
          description: 'Solutions techniques détaillées avec estimations de performance et de retour sur investissement.',
        },
        {
          title: 'Accompagnement',
          description: 'Suivi du projet, aide au choix des prestataires et contrôle de la mise en œuvre.',
        },
      ],
    },
    sectors: {
      title: 'Pour quels projets ?',
      items: [
        {
          title: 'Industriel',
          description: 'Optimisation énergétique, rénovation',
        },
        {
          title: 'Tertiaire',
          description: 'Amélioration du confort, efficacité',
        },
        {
          title: 'Agricole',
          description: 'Énergies renouvelables, performance',
        },
      ],
    },
    cta: {
      title: 'Vous avez un projet ? On vous accompagne de A à Z.',
      ctaPrimary: 'Demander une étude',
      ctaSecondary: 'Nous contacter',
    },
  },
  ar: {
    hero: {
      title: 'الدراسات التقنية — الدعم لمشاريع كفاءة الطاقة',
      subtitle: 'التدقيق والحسابات والتوصيات التقنية. دراسات مخصصة لتحسين التجهيزات.',
      bullets: [
        'خبرة تقنية: تحليل شامل لاحتياجاتكم',
        'توصيات: حلول متكيفة مع قيودكم',
        'دعم: من التشخيص إلى التنفيذ',
      ],
      ctaPrimary: 'عرض خدماتنا',
      ctaSecondary: 'طلب عرض سعر',
    },
    trustBar: {
      items: ['خبرة تقنية', 'استشارة مخصصة', 'متابعة المشروع'],
    },
    products: {
      title: 'أكثر خدمات الدراسة طلباً',
      seeAll: 'عرض الكتالوج الكامل',
    },
    guide: {
      title: 'كيف تتم الدراسة التقنية؟',
      items: [
        {
          title: 'التدقيق والتشخيص',
          description: 'تحليل مبناكم ومعداتكم واستهلاكاتكم الحالية.',
        },
        {
          title: 'الحسابات',
          description: 'حسابات تقنية لتحديد المعدات المناسبة لاحتياجاتكم الخاصة.',
        },
        {
          title: 'التوصيات',
          description: 'حلول تقنية مفصلة مع تقديرات الأداء والعائد على الاستثمار.',
        },
        {
          title: 'الدعم',
          description: 'متابعة المشروع والمساعدة في اختيار المزودين ومراقبة التنفيذ.',
        },
      ],
    },
    sectors: {
      title: 'لماذا المشاريع؟',
      items: [
        {
          title: 'صناعي',
          description: 'تحسين الطاقة، التجديد',
        },
        {
          title: 'تجاري',
          description: 'تحسين الراحة، الكفاءة',
        },
        {
          title: 'زراعي',
          description: 'الطاقات المتجددة، الأداء',
        },
      ],
    },
    cta: {
      title: 'هل لديكم مشروع؟ نرافقكم من الألف إلى الياء.',
      ctaPrimary: 'طلب دراسة',
      ctaSecondary: 'اتصل بنا',
    },
  },
  en: {
    hero: {
      title: 'Technical studies — Support for your energy efficiency projects',
      subtitle: 'Audit, sizing and technical recommendations. Custom studies to optimize your installations.',
      bullets: [
        'Technical expertise: comprehensive analysis of your needs',
        'Recommendations: solutions adapted to your constraints',
        'Support: from diagnosis to implementation',
      ],
      ctaPrimary: 'View our services',
      ctaSecondary: 'Request a quote',
    },
    trustBar: {
      items: ['Technical expertise', 'Personalized advice', 'Project follow-up'],
    },
    products: {
      title: 'Our most requested study services',
      seeAll: 'View full catalog',
    },
    guide: {
      title: 'How does a technical study work?',
      items: [
        {
          title: 'Audit and diagnosis',
          description: 'Analysis of your building, equipment and current consumption.',
        },
        {
          title: 'Sizing',
          description: 'Technical calculations to define equipment adapted to your specific needs.',
        },
        {
          title: 'Recommendations',
          description: 'Detailed technical solutions with performance estimates and return on investment.',
        },
        {
          title: 'Support',
          description: 'Project follow-up, help choosing providers and implementation control.',
        },
      ],
    },
    sectors: {
      title: 'For which projects?',
      items: [
        {
          title: 'Industrial',
          description: 'Energy optimization, renovation',
        },
        {
          title: 'Tertiary',
          description: 'Comfort improvement, efficiency',
        },
        {
          title: 'Agricultural',
          description: 'Renewable energies, performance',
        },
      ],
    },
    cta: {
      title: 'Do you have a project? We support you from A to Z.',
      ctaPrimary: 'Request a study',
      ctaSecondary: 'Contact us',
    },
  },
};

export default async function EtudePage({ params }: EtudePageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const products = await getProductsByCategorySlug(lang, 'etude');
  const content = pageContent[lang];
  const isRTL = lang === 'ar';

  // Top picks : 6-8 premiers produits
  const topPicks = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* HERO */}
      <section className="bg-[#0F172A] text-white py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              isRTL ? 'lg:grid-flow-dense' : ''
            }`}
          >
            {/* Colonne gauche */}
            <div className={isRTL ? 'lg:col-start-2' : ''}>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                {content.hero.title}
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                {content.hero.subtitle}
              </p>

              {/* Bullets */}
              <ul className="space-y-3 mb-8">
                {content.hero.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div
                className={`flex flex-col sm:flex-row gap-4 ${
                  isRTL ? 'sm:flex-row-reverse' : ''
                }`}
              >
                <Link href="#products">
                  <Button variant="primary" className="bg-[#10B981] hover:bg-[#059669] w-full sm:w-auto">
                    {content.hero.ctaPrimary}
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button variant="secondary" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 w-full sm:w-auto">
                    {content.hero.ctaSecondary}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Colonne droite : Formulaire compact */}
            <div className={isRTL ? 'lg:col-start-1 lg:row-start-1' : ''}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <ContactFormSection lang={lang} dict={dict} compact={true} />
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Package className="w-8 h-8 text-[#10B981]" />
                <span className="text-sm font-medium">{content.trustBar.items[0]}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Headphones className="w-8 h-8 text-[#10B981]" />
                <span className="text-sm font-medium">{content.trustBar.items[1]}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Truck className="w-8 h-8 text-[#10B981]" />
                <span className="text-sm font-medium">{content.trustBar.items[2]}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUITS EN PREMIER */}
      <section id="products" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827]">
              {content.products.title}
            </h2>
            {products.length > 8 && (
              <Link href={`/${lang}/products?category=etude`}>
                <Button variant="secondary" className="whitespace-nowrap">
                  {content.products.seeAll}
                </Button>
              </Link>
            )}
          </div>

          {topPicks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#4B5563]">
                {lang === 'fr' && 'Aucun produit disponible pour le moment.'}
                {lang === 'en' && 'No products available at the moment.'}
                {lang === 'ar' && 'لا توجد منتجات متاحة في الوقت الحالي.'}
              </p>
            </div>
          ) : (
            <ProductTypeFilter products={topPicks} lang={lang} />
          )}
        </div>
      </section>

      {/* GUIDE INSTRUCTIF */}
      <section className="py-16 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-12 text-center">
            {content.guide.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.guide.items.map((item, index) => (
              <Card key={index}>
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-bold text-xl mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#4B5563] text-sm leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTEURS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-12 text-center">
            {content.sectors.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.sectors.items.map((sector, index) => (
              <Card key={index} className="text-center">
                <h3 className="text-2xl font-bold text-[#111827] mb-3">
                  {sector.title}
                </h3>
                <p className="text-[#4B5563]">
                  {sector.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contact" className="py-16 md:py-20 bg-[#0F172A] text-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8">
            {content.cta.title}
          </h2>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${
              isRTL ? 'sm:flex-row-reverse' : ''
            }`}
          >
            <Link href="#contact">
              <Button variant="primary" className="bg-[#10B981] hover:bg-[#059669] w-full sm:w-auto">
                {content.cta.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${lang}/contact`}>
              <Button variant="secondary" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 w-full sm:w-auto">
                {content.cta.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Formulaire contact final */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ContactFormSection lang={lang} dict={dict} />
        </div>
      </section>
    </div>
  );
}
