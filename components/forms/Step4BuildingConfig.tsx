'use client';

import { Dictionary } from '@/types';
import { Step4BuildingConfig } from '@/types/detailed-form';
import { Building } from 'lucide-react';

interface Step4BuildingConfigProps {
  dict: Dictionary;
  data: Step4BuildingConfig;
  onChange: (data: Step4BuildingConfig) => void;
  errors?: Partial<Record<keyof Step4BuildingConfig, string>>;
}

export default function Step4BuildingConfigComponent({
  dict,
  data,
  onChange,
  errors,
}: Step4BuildingConfigProps) {
  const handleChange = (value: number) => {
    onChange({
      ...data,
      buildingCount: value,
    });
  };

  const buildingOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-[#111827] mb-2">
          {dict.detailedForm.step4.title}
        </h2>
        <p className="text-[#6B7280]">
          {dict.detailedForm.step4.subtitle}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-yellow-600 text-sm font-bold">?</span>
          </div>
          <div>
            <h3 className="font-semibold text-[#111827] mb-1">
              {dict.detailedForm.step4.infoTitle}
            </h3>
            <p className="text-sm text-[#6B7280]">
              {dict.detailedForm.step4.infoText}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="buildingCount" className="block text-sm font-semibold text-[#111827] mb-1">
          {dict.detailedForm.step4.buildingCount}
        </label>
        <select
          id="buildingCount"
          value={data.buildingCount || ''}
          onChange={(e) => handleChange(Number(e.target.value))}
          className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
            errors?.buildingCount ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">{dict.detailedForm.step4.selectCount}</option>
          {buildingOptions.map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? dict.detailedForm.step4.building : dict.detailedForm.step4.buildings}
            </option>
          ))}
        </select>
        {errors?.buildingCount && (
          <p className="mt-1 text-sm text-red-500">{errors.buildingCount}</p>
        )}
      </div>
    </div>
  );
}



