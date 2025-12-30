import Link from 'next/link';
import { Lang, Dictionary } from '@/types';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/card';

interface SolutionsSectionProps {
  lang: Lang;
  dict: Dictionary;
}

export default function SolutionsSection({ lang, dict }: SolutionsSectionProps) {
  const solutions = [
    {
      slug: 'luminaire',
      title: dict.solutions.lighting.title,
      description: dict.solutions.lighting.description,
      learnMore: dict.solutions.lighting.learnMore,
      icon: '💡',
    },
    {
      slug: 'ventilation',
      title: dict.solutions.air.title,
      description: dict.solutions.air.description,
      learnMore: dict.solutions.air.learnMore,
      icon: '🌬️',
    },
    {
      slug: 'etude',
      title: dict.solutions.energy.title,
      description: dict.solutions.energy.description,
      learnMore: dict.solutions.energy.learnMore,
      icon: '⚡',
    },
    {
      slug: 'irve',
      title: dict.solutions.charge.title,
      description: dict.solutions.charge.description,
      learnMore: dict.solutions.charge.learnMore,
      icon: '🔌',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F9FAFB]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle center subtitle={dict.solutions.subtitle}>
          {dict.solutions.title}
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{solution.icon}</div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {solution.title}
              </h3>
              <p className="text-[#4B5563] mb-4 text-sm leading-relaxed">
                {solution.description}
              </p>
              <Link
                href={`/${lang}/solutions/${solution.slug}`}
                className="text-[#10B981] font-medium hover:text-[#059669] transition-colors inline-flex items-center gap-1"
              >
                {solution.learnMore} →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
