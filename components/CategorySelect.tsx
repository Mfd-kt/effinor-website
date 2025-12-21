'use client';

import { Lang } from '@/types';

interface CategoryOption {
  id: string;
  name: string;
}

interface CategorySelectProps {
  lang: Lang;
  options: CategoryOption[];
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  label: string;
  placeholder: string;
  required?: boolean;
}

export default function CategorySelect({
  lang,
  options,
  name = 'category_id',
  value,
  onChange,
  label,
  placeholder,
  required = false,
}: CategorySelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={handleChange}
          required={required}
          className="w-full rounded-xl border border-gray-300 px-3 py-2.5 pr-10 text-sm appearance-none bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

