"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, FileText, Download, Share2, Copy, Printer } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { useToast } from "@/components/ui/toast";

interface LeadQuickActionsProps {
  lead: Lead;
  onSendEmail?: () => void;
  onCall?: () => void;
  onSchedule?: () => void;
  onExportPDF?: () => void;
  onShare?: () => void;
}

export function LeadQuickActions({ 
  lead, 
  onSendEmail, 
  onCall, 
  onSchedule, 
  onExportPDF, 
  onShare 
}: LeadQuickActionsProps) {
  const { addToast } = useToast();

  const handleCopyEmail = () => {
    if (lead.email) {
      navigator.clipboard.writeText(lead.email);
      addToast({
        title: "Copié",
        description: "Email copié dans le presse-papier",
        variant: "success",
      });
    }
  };

  const handleCopyPhone = () => {
    if (lead.phone) {
      navigator.clipboard.writeText(lead.phone);
      addToast({
        title: "Copié",
        description: "Téléphone copié dans le presse-papier",
        variant: "success",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCall = () => {
    if (lead.phone) {
      window.location.href = `tel:${lead.phone}`;
    } else if (onCall) {
      onCall();
    }
  };

  const handleEmail = () => {
    if (lead.email) {
      window.location.href = `mailto:${lead.email}`;
    } else if (onSendEmail) {
      onSendEmail();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border flex-wrap">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleEmail}
        disabled={!lead.email}
        className="flex items-center gap-2"
      >
        <Mail className="w-4 h-4" />
        Envoyer email
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCall}
        disabled={!lead.phone}
        className="flex items-center gap-2"
      >
        <Phone className="w-4 h-4" />
        Appeler
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSchedule}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Planifier
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExportPDF}
        className="flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Exporter PDF
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopyEmail}
        disabled={!lead.email}
        className="flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        Copier email
      </Button>
      
      {lead.phone && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopyPhone}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copier téléphone
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        className="flex items-center gap-2"
      >
        <Printer className="w-4 h-4" />
        Imprimer
      </Button>
      
      {onShare && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShare}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Partager
        </Button>
      )}
    </div>
  );
}



