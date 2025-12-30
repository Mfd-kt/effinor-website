import { notFound, redirect } from 'next/navigation';
import { isValidLang, getDictionary } from '@/lib/i18n';
import { Lang } from '@/types';
import { createSupabaseClient } from '@/lib/supabaseClient';
import DetailedFormWizard from '@/components/forms/DetailedFormWizard';
import { PartialDetailedFormData } from '@/types/detailed-form';
import type { Metadata } from 'next';

interface FormulairePageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ leadId?: string }>;
}

export async function generateMetadata({ params }: FormulairePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    return {
      title: 'Formulaire détaillé',
    };
  }

  return {
    title: 'Formulaire détaillé - Effinor',
    description: 'Complétez les informations pour obtenir une estimation personnalisée',
  };
}

export default async function FormulairePage({ params, searchParams }: FormulairePageProps) {
  const { lang } = await params;
  const { leadId } = await searchParams;

  if (!isValidLang(lang)) {
    notFound();
  }

  const validLang = lang as Lang;
  const dict = getDictionary(validLang);

  // Si pas de leadId, rediriger vers la page d'accueil
  if (!leadId) {
    redirect(`/${validLang}`);
  }

  // Charger les données du lead depuis Supabase
  let initialData: PartialDetailedFormData | undefined;
  try {
    const supabase = createSupabaseClient();
    const { data: lead, error } = await supabase
      .from('leads')
      .select('id, name, email, phone, company, building_type, surface_m2, detailed_form_data, siret_number, headquarters_address, headquarters_postcode, headquarters_city, beneficiary_title, beneficiary_last_name, beneficiary_first_name, beneficiary_function, beneficiary_phone, beneficiary_email, annual_expense_range, building_count')
      .eq('id', leadId)
      .single();

    if (error || !lead) {
      console.error('Error loading lead:', error);
      redirect(`/${validLang}`);
    }

    // Charger les données depuis les colonnes (étapes 1-4) et le JSON (étape 5)
    const nameParts = (lead.name || '').split(' ');
    const firstName = lead.beneficiary_first_name || nameParts[0] || '';
    const lastName = lead.beneficiary_last_name || nameParts.slice(1).join(' ') || '';

    // Charger les bâtiments depuis detailed_form_data ou créer un par défaut
    let buildings: any[] = [];
    if (lead.detailed_form_data && (lead.detailed_form_data as any).buildings) {
      buildings = (lead.detailed_form_data as any).buildings;
    } else {
      // Créer un bâtiment par défaut
      const buildingCount = lead.building_count || 1;
      buildings = Array.from({ length: buildingCount }, () => ({
        general: {
          type: (() => {
            const bt = lead.building_type;
            if (bt === 'entrepot-logistique') return 'entrepot';
            if (bt === 'bureau') return 'bureau';
            if (bt === 'usine-production') return 'usine';
            if (bt === 'commerce-retail') return 'commerce';
            if (bt === 'autre-batiment') return 'autre';
            return 'entrepot';
          })(),
          surface: lead.surface_m2 || 0,
          height: null,
        },
        heating: {
          isHeated: false,
          mode: null,
          power: null,
          setpoint: null,
        },
        lighting: {
          neon: { enabled: false, count: null, power: null },
          doubleNeon: { enabled: false, count: null, power: null },
          halogen: { enabled: false, count: null, power: null },
        },
      }));
    }

    initialData = {
      step1: {
        companyName: lead.company || '',
        siret: lead.siret_number || '',
        address: lead.headquarters_address || '',
        postalCode: lead.headquarters_postcode || '',
        city: lead.headquarters_city || '',
      },
      step2: {
        title: (lead.beneficiary_title as 'M.' | 'Mme' | 'Mlle') || 'M.' as const,
        lastName: lastName,
        firstName: firstName,
        function: lead.beneficiary_function || '',
        phone: lead.beneficiary_phone || lead.phone || '',
        email: lead.beneficiary_email || lead.email || '',
      },
      step3: {
        annualExpenseRange: (lead.annual_expense_range as any) || 'less-than-10000' as const,
      },
      step4: {
        buildingCount: lead.building_count || 1,
      },
      step5: {
        buildings: buildings,
      },
    };
  } catch (error) {
    console.error('Error loading lead:', error);
    redirect(`/${validLang}`);
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#111827] mb-2">
            {dict.detailedForm.title}
          </h1>
          <p className="text-lg text-[#6B7280]">
            {dict.detailedForm.subtitle}
          </p>
        </div>

        <DetailedFormWizard
          lang={validLang}
          dict={dict}
          leadId={leadId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}

