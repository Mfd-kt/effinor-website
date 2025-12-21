import Link from 'next/link';
import { Lang, Dictionary } from '@/types';

interface HeroProps {
  lang: Lang;
  dict: Dictionary;
}

import { Button } from '@/components/ui/Button';

export default function Hero({ lang, dict }: HeroProps) {
  return (
    <section className="effinor-gradient text-white py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {dict.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${lang}/contact`}>
              <Button variant="primary" className="bg-[#10B981] hover:bg-[#059669]">
                {dict.hero.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${lang}/solutions/luminaire`}>
              <Button variant="secondary" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                {dict.hero.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
