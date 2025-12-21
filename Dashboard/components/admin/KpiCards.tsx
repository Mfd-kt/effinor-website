import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface KpiCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  description?: string;
  loading?: boolean;
}

interface KpiCardsProps {
  cards: KpiCard[];
  className?: string;
}

export function KpiCards({ cards, className }: KpiCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-effinor-gray-text">
              {card.title}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-effinor-emerald/10 flex items-center justify-center">
              <card.icon className="h-4 w-4 text-effinor-emerald" />
            </div>
          </CardHeader>
          <CardContent>
            {card.loading ? (
              <div className="h-8 w-24 bg-effinor-gray-medium animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-effinor-gray-dark">
                {typeof card.value === 'number' 
                  ? card.value.toLocaleString('fr-FR')
                  : card.value}
              </div>
            )}
            {card.trend && !card.loading && (
              <div className="flex items-center gap-1 mt-2">
                {card.trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-effinor-emerald" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <p
                  className={cn(
                    "text-xs font-medium",
                    card.trend.isPositive
                      ? "text-effinor-emerald"
                      : "text-red-600"
                  )}
                >
                  {card.trend.isPositive ? "+" : ""}
                  {Math.abs(card.trend.value).toFixed(1)}%
                  {card.trend.label && ` ${card.trend.label}`}
                </p>
              </div>
            )}
            {card.description && !card.loading && (
              <p className="text-xs text-effinor-gray-text mt-1">
                {card.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

