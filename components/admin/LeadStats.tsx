"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, XCircle, Target, DollarSign } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface LeadStatsProps {
  lead: Lead;
}

export function LeadStats({ lead }: LeadStatsProps) {
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (statusId?: string) => {
    switch (statusId) {
      case 'won': return 'text-green-600';
      case 'lost': return 'text-red-600';
      case 'qualified': return 'text-purple-600';
      case 'in_progress': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Ancienneté</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{daysSinceCreation}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(lead.createdAt, { addSuffix: true, locale: fr })}
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Score</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {lead.completionScore || 0}%
            </p>
            <p className="text-xs text-gray-500">complétion</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Qualification</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {lead.qualificationScore || 0}/10
            </p>
            <p className="text-xs text-gray-500">étoiles</p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">Statut</span>
            </div>
            <p className={`text-lg font-bold ${getStatusColor(lead.statusId)}`}>
              {lead.status?.label || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">actuel</p>
          </div>

          {lead.potentialRevenue > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-600">CA Potentiel</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {lead.potentialRevenue.toLocaleString()} €
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



