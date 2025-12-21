"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadTrendData } from "@/lib/services/analytics";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TrendingUp } from "lucide-react";

interface LeadsTrendChartProps {
  data: LeadTrendData[];
  loading?: boolean;
}

export function LeadsTrendChart({ data, loading }: LeadsTrendChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: format(new Date(item.date), 'dd MMM', { locale: fr }),
      fullDate: item.date,
      count: item.count,
      won: item.won,
    }));
  }, [data]);

  const totalLeads = useMemo(() => {
    return data.reduce((sum, item) => sum + item.count, 0);
  }, [data]);

  const totalWon = useMemo(() => {
    return data.reduce((sum, item) => sum + item.won, 0);
  }, [data]);

  const conversionRate = useMemo(() => {
    return totalLeads > 0 ? ((totalWon / totalLeads) * 100).toFixed(1) : '0';
  }, [totalLeads, totalWon]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution des leads</CardTitle>
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
          <CardTitle>Évolution des leads</CardTitle>
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
            <TrendingUp className="h-5 w-5 text-effinor-emerald" />
            <CardTitle>Évolution des leads</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-effinor-gray-dark">
              {totalLeads}
            </p>
            <p className="text-xs text-effinor-gray-text">
              {totalWon} gagnés ({conversionRate}%)
            </p>
          </div>
        </div>
        <CardDescription>
          Nombre de leads créés et convertis par jour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'count') {
                  return [value, 'Leads créés'];
                }
                if (name === 'won') {
                  return [value, 'Leads gagnés'];
                }
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                if (value === 'count') return 'Leads créés';
                if (value === 'won') return 'Leads gagnés';
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLeads)"
              name="count"
            />
            <Area
              type="monotone"
              dataKey="won"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWon)"
              name="won"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

