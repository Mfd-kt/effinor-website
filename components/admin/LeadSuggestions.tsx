"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, CheckCircle } from "lucide-react";
import { Lead } from "@/lib/types/lead";

interface LeadSuggestionsProps {
  lead: Lead;
  onSuggestionClick?: (suggestion: string) => void;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export function LeadSuggestions({ lead, onSuggestionClick }: LeadSuggestionsProps) {
  const suggestions: Suggestion[] = [];
  
  // Suggestions basées sur les données manquantes
  if (!lead.phone) {
    suggestions.push({
      id: 'phone',
      title: 'Ajouter le numéro de téléphone',
      description: 'Le téléphone est manquant, cela améliorerait le score de complétion',
      action: 'Ajouter',
      priority: 'high'
    });
  }
  
  if (!lead.workPostcode) {
    suggestions.push({
      id: 'postcode',
      title: 'Renseigner le code postal des travaux',
      description: 'Permettrait de calculer automatiquement la région et la zone climatique',
      action: 'Renseigner',
      priority: 'high'
    });
  }
  
  if (lead.completionScore !== undefined && lead.completionScore < 50) {
    suggestions.push({
      id: 'complete',
      title: 'Compléter les informations du lead',
      description: `Le score de complétion est de ${lead.completionScore}%, complétez les champs manquants`,
      action: 'Voir les champs',
      priority: 'medium'
    });
  }
  
  if (lead.statusId === 'new') {
    suggestions.push({
      id: 'contact',
      title: 'Contacter le lead',
      description: 'Ce lead est nouveau, pensez à le contacter rapidement',
      action: 'Contacter',
      priority: 'high'
    });
  }

  if (!lead.headquartersAddress && !lead.headquartersCity) {
    suggestions.push({
      id: 'headquarters',
      title: 'Renseigner le siège social',
      description: 'Les informations du siège social sont manquantes',
      action: 'Renseigner',
      priority: 'medium'
    });
  }

  if (!lead.beneficiaryFirstName && !lead.beneficiaryLastName) {
    suggestions.push({
      id: 'beneficiary',
      title: 'Ajouter les informations du bénéficiaire',
      description: 'Les informations du bénéficiaire des travaux sont manquantes',
      action: 'Ajouter',
      priority: 'medium'
    });
  }

  if (!lead.exteriorPhotoUrl && !lead.cadastralPhotoUrl) {
    suggestions.push({
      id: 'photos',
      title: 'Ajouter des photos',
      description: 'Aucune photo n\'a été ajoutée (extérieur ou cadastral)',
      action: 'Ajouter',
      priority: 'low'
    });
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Aucune suggestion pour le moment</p>
          <p className="text-sm mt-1">Toutes les informations importantes sont renseignées</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`p-4 rounded-lg border ${
              suggestion.priority === 'high' 
                ? 'bg-red-50 border-red-200' 
                : suggestion.priority === 'medium'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                <p className="text-sm text-gray-600">{suggestion.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Scroll vers la section correspondante
                  let sectionId: string | null = null;
                  
                  if (suggestion.id === 'phone') {
                    sectionId = 'contact';
                  } else if (suggestion.id === 'postcode') {
                    sectionId = 'work-address';
                  } else if (suggestion.id === 'headquarters') {
                    sectionId = 'headquarters';
                  } else if (suggestion.id === 'beneficiary') {
                    sectionId = 'beneficiary';
                  } else if (suggestion.id === 'photos') {
                    sectionId = 'photos';
                  } else if (suggestion.id === 'complete') {
                    // Scroller vers le score de complétion
                    const scoreElement = document.querySelector('[data-section="completion-score"]');
                    if (scoreElement) {
                      scoreElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      return;
                    }
                  } else if (suggestion.id === 'contact') {
                    // Pour "Contacter le lead", on peut scroller vers les actions rapides ou la section contact
                    sectionId = 'contact';
                  }
                  
                  if (sectionId) {
                    const element = document.getElementById(sectionId);
                    if (element) {
                      // Petit délai pour s'assurer que le DOM est prêt
                      setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Highlight temporairement
                        element.classList.add('ring-2', 'ring-[#10B981]', 'ring-offset-2');
                        setTimeout(() => {
                          element.classList.remove('ring-2', 'ring-[#10B981]', 'ring-offset-2');
                        }, 2000);
                      }, 100);
                    } else {
                      console.warn(`Section with id "${sectionId}" not found`);
                    }
                  }
                  
                  onSuggestionClick?.(suggestion.id);
                }}
                className="flex-shrink-0 cursor-pointer"
                type="button"
              >
                {suggestion.action}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

