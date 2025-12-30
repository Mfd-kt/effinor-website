import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { getProductsByCategorySlug } from '@/lib/products';
import { Lang } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ProductCard from '@/components/products/ProductCard';
import ProductTypeFilter from '@/components/products/ProductTypeFilter';
import ContactFormSection from '@/components/ContactFormSection';
import { Check, Package, Headphones, Truck } from 'lucide-react';

interface IrvePageProps {
  params: Promise<{ lang: string }>;
}

// Contenu spécifique à la page IRVE
const pageContent = {
  fr: {
    hero: {
      title: 'Bornes de recharge IRVE — Pour véhicules électriques en entreprise',
      subtitle: 'Installation, mise en service et maintenance de stations de recharge. Solutions adaptées aux besoins professionnels.',
      bullets: [
        'Puissances variées : 7,4 kW à 22 kW et plus',
        'Conformité IRVE : normes et certifications',
        'Installation complète : de l\'étude à la mise en service',
      ],
      ctaPrimary: 'Voir les bornes',
      ctaSecondary: 'Demander un devis',
    },
    trustBar: {
      items: ['Qualité pro', 'Conseil technique', 'Installation & suivi'],
    },
    products: {
      title: 'Nos bornes de recharge les plus demandées',
      seeAll: 'Voir tout le catalogue',
    },
    guide: {
      title: 'Comment choisir une borne de recharge IRVE ?',
      items: [
        {
          title: 'Puissance nécessaire',
          description: '7,4 kW pour usage occasionnel, 11-22 kW pour recharge rapide, 50+ kW pour usage intensif.',
        },
        {
          title: 'Nombre de véhicules',
          description: 'Détermine le nombre de points de charge et l\'infrastructure électrique requise.',
        },
        {
          title: 'Usage et accessibilité',
          description: 'Borne privée, publique, gestion d\'accès, facturation : besoins spécifiques à définir.',
        },
        {
          title: 'Conformité et normes',
          description: 'IRVE certifiée, compatible avec tous les véhicules électriques standards.',
        },
      ],
    },
    sectors: {
      title: 'Pour quels besoins ?',
      items: [
        {
          title: 'Entreprises',
          description: 'Flottes de véhicules, parkings privés',
        },
        {
          title: 'Tertiaire',
          description: 'Centres commerciaux, bureaux',
        },
        {
          title: 'Collectivités',
          description: 'Parkings publics, services municipaux',
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
      title: 'محطات شحن IRVE — للمركبات الكهربائية في المؤسسات',
      subtitle: 'التركيب والتشغيل والصيانة لمحطات الشحن. حلول متكيفة مع الاحتياجات المهنية.',
      bullets: [
        'قدرات متنوعة: من 7.4 كيلوواط إلى 22 كيلوواط وأكثر',
        'توافق IRVE: المعايير والشهادات',
        'تركيب كامل: من الدراسة إلى التشغيل',
      ],
      ctaPrimary: 'عرض المحطات',
      ctaSecondary: 'طلب عرض سعر',
    },
    trustBar: {
      items: ['جودة احترافية', 'دعم تقني', 'تركيب ومتابعة'],
    },
    products: {
      title: 'أكثر محطات الشحن طلباً',
      seeAll: 'عرض الكتالوج الكامل',
    },
    guide: {
      title: 'كيف تختار محطة شحن IRVE؟',
      items: [
        {
          title: 'القدرة المطلوبة',
          description: '7.4 كيلوواط للاستخدام العرضي، 11-22 كيلوواط للشحن السريع، 50+ كيلوواط للاستخدام المكثف.',
        },
        {
          title: 'عدد المركبات',
          description: 'يحدد عدد نقاط الشحن والبنية التحتية الكهربائية المطلوبة.',
        },
        {
          title: 'الاستخدام وإمكانية الوصول',
          description: 'محطة خاصة، عامة، إدارة الوصول، الفوترة: احتياجات محددة يجب تحديدها.',
        },
        {
          title: 'التوافق والمعايير',
          description: 'IRVE معتمدة، متوافقة مع جميع المركبات الكهربائية القياسية.',
        },
      ],
    },
    sectors: {
      title: 'لماذا الاحتياجات؟',
      items: [
        {
          title: 'المؤسسات',
          description: 'أساطيل المركبات، مواقف خاصة',
        },
        {
          title: 'تجاري',
          description: 'مراكز تسوق، مكاتب',
        },
        {
          title: 'جماعية',
          description: 'مواقف عامة، خدمات بلدية',
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
      title: 'IRVE charging stations — For electric vehicles in business',
      subtitle: 'Installation, commissioning and maintenance of charging stations. Solutions adapted to professional needs.',
      bullets: [
        'Various powers: 7.4 kW to 22 kW and more',
        'IRVE compliance: standards and certifications',
        'Complete installation: from study to commissioning',
      ],
      ctaPrimary: 'View charging stations',
      ctaSecondary: 'Request a quote',
    },
    trustBar: {
      items: ['Pro quality', 'Technical advice', 'Installation & tracking'],
    },
    products: {
      title: 'Our most requested charging stations',
      seeAll: 'View full catalog',
    },
    guide: {
      title: 'How to choose an IRVE charging station?',
      items: [
        {
          title: 'Required power',
          description: '7.4 kW for occasional use, 11-22 kW for fast charging, 50+ kW for intensive use.',
        },
        {
          title: 'Number of vehicles',
          description: 'Determines the number of charging points and required electrical infrastructure.',
        },
        {
          title: 'Usage and accessibility',
          description: 'Private station, public, access management, billing: specific needs to define.',
        },
        {
          title: 'Compliance and standards',
          description: 'IRVE certified, compatible with all standard electric vehicles.',
        },
      ],
    },
    sectors: {
      title: 'For which needs?',
      items: [
        {
          title: 'Businesses',
          description: 'Vehicle fleets, private parking',
        },
        {
          title: 'Tertiary',
          description: 'Shopping centers, offices',
        },
        {
          title: 'Communities',
          description: 'Public parking, municipal services',
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

export default async function IrvePage({ params }: IrvePageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const products = await getProductsByCategorySlug(lang, 'irve');
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
              <Link href={`/${lang}/products?category=irve`}>
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
