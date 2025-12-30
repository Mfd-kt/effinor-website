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
import { ConversionFunnel as ConversionFunnelData } from "@/lib/services/analytics";
import { Target } from "lucide-react";

interface ConversionFunnelProps {
  data: ConversionFunnelData;
  loading?: boolean;
}

const COLORS = {
  new: '#3b82f6',
  inProgress: '#f59e0b',
  qualified: '#8b5cf6',
  won: '#10b981',
  lost: '#ef4444',
};

export function ConversionFunnel({ data, loading }: ConversionFunnelProps) {
  const chartData = useMemo(() => {
    const total = data.new + data.inProgress + data.qualified + data.won + data.lost;
    return [
      {
        name: 'Nouveau',
        value: data.new,
        percentage: total > 0 ? ((data.new / total) * 100).toFixed(1) : '0',
        color: COLORS.new,
      },
      {
        name: 'En cours',
        value: data.inProgress,
        percentage: total > 0 ? ((data.inProgress / total) * 100).toFixed(1) : '0',
        color: COLORS.inProgress,
      },
      {
        name: 'Qualifié',
        value: data.qualified,
        percentage: total > 0 ? ((data.qualified / total) * 100).toFixed(1) : '0',
        color: COLORS.qualified,
      },
      {
        name: 'Gagné',
        value: data.won,
        percentage: total > 0 ? ((data.won / total) * 100).toFixed(1) : '0',
        color: COLORS.won,
      },
      {
        name: 'Perdu',
        value: data.lost,
        percentage: total > 0 ? ((data.lost / total) * 100).toFixed(1) : '0',
        color: COLORS.lost,
      },
    ];
  }, [data]);

  const conversionRate = useMemo(() => {
    const total = data.new + data.inProgress + data.qualified + data.won + data.lost;
    return total > 0 ? ((data.won / total) * 100).toFixed(1) : '0';
  }, [data]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnel de conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const total = data.new + data.inProgress + data.qualified + data.won + data.lost;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnel de conversion</CardTitle>
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
            <Target className="h-5 w-5 text-effinor-emerald" />
            <CardTitle>Funnel de conversion</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-effinor-gray-dark">
              {conversionRate}%
            </p>
            <p className="text-xs text-effinor-gray-text">Taux de conversion</p>
          </div>
        </div>
        <CardDescription>
          Répartition des leads par étape du processus de vente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: any, name: any, props: any) => {
                const numValue = value ?? 0;
                const percentage = props?.payload?.percentage ?? 0;
                return [
                  `${numValue} leads (${percentage}%)`,
                  'Nombre de leads',
                ];
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-5 gap-2 text-center">
          {chartData.map((item) => (
            <div key={item.name} className="space-y-1">
              <div
                className="h-2 rounded-full mx-auto"
                style={{ backgroundColor: item.color, width: '60%' }}
              />
              <p className="text-xs font-semibold text-effinor-gray-dark">{item.value}</p>
              <p className="text-xs text-effinor-gray-text">{item.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}



