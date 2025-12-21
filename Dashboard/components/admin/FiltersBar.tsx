import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: ReactNode;
  className?: string;
}

export function FiltersBar({
  searchPlaceholder = "Rechercher...",
  searchValue,
  onSearchChange,
  filters,
  className,
}: FiltersBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 mb-6",
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-effinor-gray-text" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-9"
        />
      </div>
      {filters && <div className="flex gap-2">{filters}</div>}
    </div>
  );
}

