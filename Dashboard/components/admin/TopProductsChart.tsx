"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopProduct } from "@/lib/services/analytics";
import { Package } from "lucide-react";

interface TopProductsChartProps {
  data: TopProduct[];
  loading?: boolean;
  limit?: number;
}

export function TopProductsChart({ data, loading, limit = 10 }: TopProductsChartProps) {
  const chartData = useMemo(() => {
    return data.slice(0, limit).map((product) => ({
      name: product.productName.length > 20 
        ? product.productName.substring(0, 20) + '...' 
        : product.productName,
      fullName: product.productName,
      quantity: product.quantity,
      revenue: Math.round(product.revenue),
    }));
  }, [data, limit]);

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  }, [data]);

  const totalQuantity = useMemo(() => {
    return data.reduce((sum, item) => sum + item.quantity, 0);
  }, [data]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top produits</CardTitle>
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
          <CardTitle>Top produits</CardTitle>
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
            <Package className="h-5 w-5 text-effinor-emerald" />
            <CardTitle>Top {limit} produits</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-effinor-gray-dark">
              {totalQuantity.toLocaleString('fr-FR')} unités
            </p>
            <p className="text-xs text-effinor-gray-text">
              {totalRevenue.toLocaleString('fr-FR')} € de CA
            </p>
          </div>
        </div>
        <CardDescription>
          Produits les plus vendus par quantité
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: any, name: any) => {
                const numValue = value ?? 0;
                if (name === 'quantity') {
                  return [`${numValue.toLocaleString('fr-FR')} unités`, 'Quantité'];
                }
                if (name === 'revenue') {
                  return [`${numValue.toLocaleString('fr-FR')} €`, 'Revenus'];
                }
                return [numValue, name || ''];
              }}
              labelFormatter={(label) => {
                const item = chartData.find((d) => d.name === label);
                return item?.fullName || label;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                if (value === 'quantity') return 'Quantité vendue';
                if (value === 'revenue') return 'Revenus (€)';
                return value;
              }}
            />
            <Bar dataKey="quantity" fill="#10B981" radius={[0, 8, 8, 0]} name="quantity" />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 8, 8, 0]} name="revenue" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}



