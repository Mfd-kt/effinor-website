"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lead } from "@/lib/types/lead";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface MergeLeadsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leads: Lead[];
  onMerge: (mainLeadId: string, duplicateLeadIds: string[]) => Promise<void>;
}

export function MergeLeadsDialog({
  open,
  onOpenChange,
  leads,
  onMerge,
}: MergeLeadsDialogProps) {
  const [selectedMainId, setSelectedMainId] = useState<string>(leads[0]?.id || '');
  const [merging, setMerging] = useState(false);

  // Trier les leads par date de création (le plus récent en premier)
  const sortedLeads = [...leads].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Si selectedMainId n'est pas dans la liste, le définir au premier
  useEffect(() => {
    if (open && sortedLeads.length > 0) {
      if (!selectedMainId || !sortedLeads.find(l => l.id === selectedMainId)) {
        setSelectedMainId(sortedLeads[0].id);
      }
    }
  }, [open, sortedLeads, selectedMainId]);

  const handleMerge = async () => {
    if (!selectedMainId) return;

    const duplicateIds = sortedLeads
      .filter(l => l.id !== selectedMainId)
      .map(l => l.id);

    setMerging(true);
    try {
      await onMerge(selectedMainId, duplicateIds);
      onOpenChange(false);
    } catch (error) {
      console.error('Error merging leads:', error);
    } finally {
      setMerging(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Fusionner les doublons
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                {leads.length} leads avec le même email
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez le lead principal à conserver. Les données des autres leads seront fusionnées dans celui-ci, puis les doublons seront supprimés.
            </p>
          </div>

          <div className="space-y-3">
            {sortedLeads.map((lead, index) => {
              const isSelected = lead.id === selectedMainId;
              const completionScore = lead.completionScore || 0;
              
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedMainId(lead.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#10B981] bg-[#10B981]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-[#10B981] bg-[#10B981]'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {lead.fullName || 'Sans nom'}
                          </h3>
                          {index === 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              Plus récent
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-xs bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded">
                              Principal
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        <p className="text-sm text-gray-500">{lead.phone}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            Créé le {format(lead.createdAt, 'dd MMM yyyy', { locale: fr })}
                          </span>
                          <span>
                            Score: {completionScore}%
                          </span>
                          {lead.company && (
                            <span>Entreprise: {lead.company}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={merging}
          >
            Annuler
          </Button>
          <Button
            onClick={handleMerge}
            disabled={merging || !selectedMainId}
            className="bg-[#10B981] hover:bg-[#10B981]/90"
          >
            {merging ? 'Fusion en cours...' : `Fusionner ${leads.length - 1} doublon${leads.length > 2 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

