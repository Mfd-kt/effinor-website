import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { getProductsByCategorySlug } from '@/lib/products';
import { Lang } from '@/types';
import { SectionTitle } from '@/components/ui/SectionTitle';
import ProductCard from '@/components/products/ProductCard';
import ProductTypeFilter from '@/components/products/ProductTypeFilter';

interface ProductsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { lang } = await params;
  const { category } = await searchParams;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  // Si category est spécifié, charger les produits de cette catégorie
  // Sinon, charger tous les produits (ou une catégorie par défaut)
  const categorySlug = category || 'luminaire';
  const products = await getProductsByCategorySlug(lang, categorySlug);

  const titles = {
    luminaire: {
      fr: 'Catalogue luminaires',
      en: 'Lighting catalog',
      ar: 'كتالوج الإضاءة',
    },
    ventilation: {
      fr: 'Catalogue ventilation',
      en: 'Ventilation catalog',
      ar: 'كتالوج التهوية',
    },
    irve: {
      fr: 'Catalogue bornes de recharge',
      en: 'Charging stations catalog',
      ar: 'كتالوج محطات الشحن',
    },
    etude: {
      fr: 'Catalogue études',
      en: 'Studies catalog',
      ar: 'كتالوج الدراسات',
    },
  };

  const title = titles[categorySlug as keyof typeof titles]?.[lang] || titles.luminaire[lang];

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle center>
          {title}
        </SectionTitle>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#4B5563]">
              {lang === 'fr' && 'Aucun produit disponible pour le moment.'}
              {lang === 'en' && 'No products available at the moment.'}
              {lang === 'ar' && 'لا توجد منتجات متاحة في الوقت الحالي.'}
            </p>
          </div>
        ) : (
          <div className="mt-12">
            <ProductTypeFilter products={products} lang={lang} />
          </div>
        )}
      </div>
    </div>
  );
}

