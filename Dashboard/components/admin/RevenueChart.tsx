"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RevenueTrendData } from "@/lib/services/analytics";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: RevenueTrendData[];
  loading?: boolean;
  period?: string;
}

export function RevenueChart({ data, loading, period }: RevenueChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: format(new Date(item.date), 'dd MMM', { locale: fr }),
      fullDate: item.date,
      revenue: Math.round(item.revenue),
      orders: item.orders,
    }));
  }, [data]);

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  }, [data]);

  const averageRevenue = useMemo(() => {
    return data.length > 0 ? totalRevenue / data.length : 0;
  }, [data, totalRevenue]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution des revenus</CardTitle>
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
          <CardTitle>Évolution des revenus</CardTitle>
          <CardDescription>Aucune donnée disponible pour la période sélectionnée</CardDescription>
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
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-effinor-emerald" />
              Évolution des revenus
            </CardTitle>
            <CardDescription>
              {period && `Période : ${period}`}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-effinor-gray-dark">
              {totalRevenue.toLocaleString('fr-FR')} €
            </p>
            <p className="text-xs text-effinor-gray-text">
              Moyenne : {averageRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €/jour
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'revenue') {
                  return [`${value.toLocaleString('fr-FR')} €`, 'Revenus'];
                }
                return [value, 'Commandes'];
              }}
              labelStyle={{ color: '#111827', fontWeight: 'bold' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                if (value === 'revenue') return 'Revenus (€)';
                if (value === 'orders') return 'Commandes';
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
              name="revenue"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

