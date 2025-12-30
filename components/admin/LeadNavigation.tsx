"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLeads } from "@/lib/services/leads";
import { Lead } from "@/lib/types/lead";

interface LeadNavigationProps {
  currentLeadId: string;
}

export function LeadNavigation({ currentLeadId }: LeadNavigationProps) {
  const router = useRouter();
  const [previousLeadId, setPreviousLeadId] = useState<string | undefined>();
  const [nextLeadId, setNextLeadId] = useState<string | undefined>();

  useEffect(() => {
    loadNavigation();
  }, [currentLeadId]);

  const loadNavigation = async () => {
    try {
      const leads = await getLeads();
      const currentIndex = leads.findIndex(l => l.id === currentLeadId);
      
      if (currentIndex > 0) {
        setPreviousLeadId(leads[currentIndex - 1].id);
      } else {
        setPreviousLeadId(undefined);
      }
      
      if (currentIndex < leads.length - 1) {
        setNextLeadId(leads[currentIndex + 1].id);
      } else {
        setNextLeadId(undefined);
      }
    } catch (error) {
      console.error('Error loading navigation:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
      <Button
        variant="outline"
        onClick={() => previousLeadId && router.push(`/admin/leads/${previousLeadId}`)}
        disabled={!previousLeadId}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Lead précédent
      </Button>
      
      <Button
        variant="outline"
        onClick={() => router.push('/admin/leads')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la liste
      </Button>
      
      <Button
        variant="outline"
        onClick={() => nextLeadId && router.push(`/admin/leads/${nextLeadId}`)}
        disabled={!nextLeadId}
        className="flex items-center gap-2"
      >
        Lead suivant
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}



