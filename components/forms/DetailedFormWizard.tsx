'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dictionary, Lang } from '@/types';
import { DetailedFormData, PartialDetailedFormData } from '@/types/detailed-form';
import { submitDetailedForm, saveFormStep } from '@/app/actions/detailed-form';
import Step1CompanyInfoComponent from './Step1CompanyInfo';
import Step2MainContactComponent from './Step2MainContact';
import Step3EnergyExpensesComponent from './Step3EnergyExpenses';
import Step4BuildingConfigComponent from './Step4BuildingConfig';
import Step5BuildingDetailsComponent from './Step5BuildingDetails';
import Step6SummaryComponent from './Step6Summary';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DetailedFormWizardProps {
  lang: Lang;
  dict: Dictionary;
  leadId: string;
  initialData?: PartialDetailedFormData;
}

const TOTAL_STEPS = 6;

const getInitialFormData = (initialData?: PartialDetailedFormData): DetailedFormData => {
  return {
    step1: initialData?.step1 || {
      companyName: '',
      siret: '',
      address: '',
      postalCode: '',
      city: '',
    },
    step2: initialData?.step2 || {
      title: 'M.',
      lastName: '',
      firstName: '',
      function: '',
      phone: '',
      email: '',
    },
    step3: initialData?.step3 || {
      annualExpenseRange: 'less-than-10000' as const,
    },
    step4: initialData?.step4 || {
      buildingCount: 1,
    },
    step5: initialData?.step5 || {
      buildings: [
        {
          general: {
            type: 'entrepot',
            surface: 0,
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
        },
      ],
    },
  };
};

export default function DetailedFormWizard({
  lang,
  dict,
  leadId,
  initialData,
}: DetailedFormWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DetailedFormData>(() => getInitialFormData(initialData));
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save dans la base de données avec debounce
  useEffect(() => {
    // Nettoyer le timeout précédent
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Créer un nouveau timeout pour sauvegarder après 1 seconde d'inactivité
    saveTimeoutRef.current = setTimeout(async () => {
      if (currentStep >= 1 && currentStep <= 5) {
        setSaving(true);
        try {
          let stepData: any;
          if (currentStep === 1) stepData = formData.step1;
          else if (currentStep === 2) stepData = formData.step2;
          else if (currentStep === 3) stepData = formData.step3;
          else if (currentStep === 4) stepData = formData.step4;
          else if (currentStep === 5) stepData = formData.step5;

          await saveFormStep(leadId, currentStep as 1 | 2 | 3 | 4 | 5, stepData);
        } catch (error) {
          console.error('Error auto-saving:', error);
        } finally {
          setSaving(false);
        }
      }
    }, 1000);

    // Sauvegarder aussi dans localStorage
    const storageKey = `detailed-form-${leadId}`;
    localStorage.setItem(storageKey, JSON.stringify(formData));

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, currentStep, leadId]);

  // Charger depuis localStorage au montage
  useEffect(() => {
    const storageKey = `detailed-form-${leadId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading from localStorage:', e);
      }
    }
  }, [leadId]);

  // Initialiser les bâtiments quand buildingCount change
  useEffect(() => {
    if (formData.step4.buildingCount && formData.step5.buildings.length !== formData.step4.buildingCount) {
      const newBuildings = Array.from({ length: formData.step4.buildingCount }, (_, index) => {
        return formData.step5.buildings[index] || {
          general: { type: 'entrepot' as const, surface: 0, height: null },
          heating: { isHeated: false, mode: null, power: null, setpoint: null },
          lighting: {
            neon: { enabled: false, count: null, power: null },
            doubleNeon: { enabled: false, count: null, power: null },
            halogen: { enabled: false, count: null, power: null },
          },
        };
      });
      setFormData((prev) => ({
        ...prev,
        step5: {
          ...prev.step5,
          buildings: newBuildings,
        },
      }));
    }
  }, [formData.step4.buildingCount]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, any> = {};

    if (step === 1) {
      if (!formData.step1.companyName.trim()) {
        newErrors.step1 = { ...newErrors.step1, companyName: 'Requis' };
      }
      if (!formData.step1.siret.trim() || formData.step1.siret.length !== 14) {
        newErrors.step1 = { ...newErrors.step1, siret: 'SIRET doit contenir 14 chiffres' };
      }
      if (!formData.step1.address.trim()) {
        newErrors.step1 = { ...newErrors.step1, address: 'Requis' };
      }
      if (!formData.step1.postalCode.trim()) {
        newErrors.step1 = { ...newErrors.step1, postalCode: 'Requis' };
      }
      if (!formData.step1.city.trim()) {
        newErrors.step1 = { ...newErrors.step1, city: 'Requis' };
      }
    }

    if (step === 2) {
      if (!formData.step2.title) {
        newErrors.step2 = { ...newErrors.step2, title: 'Requis' };
      }
      if (!formData.step2.lastName.trim()) {
        newErrors.step2 = { ...newErrors.step2, lastName: 'Requis' };
      }
      if (!formData.step2.firstName.trim()) {
        newErrors.step2 = { ...newErrors.step2, firstName: 'Requis' };
      }
      if (!formData.step2.function.trim()) {
        newErrors.step2 = { ...newErrors.step2, function: 'Requis' };
      }
      if (!formData.step2.phone.trim()) {
        newErrors.step2 = { ...newErrors.step2, phone: 'Requis' };
      }
      if (!formData.step2.email.trim() || !formData.step2.email.includes('@')) {
        newErrors.step2 = { ...newErrors.step2, email: 'Email invalide' };
      }
    }

    if (step === 3) {
      if (!formData.step3.annualExpenseRange) {
        newErrors.step3 = { ...newErrors.step3, annualExpenseRange: 'Requis' };
      }
    }

    if (step === 4) {
      if (!formData.step4.buildingCount || formData.step4.buildingCount < 1 || formData.step4.buildingCount > 10) {
        newErrors.step4 = { ...newErrors.step4, buildingCount: 'Doit être entre 1 et 10' };
      }
    }

    if (step === 5) {
      // Valider tous les bâtiments - mais ne bloquer le passage à l'étape suivante
      // que si aucun bâtiment n'est valide
      let hasAtLeastOneValidBuilding = false;
      formData.step5.buildings.forEach((building, index) => {
        const hasType = !!building.general.type;
        const hasSurface = building.general.surface && building.general.surface > 0;
        
        if (!hasType) {
          newErrors[`building-${index}-type`] = 'Requis';
        }
        if (!hasSurface) {
          newErrors[`building-${index}-surface`] = 'Requis';
        }
        
        // Si ce bâtiment est valide, on peut passer à l'étape suivante
        if (hasType && hasSurface) {
          hasAtLeastOneValidBuilding = true;
        }
      });
      
      // Si aucun bâtiment n'est valide, bloquer le passage
      if (!hasAtLeastOneValidBuilding && formData.step5.buildings.length > 0) {
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validation stricte pour la soumission : tous les bâtiments doivent être valides
    const newErrors: Record<string, any> = {};
    let isValid = true;
    
    formData.step5.buildings.forEach((building, index) => {
      if (!building.general.type) {
        newErrors[`building-${index}-type`] = 'Requis';
        isValid = false;
      }
      if (!building.general.surface || building.general.surface <= 0) {
        newErrors[`building-${index}-surface`] = 'Requis';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    if (!isValid) {
      setCurrentStep(5);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitDetailedForm(leadId, formData);
      if (result.success) {
        // Supprimer les données du localStorage
        const storageKey = `detailed-form-${leadId}`;
        localStorage.removeItem(storageKey);
        // Supprimer aussi le leadId du formulaire initial
        const leadIdKey = `current-lead-id-${lang}`;
        localStorage.removeItem(leadIdKey);
        // Rediriger vers une page de confirmation
        router.push(`/${lang}/formulaire/merci`);
      } else {
        alert(dict.detailedForm.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(dict.detailedForm.error);
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#6B7280]">
            {dict.detailedForm.progress
              .replace('{current}', String(currentStep))
              .replace('{total}', String(TOTAL_STEPS))}
          </span>
          <span className="text-sm font-medium text-[#6B7280]">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#10B981] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step === currentStep
                  ? 'bg-[#10B981] text-white'
                  : step < currentStep
                  ? 'bg-[#10B981]/20 text-[#10B981]'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Contenu de l'étape */}
      <Card className="mb-6">
        {currentStep === 1 && (
          <Step1CompanyInfoComponent
            dict={dict}
            data={formData.step1}
            onChange={(data) => setFormData((prev) => ({ ...prev, step1: data }))}
            errors={errors.step1}
          />
        )}
        {currentStep === 2 && (
          <Step2MainContactComponent
            dict={dict}
            data={formData.step2}
            onChange={(data) => setFormData((prev) => ({ ...prev, step2: data }))}
            errors={errors.step2}
          />
        )}
        {currentStep === 3 && (
          <Step3EnergyExpensesComponent
            dict={dict}
            data={formData.step3}
            onChange={(data) => setFormData((prev) => ({ ...prev, step3: data }))}
            errors={errors.step3}
          />
        )}
        {currentStep === 4 && (
          <Step4BuildingConfigComponent
            dict={dict}
            data={formData.step4}
            onChange={(data) => setFormData((prev) => ({ ...prev, step4: data }))}
            errors={errors.step4}
          />
        )}
        {currentStep === 5 && (
          <Step5BuildingDetailsComponent
            dict={dict}
            data={formData.step5}
            onChange={(data) => setFormData((prev) => ({ ...prev, step5: data }))}
            errors={errors}
          />
        )}
        {currentStep === 6 && <Step6SummaryComponent dict={dict} data={formData} />}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={handlePrevious} disabled={submitting}>
            {dict.detailedForm.previous}
          </Button>
        ) : (
          <div />
        )}

        {currentStep < TOTAL_STEPS ? (
          <Button variant="primary" onClick={handleNext} disabled={submitting}>
            {dict.detailedForm.next}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? dict.detailedForm.submitting : dict.detailedForm.submit}
          </Button>
        )}
      </div>
    </div>
  );
}

