"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number; // 0-10
  onChange?: (value: number) => void;
  readOnly?: boolean;
  maxStars?: number; // Par défaut 10
  className?: string;
}

export function StarRating({
  value,
  onChange,
  readOnly = false,
  maxStars = 10,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (starIndex: number) => {
    if (!readOnly && onChange) {
      onChange(starIndex);
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (!readOnly) {
      setHoverValue(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starIndex = index + 1;
        const isFilled = starIndex <= displayValue;
        
        return (
          <button
            key={starIndex}
            type="button"
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            className={cn(
              "transition-colors",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110",
              isFilled ? "text-yellow-400" : "text-gray-300"
            )}
          >
            <Star
              className={cn(
                "h-5 w-5",
                isFilled ? "fill-current" : "fill-none"
              )}
            />
          </button>
        );
      })}
      {!readOnly && (
        <span className="ml-2 text-sm text-effinor-gray-text">
          {displayValue > 0 ? `${displayValue}/${maxStars}` : "Non noté"}
        </span>
      )}
    </div>
  );
}

