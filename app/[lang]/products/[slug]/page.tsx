import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { getProductDetailBySlug, getProductsByCategorySlug, type ProductDetail } from '@/lib/products';
import { getPriceLabel } from '@/lib/pricing';
import { Lang } from '@/types';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import ProductGallery from '@/components/products/ProductGallery';
import ProductCard from '@/components/products/ProductCard';
import ProductPurchaseBox from '@/components/products/ProductPurchaseBox';
import { ChevronRight, Download, Shield } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isValidLang(lang)) {
    return {};
  }

  const product = await getProductDetailBySlug(lang as Lang, slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | Effinor`,
    description: product.shortDescription || product.name,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { lang, slug } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const typedLang = lang as Lang;
  const dict = getDictionary(typedLang);
  const product = await getProductDetailBySlug(typedLang, slug);
  const isRTL = typedLang === 'ar';

  if (!product) {
    notFound();
  }

  // Récupérer les produits similaires
  const allCategoryProducts = await getProductsByCategorySlug(typedLang, product.categorySlug);
  const relatedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const priceLabel = getPriceLabel(product, typedLang);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#4B5563] mb-8" aria-label="Breadcrumb">
          <Link href={`/${typedLang}`} className="hover:text-[#10B981] transition-colors">
            {dict.breadcrumb.home}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${typedLang}/products?category=${product.categorySlug}`} className="hover:text-[#10B981] transition-colors">
            {dict.breadcrumb.products}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${typedLang}/products?category=${product.categorySlug}`} className="hover:text-[#10B981] transition-colors">
            {product.categoryName}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#111827] font-medium">{product.name}</span>
        </nav>

        {/* Layout 2 colonnes */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16 ${
            isRTL ? 'lg:grid-flow-dense' : ''
          }`}
        >
          {/* Colonne gauche : Galerie (60%) */}
          <div className={`lg:col-span-3 ${isRTL ? 'lg:col-start-3' : ''}`}>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Colonne droite : Zone d'achat (40%) */}
          <div className={`lg:col-span-2 ${isRTL ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            <Card className="sticky top-24" padding="md">
              {/* Badge catégorie */}
              <Badge variant="emerald" className="mb-4">
                {product.categoryName}
              </Badge>

              {/* Nom produit */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4">
                {product.name}
              </h1>

              {/* Prix */}
              <div className="mb-6">
                <p className="text-sm text-[#4B5563] mb-1">{dict.product.priceHtLabel}</p>
                <p
                  className={`text-3xl font-bold ${
                    priceLabel.isQuoteOnly ? 'text-[#4B5563]' : 'text-[#10B981]'
                  }`}
                >
                  {priceLabel.label}
                </p>
              </div>

              {/* CTA principal */}
              <div className="mb-6">
                <ProductPurchaseBox product={product} lang={typedLang} dict={dict} />
              </div>

              {/* Infos rapides */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                {product.warrantyYears && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[#4B5563]">
                      {dict.product.warranty}: {product.warrantyYears} {typedLang === 'fr' ? 'ans' : typedLang === 'en' ? 'years' : 'سنوات'}
                    </span>
                  </div>
                )}
                {product.ipRating && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#111827]">IP:</span>
                    <span className="text-[#4B5563]">{product.ipRating}</span>
                  </div>
                )}
                {product.ikRating && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#111827]">IK:</span>
                    <span className="text-[#4B5563]">{product.ikRating}</span>
                  </div>
                )}
                {product.powerW && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#111827]">
                      {typedLang === 'fr' ? 'Puissance' : typedLang === 'en' ? 'Power' : 'القدرة'}:
                    </span>
                    <span className="text-[#4B5563]">{product.powerW} W</span>
                  </div>
                )}
                {product.luminousFluxLm && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#111827]">
                      {typedLang === 'fr' ? 'Flux lumineux' : typedLang === 'en' ? 'Luminous flux' : 'التدفق الضوئي'}:
                    </span>
                    <span className="text-[#4B5563]">
                      {product.luminousFluxLm.toLocaleString(typedLang === 'fr' ? 'fr-FR' : typedLang === 'en' ? 'en-US' : 'ar-TN')} lm
                    </span>
                  </div>
                )}
                {product.efficiencyLmPerW && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#111827]">
                      {typedLang === 'fr' ? 'Efficacité' : typedLang === 'en' ? 'Efficiency' : 'الكفاءة'}:
                    </span>
                    <span className="text-[#4B5563]">{product.efficiencyLmPerW.toFixed(0)} lm/W</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Section Points forts */}
        {product.features && product.features.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-6">
              {dict.product.featuresTitle}
            </h2>
            <Card className="p-6">
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-[#4B5563]">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        {/* Section Description */}
        {product.longDescription && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-6">
              {dict.product.descriptionTitle}
            </h2>
            <Card className="p-6">
              <div
                className="prose prose-sm max-w-none text-[#4B5563]"
                dangerouslySetInnerHTML={{ __html: product.longDescription.replace(/\n/g, '<br />') }}
              />
            </Card>
          </section>
        )}

        {/* Section Caractéristiques techniques */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-6">
            {dict.product.specsTitle}
          </h2>
          <Card className="p-0 overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.powerW && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-[#F3F4F6] w-1/3">
                      {typedLang === 'fr' ? 'Puissance' : typedLang === 'en' ? 'Power' : 'القدرة'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.powerW} W</td>
                  </tr>
                )}
                {product.luminousFluxLm && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">
                      {typedLang === 'fr' ? 'Flux lumineux' : typedLang === 'en' ? 'Luminous flux' : 'التدفق الضوئي'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">
                      {product.luminousFluxLm.toLocaleString(typedLang === 'fr' ? 'fr-FR' : typedLang === 'en' ? 'en-US' : 'ar-TN')} lm
                    </td>
                  </tr>
                )}
                {product.efficiencyLmPerW && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">
                      {typedLang === 'fr' ? 'Efficacité' : typedLang === 'en' ? 'Efficiency' : 'الكفاءة'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.efficiencyLmPerW.toFixed(0)} lm/W</td>
                  </tr>
                )}
                {product.cri && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">CRI</td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.cri}</td>
                  </tr>
                )}
                {(product.cctMin || product.cctMax) && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">CCT</td>
                    <td className="px-6 py-4 text-[#4B5563]">
                      {product.cctMin && product.cctMax
                        ? `${product.cctMin}K - ${product.cctMax}K`
                        : product.cctMin
                        ? `${product.cctMin}K`
                        : `${product.cctMax}K`}
                    </td>
                  </tr>
                )}
                {product.ipRating && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">IP</td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.ipRating}</td>
                  </tr>
                )}
                {product.ikRating && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">IK</td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.ikRating}</td>
                  </tr>
                )}
                {product.voltage && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">
                      {typedLang === 'fr' ? 'Tension' : typedLang === 'en' ? 'Voltage' : 'الجهد'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.voltage}</td>
                  </tr>
                )}
                {product.dimensionsMm && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">
                      {typedLang === 'fr' ? 'Dimensions' : typedLang === 'en' ? 'Dimensions' : 'الأبعاد'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.dimensionsMm}</td>
                  </tr>
                )}
                {product.weightKg && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">
                      {typedLang === 'fr' ? 'Poids' : typedLang === 'en' ? 'Weight' : 'الوزن'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.weightKg} kg</td>
                  </tr>
                )}
                {product.operatingTemp && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">
                      {typedLang === 'fr' ? 'Température de fonctionnement' : typedLang === 'en' ? 'Operating temperature' : 'درجة حرارة التشغيل'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.operatingTemp}</td>
                  </tr>
                )}
                {product.lifetimeHours && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">
                      {typedLang === 'fr' ? 'Durée de vie' : typedLang === 'en' ? 'Lifetime' : 'العمر الافتراضي'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">
                      {product.lifetimeHours.toLocaleString(typedLang === 'fr' ? 'fr-FR' : typedLang === 'en' ? 'en-US' : 'ar-TN')} h
                    </td>
                  </tr>
                )}
                {product.certifications && product.certifications.length > 0 && (
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">
                      {typedLang === 'fr' ? 'Certifications' : typedLang === 'en' ? 'Certifications' : 'الشهادات'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">{product.certifications.join(', ')}</td>
                  </tr>
                )}
                {/* Specs depuis JSONB */}
                {product.specs &&
                  Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-200">
                      <td className="px-6 py-4 font-medium text-[#111827] bg-gray-50">{key}</td>
                      <td className="px-6 py-4 text-[#4B5563]">{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </section>

        {/* Section Documents */}
        {product.datasheetUrl && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-6">
              {dict.product.documentsTitle}
            </h2>
            <Card className="p-6">
              <a
                href={product.datasheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#10B981] hover:text-[#059669] font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                {dict.product.downloadDatasheet}
              </a>
            </Card>
          </section>
        )}

        {/* Section Produits similaires */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-6">
              {dict.product.relatedTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} lang={typedLang} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}






