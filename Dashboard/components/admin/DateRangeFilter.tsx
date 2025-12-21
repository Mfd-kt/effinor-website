"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Calendar, ChevronDown } from "lucide-react";
import { Period, DateRange } from "@/lib/services/analytics";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DateRangeFilterProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
  customRange?: DateRange;
  onCustomRangeChange?: (range: DateRange) => void;
  className?: string;
}

const periodLabels: Record<Period, string> = {
  today: "Aujourd'hui",
  '7d': "7 derniers jours",
  '30d': "30 derniers jours",
  month: "Ce mois",
  quarter: "Ce trimestre",
  year: "Cette année",
  custom: "Personnalisé",
};

export function DateRangeFilter({
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
  className,
}: DateRangeFilterProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(
    customRange?.start ? format(customRange.start, 'yyyy-MM-dd') : ''
  );
  const [localEndDate, setLocalEndDate] = useState(
    customRange?.end ? format(customRange.end, 'yyyy-MM-dd') : ''
  );

  useEffect(() => {
    if (customRange) {
      setLocalStartDate(format(customRange.start, 'yyyy-MM-dd'));
      setLocalEndDate(format(customRange.end, 'yyyy-MM-dd'));
    }
  }, [customRange]);

  const handleCustomDateApply = () => {
    if (localStartDate && localEndDate && onCustomRangeChange) {
      const start = new Date(localStartDate);
      const end = new Date(localEndDate);
      end.setHours(23, 59, 59, 999); // Fin de journée
      onCustomRangeChange({ start, end });
      onPeriodChange('custom');
      setShowCustomPicker(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-effinor-gray-text" />
        <Select
          value={period}
          onChange={(e) => {
            const newPeriod = e.target.value as Period;
            onPeriodChange(newPeriod);
            if (newPeriod !== 'custom') {
              setShowCustomPicker(false);
            } else {
              setShowCustomPicker(true);
            }
          }}
          className="w-[180px]"
        >
          {Object.entries(periodLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {period === 'custom' && (
        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 bg-white">
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className="text-sm border-0 focus:outline-none focus:ring-0 p-0 h-auto"
          />
          <span className="text-effinor-gray-text">→</span>
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            className="text-sm border-0 focus:outline-none focus:ring-0 p-0 h-auto"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCustomDateApply}
            disabled={!localStartDate || !localEndDate}
            className="h-7 px-2 text-xs"
          >
            Appliquer
          </Button>
        </div>
      )}

      {customRange && period === 'custom' && (
        <span className="text-sm text-effinor-gray-text">
          {format(customRange.start, 'dd MMM yyyy', { locale: fr })} - {format(customRange.end, 'dd MMM yyyy', { locale: fr })}
        </span>
      )}
    </div>
  );
}

