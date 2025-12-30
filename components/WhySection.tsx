import { Dictionary } from '@/types';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/card';

interface WhySectionProps {
  dict: Dictionary;
}

export default function WhySection({ dict }: WhySectionProps) {
  const reasons = [
    {
      title: dict.why.expertise.title,
      description: dict.why.expertise.description,
      icon: '🎯',
    },
    {
      title: dict.why.cee.title,
      description: dict.why.cee.description,
      icon: '📋',
    },
    {
      title: dict.why.turnkey.title,
      description: dict.why.turnkey.description,
      icon: '🔑',
    },
    {
      title: dict.why.support.title,
      description: dict.why.support.description,
      icon: '🛠️',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle center>
          {dict.why.title}
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <Card key={index} className="text-center">
              <div className="text-5xl mb-4">{reason.icon}</div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {reason.title}
              </h3>
              <p className="text-[#4B5563] text-sm leading-relaxed">
                {reason.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
