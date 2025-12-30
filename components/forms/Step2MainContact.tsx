'use client';

import { Dictionary } from '@/types';
import { Step2MainContact } from '@/types/detailed-form';
import { Users } from 'lucide-react';

interface Step2MainContactProps {
  dict: Dictionary;
  data: Step2MainContact;
  onChange: (data: Step2MainContact) => void;
  errors?: Partial<Record<keyof Step2MainContact, string>>;
}

export default function Step2MainContactComponent({
  dict,
  data,
  onChange,
  errors,
}: Step2MainContactProps) {
  const handleChange = (field: keyof Step2MainContact, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-[#111827] mb-2">
          {dict.detailedForm.step2.title}
        </h2>
        <p className="text-[#6B7280]">
          {dict.detailedForm.step2.subtitle}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-[#111827] mb-1">
            {dict.detailedForm.step2.titleLabel}
          </label>
          <select
            id="title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value as 'M.' | 'Mme' | 'Mlle')}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
              errors?.title ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez...</option>
            <option value="M.">M.</option>
            <option value="Mme">Mme</option>
            <option value="Mlle">Mlle</option>
          </select>
          {errors?.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-[#111827] mb-1">
              {dict.detailedForm.step2.lastName}
            </label>
            <input
              type="text"
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder={dict.detailedForm.step2.lastNamePlaceholder}
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
                errors?.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors?.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-[#111827] mb-1">
              {dict.detailedForm.step2.firstName}
            </label>
            <input
              type="text"
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder={dict.detailedForm.step2.firstNamePlaceholder}
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
                errors?.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors?.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="function" className="block text-sm font-semibold text-[#111827] mb-1">
            {dict.detailedForm.step2.function}
          </label>
          <input
            type="text"
            id="function"
            value={data.function}
            onChange={(e) => handleChange('function', e.target.value)}
            placeholder={dict.detailedForm.step2.functionPlaceholder}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
              errors?.function ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors?.function && (
            <p className="mt-1 text-sm text-red-500">{errors.function}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#111827] mb-1">
            {dict.detailedForm.step2.phone}
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder={dict.detailedForm.step2.phonePlaceholder}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
              errors?.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors?.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#111827] mb-1">
            {dict.detailedForm.step2.email}
          </label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder={dict.detailedForm.step2.emailPlaceholder}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
              errors?.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors?.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}



