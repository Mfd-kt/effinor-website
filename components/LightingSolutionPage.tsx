import { Lang, Dictionary } from '@/types';
import { Product } from '@/lib/products';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ContactFormSection from './ContactFormSection';
import { Category } from '@/lib/categories';
import ProductCard from './products/ProductCard';

interface LightingSolutionPageProps {
  lang: Lang;
  dict: Dictionary;
  products: Product[];
  categories: Category[];
}

export default function LightingSolutionPage({
  lang,
  dict,
  products,
  categories,
}: LightingSolutionPageProps) {
  const isRTL = lang === 'ar';
  const detail = dict.solutions.lightingDetail;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6">
              {detail.heroTitle}
            </h1>
            <p className="text-xl text-[#4B5563] mb-8 leading-relaxed">
              {detail.heroSubtitle}
            </p>
            <Link href="#contact">
              <Button variant="primary" className="bg-[#10B981] hover:bg-[#059669]">
                {detail.ctaButton}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section "Pour quels bâtiments ?" */}
      <section className="py-16 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-12 text-center">
            {detail.buildingsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Industriel */}
            <Card>
              <h3 className="text-xl font-bold text-[#111827] mb-4">
                {detail.buildingsIndustrial.title}
              </h3>
              <ul className="space-y-2 text-[#4B5563]">
                {detail.buildingsIndustrial.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Tertiaire */}
            <Card>
              <h3 className="text-xl font-bold text-[#111827] mb-4">
                {detail.buildingsTertiary.title}
              </h3>
              <ul className="space-y-2 text-[#4B5563]">
                {detail.buildingsTertiary.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Agricole */}
            <Card>
              <h3 className="text-xl font-bold text-[#111827] mb-4">
                {detail.buildingsAgricultural.title}
              </h3>
              <ul className="space-y-2 text-[#4B5563]">
                {detail.buildingsAgricultural.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Section "Pourquoi moderniser ?" */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-12 text-center">
            {detail.benefitsTitle}
          </h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              {detail.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#10B981] text-sm font-bold">✓</span>
                  </div>
                  <p className="text-lg text-[#4B5563]">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section "Notre accompagnement" */}
      <section className="py-16 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-12 text-center">
            {detail.processTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="w-12 h-12 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xl font-extrabold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {detail.processSteps.step1.title}
              </h3>
              <p className="text-[#4B5563] text-sm leading-relaxed">
                {detail.processSteps.step1.description}
              </p>
            </Card>

            <Card>
              <div className="w-12 h-12 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xl font-extrabold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {detail.processSteps.step2.title}
              </h3>
              <p className="text-[#4B5563] text-sm leading-relaxed">
                {detail.processSteps.step2.description}
              </p>
            </Card>

            <Card>
              <div className="w-12 h-12 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xl font-extrabold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {detail.processSteps.step3.title}
              </h3>
              <p className="text-[#4B5563] text-sm leading-relaxed">
                {detail.processSteps.step3.description}
              </p>
            </Card>

            <Card>
              <div className="w-12 h-12 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xl font-extrabold mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {detail.processSteps.step4.title}
              </h3>
              <p className="text-[#4B5563] text-sm leading-relaxed">
                {detail.processSteps.step4.description}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section "Exemples de produits" */}
      {products.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-12 text-center">
              {detail.productsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section CTA avec formulaire */}
      <section id="contact" className="py-16 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4">
              {detail.ctaTitle}
            </h2>
            <p className="text-lg text-[#4B5563]">
              {detail.ctaSubtitle}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ContactFormSection lang={lang} dict={dict} categories={categories} />
          </div>
        </div>
      </section>
    </div>
  );
}

