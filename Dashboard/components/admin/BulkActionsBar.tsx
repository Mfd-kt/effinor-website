"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Trash2, Tag, Mail, FileDown, CheckSquare, X } from "lucide-react";

interface BulkActionsBarProps {
  selectedLeads: string[];
  onBulkUpdate: (leadIds: string[], action: string, value?: string) => Promise<void>;
  onExport: (leadIds: string[]) => void;
  onClearSelection: () => void;
  leadStatuses?: Array<{ id: string; label: string }>;
}

export function BulkActionsBar({
  selectedLeads,
  onBulkUpdate,
  onExport,
  onClearSelection,
  leadStatuses = []
}: BulkActionsBarProps) {
  const [action, setAction] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (selectedLeads.length === 0) return null;

  const handleExecute = async () => {
    if (!action) return;
    setLoading(true);
    try {
      await onBulkUpdate(selectedLeads, action, value);
      setAction("");
      setValue("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-effinor-emerald/10 border border-effinor-emerald rounded-lg mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-5 h-5 text-effinor-emerald" />
          <span className="font-semibold">
            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} sélectionné{selectedLeads.length > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setValue("");
            }}
            className="w-48"
          >
            <option value="">Sélectionner une action</option>
            <option value="update_status">Modifier le statut</option>
            <option value="update_priority">Modifier la priorité</option>
            <option value="delete">Supprimer</option>
          </Select>
          
          {action === "update_status" && (
            <Select 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              className="w-40"
            >
              <option value="">Choisir un statut</option>
              {leadStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </Select>
          )}
          
          {action === "update_priority" && (
            <Select 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              className="w-40"
            >
              <option value="">Choisir une priorité</option>
              <option value="urgent">Urgent</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </Select>
          )}
          
          {action && action !== "delete" && (
            <Button
              onClick={handleExecute}
              disabled={loading || !value}
              className="bg-effinor-emerald hover:bg-effinor-emerald/90"
            >
              {loading ? "Traitement..." : "Appliquer"}
            </Button>
          )}
          
          {action === "delete" && (
            <Button
              onClick={handleExecute}
              disabled={loading}
              variant="destructive"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => onExport(selectedLeads)}
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Exporter
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClearSelection}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}



