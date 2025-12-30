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

interface LuminairePageProps {
  params: Promise<{ lang: string }>;
}

// Contenu spécifique à la page Luminaires
const pageContent = {
  fr: {
    hero: {
      title: 'Luminaires LED professionnels — Entrepôts, ateliers, tertiaire, agricole',
      subtitle: 'Sélection technique, fourniture et livraison rapide. Des produits fiables conçus pour les environnements exigeants.',
      bullets: [
        'Haute performance : 130 à 180 lm/W selon gamme',
        'Robustes : IP65 / IK07+ selon modèles',
        'Adaptés aux hauteurs : 4 m à 15 m+',
      ],
      ctaPrimary: 'Voir les luminaires',
      ctaSecondary: 'Demander un devis',
    },
    trustBar: {
      items: ['Qualité pro', 'Conseil technique', 'Livraison & suivi'],
    },
    products: {
      title: 'Nos luminaires les plus demandés',
      seeAll: 'Voir tout le catalogue',
    },
    guide: {
      title: 'Comment choisir un luminaire industriel ?',
      items: [
        {
          title: 'Hauteur sous plafond',
          description: 'Détermine le choix optique : projecteur pour hauteur > 8m, panneau pour < 6m.',
        },
        {
          title: 'Niveau de lux visé',
          description: 'Objectif d\'éclairement selon l\'activité : 200-300 lux logistique, 500+ lux bureaux.',
        },
        {
          title: 'Environnement',
          description: 'IP65 pour zones humides, IK10 pour chocs mécaniques. Sélectionnez selon vos contraintes.',
        },
        {
          title: 'Usage',
          description: 'Détection de présence et gradation pour optimiser la consommation. Compatible selon modèles.',
        },
      ],
    },
    sectors: {
      title: 'Pour quels secteurs ?',
      items: [
        {
          title: 'Industriel',
          description: 'Entrepôts, logistique, production',
        },
        {
          title: 'Tertiaire',
          description: 'Bureaux, commerces, parkings',
        },
        {
          title: 'Agricole',
          description: 'Élevage, hangars, serres',
        },
      ],
    },
    cta: {
      title: 'Vous avez un projet ? On vous recommande la bonne gamme.',
      ctaPrimary: 'Ajouter au panier',
      ctaSecondary: 'Demander un devis',
    },
  },
  ar: {
    hero: {
      title: 'إضاءة LED احترافية — للمستودعات والورشات والمباني التجارية والزراعية',
      subtitle: 'اختيار تقني وتوريد وتسليم سريع. منتجات موثوقة مصممة للبيئات الصعبة.',
      bullets: [
        'أداء قوي: من 130 إلى 180 لومن/واط حسب الفئة',
        'متانة عالية: IP65 / IK07+ حسب الموديلات',
        'مناسبة للارتفاعات: من 4م إلى 15م وأكثر',
      ],
      ctaPrimary: 'عرض المنتجات',
      ctaSecondary: 'طلب عرض سعر',
    },
    trustBar: {
      items: ['جودة احترافية', 'دعم تقني', 'تسليم ومتابعة'],
    },
    products: {
      title: 'أكثر منتجات الإضاءة طلباً',
      seeAll: 'عرض الكتالوج الكامل',
    },
    guide: {
      title: 'كيف تختار إضاءة صناعية مناسبة؟',
      items: [
        {
          title: 'ارتفاع السقف',
          description: 'يحدد اختيار البصريات: مصباح للمسافات > 8م، لوحة للمسافات < 6م.',
        },
        {
          title: 'مستوى الإضاءة المطلوب',
          description: 'هدف الإضاءة حسب النشاط: 200-300 لوكس للوجستيات، 500+ لوكس للمكاتب.',
        },
        {
          title: 'البيئة',
          description: 'IP65 للمناطق الرطبة، IK10 للصدمات الميكانيكية. اختر حسب قيودك.',
        },
        {
          title: 'الاستخدام',
          description: 'كشف الحضور والتدرج لتحسين الاستهلاك. متوافق حسب الموديلات.',
        },
      ],
    },
    sectors: {
      title: 'لماذا القطاعات؟',
      items: [
        {
          title: 'صناعي',
          description: 'مستودعات، لوجستيات، إنتاج',
        },
        {
          title: 'تجاري',
          description: 'مكاتب، متاجر، مواقف سيارات',
        },
        {
          title: 'زراعي',
          description: 'تربية حيوانات، حظائر، صوب',
        },
      ],
    },
    cta: {
      title: 'هل لديكم مشروع؟ نوصي لكم بالحل المناسب.',
      ctaPrimary: 'إضافة إلى السلة',
      ctaSecondary: 'طلب عرض سعر',
    },
  },
  en: {
    hero: {
      title: 'Professional LED lighting — Warehouses, workshops, tertiary, agricultural',
      subtitle: 'Technical selection, supply and fast delivery. Reliable products designed for demanding environments.',
      bullets: [
        'High performance: 130 to 180 lm/W depending on range',
        'Robust: IP65 / IK07+ depending on models',
        'Suitable for heights: 4 m to 15 m+',
      ],
      ctaPrimary: 'View luminaires',
      ctaSecondary: 'Request a quote',
    },
    trustBar: {
      items: ['Pro quality', 'Technical advice', 'Delivery & tracking'],
    },
    products: {
      title: 'Our most requested luminaires',
      seeAll: 'View full catalog',
    },
    guide: {
      title: 'How to choose an industrial luminaire?',
      items: [
        {
          title: 'Ceiling height',
          description: 'Determines optical choice: spotlight for height > 8m, panel for < 6m.',
        },
        {
          title: 'Target lux level',
          description: 'Lighting objective according to activity: 200-300 lux logistics, 500+ lux offices.',
        },
        {
          title: 'Environment',
          description: 'IP65 for wet areas, IK10 for mechanical shocks. Select according to your constraints.',
        },
        {
          title: 'Usage',
          description: 'Presence detection and dimming to optimize consumption. Compatible depending on models.',
        },
      ],
    },
    sectors: {
      title: 'For which sectors?',
      items: [
        {
          title: 'Industrial',
          description: 'Warehouses, logistics, production',
        },
        {
          title: 'Tertiary',
          description: 'Offices, retail, parking lots',
        },
        {
          title: 'Agricultural',
          description: 'Livestock, sheds, greenhouses',
        },
      ],
    },
    cta: {
      title: 'Do you have a project? We recommend the right range.',
      ctaPrimary: 'Add to cart',
      ctaSecondary: 'Request a quote',
    },
  },
};

export default async function LuminairePage({ params }: LuminairePageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const products = await getProductsByCategorySlug(lang, 'luminaire');
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
              <Link href={`/${lang}/products?category=luminaire`}>
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
            <Link href={`/${lang}/cart`}>
              <Button variant="primary" className="bg-[#10B981] hover:bg-[#059669] w-full sm:w-auto">
                {content.cta.ctaPrimary}
              </Button>
            </Link>
            <Link href="#contact">
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
