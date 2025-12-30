export interface LeadStatus {
  id: string;
  label: string;
  color: string;
  order: number;
  active: boolean;
}

export type LeadSource =
  | "website"
  | "email"
  | "phone"
  | "referral"
  | "social"
  | "other";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  statusId: string;
  status?: LeadStatus;
  priority: LeadPriority;
  score: number;
  potentialRevenue: number;
  notes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Section Siège Social
  headquartersAddress?: string;
  headquartersCity?: string;
  headquartersPostcode?: string;
  siretNumber?: string;
  sirenNumber?: string;
  
  // Section Adresse des travaux
  workCompanyName?: string;
  workAddress?: string;
  workCity?: string;
  workPostcode?: string;
  workSiret?: string;
  workRegion?: string;
  workClimateZone?: string;
  
  // Section Bénéficiaire
  beneficiaryTitle?: string;
  beneficiaryLastName?: string;
  beneficiaryFirstName?: string;
  beneficiaryFunction?: string;
  beneficiaryPhone?: string;
  beneficiaryEmail?: string;
  beneficiaryLandline?: string;
  
  // Section Cadastre
  cadastralParcel?: string;
  qualificationScore?: number; // 0-10
  surfaceM2?: number;
  
  // Section Photos
  exteriorPhotoUrl?: string;
  cadastralPhotoUrl?: string;
  
  // Type de bâtiment
  buildingType?: string; // entrepot-logistique, bureau, usine-production, commerce-retail, autre-batiment
  
  // Score de complétion
  completionScore?: number; // 0-100
}

