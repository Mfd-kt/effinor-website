"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { LeadStatus } from "@/lib/types/lead";

export interface AdvancedSearchFilters {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string[];
  source?: string[];
  priority?: string[];
  dateFrom?: string;
  dateTo?: string;
  scoreMin?: number;
  scoreMax?: number;
  hasPhotos?: boolean;
  hasDetailedForm?: boolean;
  workPostcode?: string;
  workRegion?: string;
  buildingType?: string;
}

interface AdvancedSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: AdvancedSearchFilters) => void;
  leadStatuses?: LeadStatus[];
  sources?: string[];
}

export function AdvancedSearch({
  open,
  onOpenChange,
  onApplyFilters,
  leadStatuses = [],
  sources = []
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({});

  const handleReset = () => {
    setFilters({});
    onApplyFilters({});
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recherche avancée</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Informations de base */}
          <div>
            <h3 className="font-semibold mb-3">Informations de contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nom</label>
                <Input
                  placeholder="Nom complet"
                  value={filters.name || ''}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                <Input
                  placeholder="email@example.com"
                  value={filters.email || ''}
                  onChange={(e) => setFilters({...filters, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Téléphone</label>
                <Input
                  placeholder="+33..."
                  value={filters.phone || ''}
                  onChange={(e) => setFilters({...filters, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Entreprise</label>
                <Input
                  placeholder="Nom de l'entreprise"
                  value={filters.company || ''}
                  onChange={(e) => setFilters({...filters, company: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Filtres de statut et source */}
          <div>
            <h3 className="font-semibold mb-3">Statut et source</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Statut</label>
                <Select
                  value={filters.status?.[0] || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    status: e.target.value ? [e.target.value] : undefined
                  })}
                >
                  <option value="">Tous les statuts</option>
                  {leadStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Source</label>
                <Select
                  value={filters.source?.[0] || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    source: e.target.value ? [e.target.value] : undefined
                  })}
                >
                  <option value="">Toutes les sources</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Priorité</label>
                <Select
                  value={filters.priority?.[0] || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    priority: e.target.value ? [e.target.value] : undefined
                  })}
                >
                  <option value="">Toutes les priorités</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Basse</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="font-semibold mb-3">Période</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Date de début</label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Date de fin</label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Score */}
          <div>
            <h3 className="font-semibold mb-3">Score de complétion</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Score minimum</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={filters.scoreMin || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    scoreMin: e.target.value ? Number(e.target.value) : undefined
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Score maximum</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="100"
                  value={filters.scoreMax || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    scoreMax: e.target.value ? Number(e.target.value) : undefined
                  })}
                />
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div>
            <h3 className="font-semibold mb-3">Informations supplémentaires</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Code postal travaux</label>
                <Input
                  placeholder="94320"
                  value={filters.workPostcode || ''}
                  onChange={(e) => setFilters({...filters, workPostcode: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Région</label>
                <Input
                  placeholder="Île-de-France"
                  value={filters.workRegion || ''}
                  onChange={(e) => setFilters({...filters, workRegion: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Type de bâtiment</label>
                <Input
                  placeholder="entrepot-logistique"
                  value={filters.buildingType || ''}
                  onChange={(e) => setFilters({...filters, buildingType: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Options booléennes */}
          <div>
            <h3 className="font-semibold mb-3">Options</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasPhotos || false}
                  onChange={(e) => setFilters({...filters, hasPhotos: e.target.checked || undefined})}
                  className="rounded"
                />
                <span className="text-sm">Avec photos</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasDetailedForm || false}
                  onChange={(e) => setFilters({...filters, hasDetailedForm: e.target.checked || undefined})}
                  className="rounded"
                />
                <span className="text-sm">Formulaire détaillé rempli</span>
              </label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button
            onClick={handleApply}
            className="bg-effinor-emerald hover:bg-effinor-emerald/90"
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



