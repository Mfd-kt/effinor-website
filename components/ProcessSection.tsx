import { Dictionary } from '@/types';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/card';

interface ProcessSectionProps {
  dict: Dictionary;
}

export default function ProcessSection({ dict }: ProcessSectionProps) {
  const steps = [
    {
      number: '1',
      title: dict.process.step1.title,
      description: dict.process.step1.description,
    },
    {
      number: '2',
      title: dict.process.step2.title,
      description: dict.process.step2.description,
    },
    {
      number: '3',
      title: dict.process.step3.title,
      description: dict.process.step3.description,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F9FAFB]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle center>
          {dict.process.title}
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="text-center">
              <div className="w-16 h-16 bg-[#10B981] text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {step.title}
              </h3>
              <p className="text-[#4B5563] text-sm leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
