import { notFound } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang, Dictionary } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ContactFormSection from '@/components/ContactFormSection';

interface SolutionPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Mapping des slugs vers les clés dans le dictionnaire
const slugToSolutionKey: Record<string, 'lighting' | 'air' | 'energy' | 'charge'> = {
  luminaire: 'lighting',
  ventilation: 'air',
  irve: 'charge',
  etude: 'energy',
};

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { lang, slug } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const solutionKey = slugToSolutionKey[slug];
  if (!solutionKey) {
    notFound();
  }

  const dict = getDictionary(lang);
  const solution = dict.solutions[solutionKey];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6">
              {solution.title}
            </h1>
            <p className="text-xl text-[#4B5563] mb-8 leading-relaxed">
              {solution.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${lang}/contact`}>
                <Button variant="default" className="bg-[#10B981] hover:bg-[#059669]">
                  {dict.hero.ctaPrimary}
                </Button>
              </Link>
              <Link href={`/${lang}/solutions/luminaire`}>
                <Button variant="secondary">
                  {dict.nav.solutions}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu détaillé */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">
                  {lang === 'fr' && 'En savoir plus'}
                  {lang === 'en' && 'Learn more'}
                  {lang === 'ar' && 'اعرف المزيد'}
                </h2>
                <div className="prose prose-lg max-w-none text-[#4B5563]">
                  <p className="mb-4">
                    {lang === 'fr' && 'Découvrez comment notre expertise peut transformer votre bâtiment et réduire significativement votre consommation énergétique.'}
                    {lang === 'en' && 'Discover how our expertise can transform your building and significantly reduce your energy consumption.'}
                    {lang === 'ar' && 'اكتشف كيف يمكن لخبرتنا تحويل مبناك وتقليل استهلاك الطاقة بشكل كبير.'}
                  </p>
                  <p className="mb-4">
                    {lang === 'fr' && 'Nos solutions sont adaptées à vos besoins spécifiques et vous accompagnent de l\'audit à l\'installation.'}
                    {lang === 'en' && 'Our solutions are tailored to your specific needs and support you from audit to installation.'}
                    {lang === 'ar' && 'حلولنا مصممة خصيصًا لاحتياجاتك ونرافقك من التدقيق إلى التركيب.'}
                  </p>
                </div>
              </Card>

              <Card>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">
                  {lang === 'fr' && 'Avantages'}
                  {lang === 'en' && 'Benefits'}
                  {lang === 'ar' && 'المزايا'}
                </h2>
                <ul className="space-y-3 text-[#4B5563]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#10B981] mt-1">✓</span>
                    <span>
                      {lang === 'fr' && 'Réduction significative de la consommation énergétique'}
                      {lang === 'en' && 'Significant reduction in energy consumption'}
                      {lang === 'ar' && 'تقليل كبير في استهلاك الطاقة'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#10B981] mt-1">✓</span>
                    <span>
                      {lang === 'fr' && 'Amélioration du confort et de la qualité de vie'}
                      {lang === 'en' && 'Improved comfort and quality of life'}
                      {lang === 'ar' && 'تحسين الراحة وجودة الحياة'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#10B981] mt-1">✓</span>
                    <span>
                      {lang === 'fr' && 'Solutions durables et respectueuses de l\'environnement'}
                      {lang === 'en' && 'Sustainable and environmentally friendly solutions'}
                      {lang === 'ar' && 'حلول مستدامة وصديقة للبيئة'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#10B981] mt-1">✓</span>
                    <span>
                      {lang === 'fr' && 'Accompagnement complet du projet'}
                      {lang === 'en' && 'Complete project support'}
                      {lang === 'ar' && 'دعم كامل للمشروع'}
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Colonne formulaire */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ContactFormSection lang={lang} dict={dict} compact={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#111827] mb-4">
            {lang === 'fr' && 'Prêt à démarrer votre projet ?'}
            {lang === 'en' && 'Ready to start your project?'}
            {lang === 'ar' && 'هل أنت مستعد لبدء مشروعك؟'}
          </h2>
          <p className="text-lg text-[#4B5563] mb-8">
            {lang === 'fr' && 'Contactez-nous dès aujourd\'hui pour une estimation gratuite'}
            {lang === 'en' && 'Contact us today for a free estimate'}
            {lang === 'ar' && 'اتصل بنا اليوم للحصول على تقدير مجاني'}
          </p>
          <Link href={`/${lang}/contact`}>
            <Button variant="default" className="bg-[#10B981] hover:bg-[#059669]">
              {dict.hero.ctaPrimary}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

