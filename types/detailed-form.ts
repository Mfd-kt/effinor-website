/**
 * Types pour le formulaire multi-étapes détaillé
 */

// Étape 1 : Informations sur votre entreprise
export interface Step1CompanyInfo {
  companyName: string;
  siret: string; // 14 chiffres
  address: string;
  postalCode: string;
  city: string;
}

// Étape 2 : Contact principal
export interface Step2MainContact {
  title: 'M.' | 'Mme' | 'Mlle';
  lastName: string;
  firstName: string;
  function: string;
  phone: string;
  email: string;
}

// Étape 3 : Dépenses énergétiques
export type AnnualExpenseRange =
  | 'less-than-10000'
  | '10000-50000'
  | '50000-100000'
  | '100000-500000'
  | 'more-than-500000';

export interface Step3EnergyExpenses {
  annualExpenseRange: AnnualExpenseRange;
}

// Étape 4 : Configuration des bâtiments
export interface Step4BuildingConfig {
  buildingCount: number; // 1 à 10
}

// Étape 5 : Détails du bâtiment
export type BuildingType = 'entrepot' | 'bureau' | 'usine' | 'commerce' | 'autre';

export interface BuildingLighting {
  neon: {
    enabled: boolean;
    count: number | null;
    power: number | null; // W
  };
  doubleNeon: {
    enabled: boolean;
    count: number | null;
    power: number | null; // W
  };
  halogen: {
    enabled: boolean;
    count: number | null;
    power: number | null; // W
  };
}

export interface BuildingHeating {
  isHeated: boolean;
  mode: string | null;
  power: number | null; // kW
  setpoint: number | null; // °C
}

export interface BuildingDetails {
  general: {
    type: BuildingType;
    surface: number; // m²
    height: number | null; // m
  };
  heating: BuildingHeating;
  lighting: BuildingLighting;
}

export interface Step5BuildingDetails {
  buildings: BuildingDetails[];
}

// Structure complète du formulaire détaillé
export interface DetailedFormData {
  step1: Step1CompanyInfo;
  step2: Step2MainContact;
  step3: Step3EnergyExpenses;
  step4: Step4BuildingConfig;
  step5: Step5BuildingDetails;
}

// État partiel du formulaire (pour la sauvegarde progressive)
export type PartialDetailedFormData = Partial<DetailedFormData>;



