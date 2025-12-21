"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesByCategory } from "@/lib/services/analytics";
import { Tag } from "lucide-react";

interface SalesByCategoryChartProps {
  data: SalesByCategory[];
  loading?: boolean;
}

const COLORS = [
  '#10B981', // Effinor emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#ec4899', // Pink
];

export function SalesByCategoryChart({ data, loading }: SalesByCategoryChartProps) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map((item) => ({
      name: typeof item.categoryName === 'string' ? item.categoryName : String(item.categoryName || 'Sans catégorie'),
      value: Math.round(item.revenue || 0),
      orderCount: item.orderCount || 0,
      categoryId: item.categoryId || '',
    }));
  }, [data]);

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  }, [data]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventes par catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventes par catégorie</CardTitle>
          <CardDescription>Aucune donnée disponible</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-effinor-gray-text">
            Aucune donnée
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-effinor-emerald" />
            <CardTitle>Ventes par catégorie</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-effinor-gray-dark">
              {totalRevenue.toLocaleString('fr-FR')} €
            </p>
            <p className="text-xs text-effinor-gray-text">CA total</p>
          </div>
        </div>
        <CardDescription>
          Répartition des ventes par catégorie de produits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${String(name)}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number, name: string, props: any) => {
                if (name === 'value') {
                  return [
                    `${value.toLocaleString('fr-FR')} €`,
                    'Revenus',
                  ];
                }
                return [value, name];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => {
                const item = chartData.find((d) => d.name === value);
                const percentage = totalRevenue > 0 
                  ? ((item?.value || 0) / totalRevenue * 100).toFixed(1)
                  : '0';
                return `${value} (${percentage}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {chartData.map((item, index) => (
            <div
              key={`category-${item.categoryId || index}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-effinor-gray-light"
            >
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-effinor-gray-dark truncate">
                  {item.name}
                </p>
                <p className="text-xs text-effinor-gray-text">
                  {item.value.toLocaleString('fr-FR')} € • {item.orderCount} commande(s)
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

