"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/lib/types/lead";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadScoreCardProps {
  lead: Lead;
}

interface SectionScore {
  name: string;
  score: number;
  maxScore: number;
  missingFields: Array<{ name: string; points: number }>;
}

export function LeadScoreCard({ lead }: LeadScoreCardProps) {
  const score = lead.completionScore || 0;
  
  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-600";
    if (score < 75) return "text-orange-600";
    return "text-effinor-emerald";
  };

  const getScoreBgColor = (score: number) => {
    if (score < 50) return "bg-red-50 border-red-200";
    if (score < 75) return "bg-orange-50 border-orange-200";
    return "bg-effinor-emerald/10 border-effinor-emerald/20";
  };

  const getProgressColor = (score: number) => {
    if (score < 50) return "bg-red-600";
    if (score < 75) return "bg-orange-600";
    return "bg-effinor-emerald";
  };

  // Calculer les scores par section
  const calculateSectionScores = (): SectionScore[] => {
    const sections: SectionScore[] = [];

    // Section Informations de contact
    let contactScore = 0;
    let contactMax = 30;
    const contactMissing: Array<{ name: string; points: number }> = [];
    
    if (lead.email) contactScore += 10; else contactMissing.push({ name: "Email", points: 10 });
    if (lead.phone) contactScore += 10; else contactMissing.push({ name: "Téléphone", points: 10 });
    if (lead.fullName) contactScore += 10; else contactMissing.push({ name: "Nom complet", points: 10 });
    
    sections.push({
      name: "Informations de contact",
      score: contactScore,
      maxScore: contactMax,
      missingFields: contactMissing,
    });

    // Section Siège Social
    let headquartersScore = 0;
    let headquartersMax = 20;
    const headquartersMissing: Array<{ name: string; points: number }> = [];
    
    if (lead.headquartersAddress) headquartersScore += 5; else headquartersMissing.push({ name: "Adresse du siège", points: 5 });
    if (lead.headquartersCity) headquartersScore += 5; else headquartersMissing.push({ name: "Ville siège", points: 5 });
    if (lead.headquartersPostcode) headquartersScore += 5; else headquartersMissing.push({ name: "Code postal siège", points: 5 });
    if (lead.siretNumber) headquartersScore += 3; else headquartersMissing.push({ name: "SIRET", points: 3 });
    if (lead.sirenNumber) headquartersScore += 3; else headquartersMissing.push({ name: "SIREN", points: 3 });
    
    sections.push({
      name: "Siège Social",
      score: headquartersScore,
      maxScore: headquartersMax,
      missingFields: headquartersMissing,
    });

    // Section Adresse des travaux
    let workScore = 0;
    let workMax = 36;
    const workMissing: Array<{ name: string; points: number }> = [];
    
    if (lead.workAddress) workScore += 8; else workMissing.push({ name: "Adresse des travaux", points: 8 });
    if (lead.workCity) workScore += 8; else workMissing.push({ name: "Ville travaux", points: 8 });
    if (lead.workPostcode) workScore += 8; else workMissing.push({ name: "Code postal travaux", points: 8 });
    if (lead.workCompanyName) workScore += 5; else workMissing.push({ name: "Raison sociale", points: 5 });
    if (lead.workRegion) workScore += 5; else workMissing.push({ name: "Région", points: 5 });
    if (lead.workClimateZone) workScore += 5; else workMissing.push({ name: "Zone climatique", points: 5 });
    if (lead.workSiret) workScore += 3; else workMissing.push({ name: "SIRET travaux", points: 3 });
    
    sections.push({
      name: "Adresse des travaux",
      score: workScore,
      maxScore: workMax,
      missingFields: workMissing,
    });

    // Section Bénéficiaire
    let beneficiaryScore = 0;
    let beneficiaryMax = 34;
    const beneficiaryMissing: Array<{ name: string; points: number }> = [];
    
    if (lead.beneficiaryEmail) beneficiaryScore += 8; else beneficiaryMissing.push({ name: "Email bénéficiaire", points: 8 });
    if (lead.beneficiaryPhone) beneficiaryScore += 8; else beneficiaryMissing.push({ name: "Téléphone bénéficiaire", points: 8 });
    if (lead.beneficiaryFirstName) beneficiaryScore += 8; else beneficiaryMissing.push({ name: "Prénom bénéficiaire", points: 8 });
    if (lead.beneficiaryLastName) beneficiaryScore += 8; else beneficiaryMissing.push({ name: "Nom bénéficiaire", points: 8 });
    if (lead.beneficiaryTitle) beneficiaryScore += 5; else beneficiaryMissing.push({ name: "Civilité", points: 5 });
    if (lead.beneficiaryFunction) beneficiaryScore += 5; else beneficiaryMissing.push({ name: "Fonction", points: 5 });
    if (lead.beneficiaryLandline) beneficiaryScore += 5; else beneficiaryMissing.push({ name: "Téléphone fixe", points: 5 });
    
    sections.push({
      name: "Bénéficiaire",
      score: beneficiaryScore,
      maxScore: beneficiaryMax,
      missingFields: beneficiaryMissing,
    });

    // Section Cadastre
    let cadastralScore = 0;
    let cadastralMax = 13;
    const cadastralMissing: Array<{ name: string; points: number }> = [];
    
    if (lead.cadastralParcel) cadastralScore += 5; else cadastralMissing.push({ name: "Parcelle cadastrale", points: 5 });
    if (lead.surfaceM2 && lead.surfaceM2 > 0) cadastralScore += 5; else cadastralMissing.push({ name: "Surface m²", points: 5 });
    if (lead.qualificationScore && lead.qualificationScore > 0) cadastralScore += 3; else cadastralMissing.push({ name: "Score de qualification", points: 3 });
    
    sections.push({
      name: "Informations cadastrales",
      score: cadastralScore,
      maxScore: cadastralMax,
      missingFields: cadastralMissing,
    });

    // Section Photos
    let photosScore = 0;
    let photosMax = 6;
    const photosMissing: Array<{ name: string; points: number }> = [];
    
    if (lead.exteriorPhotoUrl) photosScore += 3; else photosMissing.push({ name: "Photo extérieure", points: 3 });
    if (lead.cadastralPhotoUrl) photosScore += 3; else photosMissing.push({ name: "Photo cadastrale", points: 3 });
    
    sections.push({
      name: "Photos",
      score: photosScore,
      maxScore: photosMax,
      missingFields: photosMissing,
    });

    return sections;
  };

  const sections = calculateSectionScores();
  const allMissingFields = sections.flatMap(s => s.missingFields);

  return (
    <Card className={cn("border-2", getScoreBgColor(score))}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Score de complétion
              {score >= 75 ? (
                <CheckCircle2 className="h-5 w-5 text-effinor-emerald" />
              ) : score >= 50 ? (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </CardTitle>
            <CardDescription>
              Évaluation du taux de complétion des informations du lead
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={cn("text-3xl font-bold", getScoreColor(score))}>
              {score}/100
            </div>
            <Badge
              variant={score >= 75 ? "default" : score >= 50 ? "secondary" : "destructive"}
              className="mt-1"
            >
              {score >= 75 ? "Complet" : score >= 50 ? "Partiel" : "Incomplet"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barre de progression globale */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-effinor-gray-text">Progression globale</span>
            <span className={cn("font-semibold", getScoreColor(score))}>{score}%</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-effinor-gray-medium">
            <div
              className={cn("h-full transition-all", getProgressColor(score))}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Scores par section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-effinor-gray-dark">Détail par section</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {sections.map((section) => {
              const sectionPercentage = section.maxScore > 0 
                ? Math.round((section.score / section.maxScore) * 100) 
                : 0;
              
              return (
                <div
                  key={section.name}
                  className="p-3 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-effinor-gray-dark">
                      {section.name}
                    </span>
                    <span className="text-sm font-semibold text-effinor-gray-text">
                      {section.score}/{section.maxScore}
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-effinor-gray-medium">
            <div
              className="h-full bg-effinor-emerald transition-all"
              style={{ width: `${sectionPercentage}%` }}
            />
          </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Champs manquants */}
        {allMissingFields.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-effinor-gray-dark">
              Champs manquants ({allMissingFields.length})
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {allMissingFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-effinor-gray-light text-sm"
                >
                  <span className="text-effinor-gray-text">{field.name}</span>
                  <Badge variant="outline" className="text-xs">
                    +{field.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {allMissingFields.length === 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-effinor-emerald">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Tous les champs sont remplis !</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

