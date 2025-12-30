'use client';

import { Dictionary } from '@/types';
import { Step1CompanyInfo } from '@/types/detailed-form';
import { Building2 } from 'lucide-react';

interface Step1CompanyInfoProps {
  dict: Dictionary;
  data: Step1CompanyInfo;
  onChange: (data: Step1CompanyInfo) => void;
  errors?: Partial<Record<keyof Step1CompanyInfo, string>>;
}

export default function Step1CompanyInfoComponent({
  dict,
  data,
  onChange,
  errors,
}: Step1CompanyInfoProps) {
  const handleChange = (field: keyof Step1CompanyInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-[#111827] mb-2">
          {dict.detailedForm.step1.title}
        </h2>
        <p className="text-[#6B7280]">
          {dict.detailedForm.step1.subtitle}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="companyName" className="block text-sm font-semibold text-[#111827] mb-1">
            {dict.detailedForm.step1.companyName}
          </label>
          <input
            type="text"
            id="companyName"
            value={data.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder={dict.detailedForm.step1.companyNamePlaceholder}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
              errors?.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors?.companyName && (
            <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label htmlFor="siret" className="block text-sm font-semibold text-[#111827] mb-1">
            {dict.detailedForm.step1.siret}
          </label>
          <input
            type="text"
            id="siret"
            value={data.siret}
            onChange={(e) => handleChange('siret', e.target.value.replace(/\D/g, '').slice(0, 14))}
            placeholder={dict.detailedForm.step1.siretPlaceholder}
            maxLength={14}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
              errors?.siret ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors?.siret && (
            <p className="mt-1 text-sm text-red-500">{errors.siret}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-[#111827] mb-1">
            {dict.detailedForm.step1.address}
          </label>
          <input
            type="text"
            id="address"
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder={dict.detailedForm.step1.addressPlaceholder}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
              errors?.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors?.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-semibold text-[#111827] mb-1">
              {dict.detailedForm.step1.postalCode}
            </label>
            <input
              type="text"
              id="postalCode"
              value={data.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder={dict.detailedForm.step1.postalCodePlaceholder}
              maxLength={5}
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
                errors?.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors?.postalCode && (
              <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-[#111827] mb-1">
              {dict.detailedForm.step1.city}
            </label>
            <input
              type="text"
              id="city"
              value={data.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder={dict.detailedForm.step1.cityPlaceholder}
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
                errors?.city ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors?.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



