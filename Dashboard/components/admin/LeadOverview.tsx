"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Building, MapPin, Calendar, User, Briefcase } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface LeadOverviewProps {
  lead: Lead;
}

export function LeadOverview({ lead }: LeadOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Contact</p>
              <p className="font-semibold truncate">{lead.fullName || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold text-sm truncate">{lead.email || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Téléphone</p>
              <p className="font-semibold truncate">{lead.phone || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Building className="w-5 h-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Entreprise</p>
              <p className="font-semibold truncate">{lead.company || lead.workCompanyName || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Région</p>
              <p className="font-semibold truncate">{lead.workRegion || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Créé le</p>
              <p className="font-semibold text-sm">
                {format(lead.createdAt, 'dd MMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
          
          {lead.buildingType && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Type de bâtiment</p>
                <p className="font-semibold truncate capitalize">
                  {lead.buildingType.replace(/-/g, ' ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



