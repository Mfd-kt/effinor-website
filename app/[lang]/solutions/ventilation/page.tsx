import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { getProductsByCategorySlug } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { Lang } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ProductCard from '@/components/products/ProductCard';
import ProductTypeFilter from '@/components/products/ProductTypeFilter';
import ContactFormSection from '@/components/ContactFormSection';
import { Check, Package, Headphones, Truck } from 'lucide-react';

interface VentilationPageProps {
  params: Promise<{ lang: string }>;
}

// Contenu spécifique à la page Ventilation
const pageContent = {
  fr: {
    hero: {
      title: 'Ventilation et destratification — Solutions pour bâtiments industriels et tertiaires',
      subtitle: 'Optimisation de la qualité de l\'air et du confort thermique. Des systèmes performants pour tous types de bâtiments.',
      bullets: [
        'Performance énergétique : réduction des pertes thermiques',
        'Qualité de l\'air : renouvellement et filtration optimisés',
        'Installation : solutions adaptées à vos contraintes',
      ],
      ctaPrimary: 'Voir les produits',
      ctaSecondary: 'Demander un devis',
    },
    trustBar: {
      items: ['Qualité pro', 'Conseil technique', 'Livraison & suivi'],
    },
    products: {
      title: 'Nos solutions ventilation les plus demandées',
      seeAll: 'Voir tout le catalogue',
    },
    guide: {
      title: 'Comment choisir votre système de ventilation ?',
      items: [
        {
          title: 'Volume du local',
          description: 'Détermine le débit d\'air nécessaire et le dimensionnement des équipements.',
        },
        {
          title: 'Usages et contraintes',
          description: 'Renouvellement d\'air, traitement de l\'humidité, récupération de chaleur selon vos besoins.',
        },
        {
          title: 'Type de bâtiment',
          description: 'Industriel, tertiaire, agricole : chaque environnement nécessite des solutions adaptées.',
        },
        {
          title: 'Performance énergétique',
          description: 'Récupération de chaleur, régulation intelligente pour optimiser la consommation.',
        },
      ],
    },
    sectors: {
      title: 'Pour quels secteurs ?',
      items: [
        {
          title: 'Industriel',
          description: 'Ateliers, usines, entrepôts',
        },
        {
          title: 'Tertiaire',
          description: 'Bureaux, commerces, parkings',
        },
        {
          title: 'Agricole',
          description: 'Élevage, serres, bâtiments agricoles',
        },
      ],
    },
    cta: {
      title: 'Vous avez un projet ? On vous recommande la bonne solution.',
      ctaPrimary: 'Ajouter au panier',
      ctaSecondary: 'Demander un devis',
    },
  },
  ar: {
    hero: {
      title: 'التهوية وتوزيع الهواء — حلول للمباني الصناعية والتجارية',
      subtitle: 'تحسين جودة الهواء والراحة الحرارية. أنظمة عالية الأداء لجميع أنواع المباني.',
      bullets: [
        'كفاءة الطاقة: تقليل فقدان الحرارة',
        'جودة الهواء: تجديد وترشيح محسّنان',
        'التركيب: حلول متكيفة مع قيودكم',
      ],
      ctaPrimary: 'عرض المنتجات',
      ctaSecondary: 'طلب عرض سعر',
    },
    trustBar: {
      items: ['جودة احترافية', 'دعم تقني', 'تسليم ومتابعة'],
    },
    products: {
      title: 'أكثر حلول التهوية طلباً',
      seeAll: 'عرض الكتالوج الكامل',
    },
    guide: {
      title: 'كيف تختار نظام التهوية المناسب؟',
      items: [
        {
          title: 'حجم المكان',
          description: 'يحدد معدل تدفق الهواء المطلوب وتصميم المعدات.',
        },
        {
          title: 'الاستخدامات والقيود',
          description: 'تجديد الهواء ومعالجة الرطوبة واستعادة الحرارة حسب احتياجاتكم.',
        },
        {
          title: 'نوع المبنى',
          description: 'صناعي، تجاري، زراعي: كل بيئة تحتاج حلولاً مناسبة.',
        },
        {
          title: 'كفاءة الطاقة',
          description: 'استعادة الحرارة والتحكم الذكي لتحسين الاستهلاك.',
        },
      ],
    },
    sectors: {
      title: 'لماذا القطاعات؟',
      items: [
        {
          title: 'صناعي',
          description: 'ورش، مصانع، مستودعات',
        },
        {
          title: 'تجاري',
          description: 'مكاتب، متاجر، مواقف سيارات',
        },
        {
          title: 'زراعي',
          description: 'تربية حيوانات، صوب، مباني زراعية',
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
      title: 'Ventilation and destratification — Solutions for industrial and tertiary buildings',
      subtitle: 'Optimization of air quality and thermal comfort. High-performance systems for all types of buildings.',
      bullets: [
        'Energy performance: reduced heat loss',
        'Air quality: optimized renewal and filtration',
        'Installation: solutions adapted to your constraints',
      ],
      ctaPrimary: 'View products',
      ctaSecondary: 'Request a quote',
    },
    trustBar: {
      items: ['Pro quality', 'Technical advice', 'Delivery & tracking'],
    },
    products: {
      title: 'Our most requested ventilation solutions',
      seeAll: 'View full catalog',
    },
    guide: {
      title: 'How to choose your ventilation system?',
      items: [
        {
          title: 'Room volume',
          description: 'Determines the required air flow rate and equipment sizing.',
        },
        {
          title: 'Uses and constraints',
          description: 'Air renewal, humidity treatment, heat recovery according to your needs.',
        },
        {
          title: 'Building type',
          description: 'Industrial, tertiary, agricultural: each environment requires adapted solutions.',
        },
        {
          title: 'Energy performance',
          description: 'Heat recovery, intelligent regulation to optimize consumption.',
        },
      ],
    },
    sectors: {
      title: 'For which sectors?',
      items: [
        {
          title: 'Industrial',
          description: 'Workshops, factories, warehouses',
        },
        {
          title: 'Tertiary',
          description: 'Offices, retail, parking lots',
        },
        {
          title: 'Agricultural',
          description: 'Livestock, greenhouses, agricultural buildings',
        },
      ],
    },
    cta: {
      title: 'Do you have a project? We recommend the right solution.',
      ctaPrimary: 'Add to cart',
      ctaSecondary: 'Request a quote',
    },
  },
};

export default async function VentilationPage({ params }: VentilationPageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const products = await getProductsByCategorySlug(lang, 'ventilation');
  const categories = await getCategories(lang);
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
                  <Button variant="secondary" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                    {content.hero.ctaSecondary}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Colonne droite : Formulaire compact */}
            <div className={isRTL ? 'lg:col-start-1 lg:row-start-1' : ''}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <ContactFormSection lang={lang} dict={dict} categories={categories} compact={true} />
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
              <Link href={`/${lang}/products?category=ventilation`}>
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
              <Button variant="secondary" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                {content.cta.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Formulaire contact final */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ContactFormSection lang={lang} dict={dict} categories={categories} />
        </div>
      </section>
    </div>
  );
}
