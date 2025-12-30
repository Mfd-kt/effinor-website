'use client';

import { Dictionary } from '@/types';
import { Step3EnergyExpenses, AnnualExpenseRange } from '@/types/detailed-form';
import { Euro } from 'lucide-react';

interface Step3EnergyExpensesProps {
  dict: Dictionary;
  data: Step3EnergyExpenses;
  onChange: (data: Step3EnergyExpenses) => void;
  errors?: Partial<Record<keyof Step3EnergyExpenses, string>>;
}

const EXPENSE_RANGES: AnnualExpenseRange[] = [
  'less-than-10000',
  '10000-50000',
  '50000-100000',
  '100000-500000',
  'more-than-500000',
];

export default function Step3EnergyExpensesComponent({
  dict,
  data,
  onChange,
  errors,
}: Step3EnergyExpensesProps) {
  const handleChange = (value: AnnualExpenseRange) => {
    onChange({
      ...data,
      annualExpenseRange: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
          <Euro className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-[#111827] mb-2">
          {dict.detailedForm.step3.title}
        </h2>
        <p className="text-[#6B7280]">
          {dict.detailedForm.step3.subtitle}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-yellow-600 text-sm font-bold">?</span>
          </div>
          <div>
            <h3 className="font-semibold text-[#111827] mb-1">
              {dict.detailedForm.step3.whyInfo}
            </h3>
            <p className="text-sm text-[#6B7280]">
              {dict.detailedForm.step3.whyInfoText}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="annualExpenseRange" className="block text-sm font-semibold text-[#111827] mb-1">
          {dict.detailedForm.step3.annualExpenseRange}
        </label>
        <select
          id="annualExpenseRange"
          value={data.annualExpenseRange || ''}
          onChange={(e) => handleChange(e.target.value as AnnualExpenseRange)}
          className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors ${
            errors?.annualExpenseRange ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">{dict.detailedForm.step3.selectRange}</option>
          {EXPENSE_RANGES.map((range) => (
            <option key={range} value={range}>
              {dict.detailedForm.step3.ranges[range]}
            </option>
          ))}
        </select>
        {errors?.annualExpenseRange && (
          <p className="mt-1 text-sm text-red-500">{errors.annualExpenseRange}</p>
        )}
      </div>
    </div>
  );
}



