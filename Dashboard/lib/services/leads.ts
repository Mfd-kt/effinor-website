import { supabase } from '@/lib/supabase/client';
import { Lead, LeadStatus, LeadSource, LeadPriority } from '@/lib/types/lead';

// Mapping des statuts depuis la base vers notre format
function mapStatus(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    'new': { label: 'Nouveau', color: '#3b82f6' },
    'in_progress': { label: 'En cours', color: '#f59e0b' },
    'qualified': { label: 'Qualifié', color: '#8b5cf6' },
    'won': { label: 'Gagné', color: '#10b981' },
    'lost': { label: 'Perdu', color: '#ef4444' },
  };
  return statusMap[status] || { label: status, color: '#6b7280' };
}

function mapLead(item: any): Lead {
  const fullName = item.name || 'Sans nom';

  // Mapper la source depuis origin
  let source: LeadSource = 'other';
  if (item.origin) {
    const originLower = item.origin.toLowerCase();
    if (originLower.includes('website') || originLower.includes('site')) {
      source = 'website';
    } else if (originLower.includes('email')) {
      source = 'email';
    } else if (originLower.includes('phone') || originLower.includes('téléphone')) {
      source = 'phone';
    } else if (originLower.includes('referral') || originLower.includes('recommandation')) {
      source = 'referral';
    } else if (originLower.includes('social') || originLower.includes('réseau')) {
      source = 'social';
    }
  }

  // Extraire le prénom et nom depuis name (fallback si beneficiary n'existe pas)
  const nameParts = fullName.split(' ');
  const firstName = item.beneficiary_first_name || nameParts[0] || '';
  const lastName = item.beneficiary_last_name || nameParts.slice(1).join(' ') || '';

  // Priorité par défaut medium (pas de colonne priorité dans le schéma)
  const priority: LeadPriority = 'medium';

  return {
    id: item.id,
    firstName,
    lastName,
    fullName,
    email: item.email || '',
    phone: item.phone,
    company: item.company,
    source,
    statusId: item.status,
    status: {
      id: item.status,
      label: mapStatus(item.status).label,
      color: mapStatus(item.status).color,
      order: 0,
      active: true,
    },
    priority,
    score: 0, // Pas de score dans le schéma
    potentialRevenue: 0, // Pas de budget dans le schéma
    notes: item.message || item.internal_notes,
    assignedTo: undefined, // Pas de commercial assigné dans le schéma
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.created_at), // Pas de updated_at dans le schéma
    
    // Section Siège Social
    headquartersAddress: item.headquarters_address || undefined,
    headquartersCity: item.headquarters_city || undefined,
    headquartersPostcode: item.headquarters_postcode || undefined,
    siretNumber: item.siret_number || undefined,
    sirenNumber: item.siren_number || undefined,
    
    // Section Adresse des travaux
    workCompanyName: item.work_company_name || undefined,
    workAddress: item.work_address || undefined,
    workCity: item.work_city || undefined,
    workPostcode: item.work_postcode || undefined,
    workSiret: item.work_siret || undefined,
    workRegion: item.work_region || undefined,
    workClimateZone: item.work_climate_zone || undefined,
    
    // Section Bénéficiaire
    beneficiaryTitle: item.beneficiary_title || undefined,
    beneficiaryLastName: item.beneficiary_last_name || undefined,
    beneficiaryFirstName: item.beneficiary_first_name || undefined,
    beneficiaryFunction: item.beneficiary_function || undefined,
    beneficiaryPhone: item.beneficiary_phone || undefined,
    beneficiaryEmail: item.beneficiary_email || undefined,
    beneficiaryLandline: item.beneficiary_landline || undefined,
    
    // Section Cadastre
    cadastralParcel: item.cadastral_parcel || undefined,
    qualificationScore: item.qualification_score !== null && item.qualification_score !== undefined ? Number(item.qualification_score) : undefined,
    surfaceM2: item.surface_m2 !== null && item.surface_m2 !== undefined ? Number(item.surface_m2) : undefined,
    
    // Section Photos
    exteriorPhotoUrl: item.exterior_photo_url || undefined,
    cadastralPhotoUrl: item.cadastral_photo_url || undefined,
    
    // Score de complétion
    completionScore: item.completion_score !== null && item.completion_score !== undefined ? Number(item.completion_score) : undefined,
  };
}

export async function getLeads(): Promise<Lead[]> {
  try {
    // Vérifier si Supabase est configuré
    const { isSupabaseConfigured } = await import('@/lib/supabase/client');
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase n\'est pas configuré ! Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY');
      return [];
    }

    console.log('🔍 Fetching leads from Supabase...');
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching leads:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    if (!data) {
      console.warn('⚠️ No leads data returned from Supabase (data is null)');
      return [];
    }

    if (data.length === 0) {
      console.warn('⚠️ No leads found in Supabase (empty array)');
      return [];
    }

    console.log('✅ Fetched leads from Supabase:', data.length, 'leads');
    console.log('Sample lead data:', JSON.stringify(data[0], null, 2));
    
    const mappedLeads = data.map(mapLead);
    console.log('✅ Mapped leads:', mappedLeads.length, 'leads');
    if (mappedLeads.length > 0) {
      console.log('Sample mapped lead:', JSON.stringify(mappedLeads[0], null, 2));
    }
    
    return mappedLeads;
  } catch (error) {
    console.error('❌ Exception in getLeads:', error);
    throw error;
  }
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lead:', error);
    return null;
  }

  return data ? mapLead(data) : null;
}

// Fonction pour récupérer les données brutes d'un lead (avec tous les champs)
export async function getLeadRaw(id: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lead raw:', error);
    return null;
  }

  return data;
}

export async function updateLead(id: string, lead: Partial<Lead & { categoryId?: string }>): Promise<Lead | null> {
  const updateData: any = {};

  // Mapper les champs modifiables de base
  if (lead.fullName !== undefined || lead.firstName !== undefined || lead.lastName !== undefined) {
    // Reconstruire le nom complet
    const fullName = lead.fullName || `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
    updateData.name = fullName;
  }

  if (lead.email !== undefined) {
    updateData.email = lead.email;
  }

  if (lead.phone !== undefined) {
    updateData.phone = lead.phone;
  }

  if (lead.company !== undefined) {
    updateData.company = lead.company;
  }

  if (lead.statusId !== undefined) {
    updateData.status = lead.statusId;
  }

  if (lead.notes !== undefined) {
    updateData.internal_notes = lead.notes;
  }

  // Gérer category_id si fourni
  if ('categoryId' in lead) {
    updateData.category_id = lead.categoryId || null;
  }

  // Section Siège Social
  if (lead.headquartersAddress !== undefined) updateData.headquarters_address = lead.headquartersAddress || null;
  if (lead.headquartersCity !== undefined) updateData.headquarters_city = lead.headquartersCity || null;
  if (lead.headquartersPostcode !== undefined) updateData.headquarters_postcode = lead.headquartersPostcode || null;
  if (lead.siretNumber !== undefined) updateData.siret_number = lead.siretNumber || null;
  if (lead.sirenNumber !== undefined) updateData.siren_number = lead.sirenNumber || null;

  // Section Adresse des travaux
  if (lead.workCompanyName !== undefined) updateData.work_company_name = lead.workCompanyName || null;
  if (lead.workAddress !== undefined) updateData.work_address = lead.workAddress || null;
  if (lead.workCity !== undefined) updateData.work_city = lead.workCity || null;
  if (lead.workPostcode !== undefined) updateData.work_postcode = lead.workPostcode || null;
  if (lead.workSiret !== undefined) updateData.work_siret = lead.workSiret || null;
  if (lead.workRegion !== undefined) updateData.work_region = lead.workRegion || null;
  if (lead.workClimateZone !== undefined) updateData.work_climate_zone = lead.workClimateZone || null;

  // Section Bénéficiaire
  if (lead.beneficiaryTitle !== undefined) updateData.beneficiary_title = lead.beneficiaryTitle || null;
  if (lead.beneficiaryLastName !== undefined) updateData.beneficiary_last_name = lead.beneficiaryLastName || null;
  if (lead.beneficiaryFirstName !== undefined) updateData.beneficiary_first_name = lead.beneficiaryFirstName || null;
  if (lead.beneficiaryFunction !== undefined) updateData.beneficiary_function = lead.beneficiaryFunction || null;
  if (lead.beneficiaryPhone !== undefined) updateData.beneficiary_phone = lead.beneficiaryPhone || null;
  if (lead.beneficiaryEmail !== undefined) updateData.beneficiary_email = lead.beneficiaryEmail || null;
  if (lead.beneficiaryLandline !== undefined) updateData.beneficiary_landline = lead.beneficiaryLandline || null;

  // Section Cadastre
  if (lead.cadastralParcel !== undefined) updateData.cadastral_parcel = lead.cadastralParcel || null;
  if (lead.qualificationScore !== undefined) updateData.qualification_score = lead.qualificationScore !== null && lead.qualificationScore !== undefined ? lead.qualificationScore : null;
  if (lead.surfaceM2 !== undefined) updateData.surface_m2 = lead.surfaceM2 !== null && lead.surfaceM2 !== undefined ? lead.surfaceM2 : null;

  // Section Photos
  if (lead.exteriorPhotoUrl !== undefined) updateData.exterior_photo_url = lead.exteriorPhotoUrl || null;
  if (lead.cadastralPhotoUrl !== undefined) updateData.cadastral_photo_url = lead.cadastralPhotoUrl || null;

  const { data, error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating lead:', error);
    throw error;
  }

  return data ? mapLead(data) : null;
}

// Pas de table lead_statuses, retourner les statuts possibles
export async function getLeadStatuses(): Promise<LeadStatus[]> {
  return [
    { id: 'new', label: 'Nouveau', color: '#3b82f6', order: 0, active: true },
    { id: 'in_progress', label: 'En cours', color: '#f59e0b', order: 1, active: true },
    { id: 'qualified', label: 'Qualifié', color: '#8b5cf6', order: 2, active: true },
    { id: 'won', label: 'Gagné', color: '#10b981', order: 3, active: true },
    { id: 'lost', label: 'Perdu', color: '#ef4444', order: 4, active: true },
  ];
}

/**
 * Calcule la zone climatique (H1, H2, H3) à partir du code postal
 * Réplique la logique de la fonction PostgreSQL calculate_climate_zone()
 */
export function calculateClimateZone(postcode: string | null | undefined): string | null {
  // Si le code postal est NULL ou vide, retourner NULL
  if (!postcode || postcode.trim() === '') {
    return null;
  }

  // Extraire uniquement les chiffres du code postal
  const digitsOnly = postcode.replace(/\D/g, '');
  
  // Si aucun chiffre trouvé, retourner "Zone inconnue"
  if (digitsOnly === '') {
    return 'Zone inconnue';
  }

  // Déterminer le code département
  let deptCode: string;
  // Pour les départements 97 et 98 (DOM-TOM), prendre les 3 premiers chiffres
  if (digitsOnly.substring(0, 2) === '97' || digitsOnly.substring(0, 2) === '98') {
    deptCode = digitsOnly.substring(0, 3);
  } else {
    // Pour les autres départements, prendre les 2 premiers chiffres
    deptCode = digitsOnly.substring(0, 2);
  }

  // Convertir en nombre pour la comparaison
  const deptNum = parseInt(deptCode, 10);
  
  // Vérifier si la conversion a réussi
  if (isNaN(deptNum)) {
    return 'Zone inconnue';
  }

  // Zone H1
  const h1Departments = [1, 2, 3, 5, 8, 10, 14, 15, 19, 21, 23, 25, 27, 28, 38, 39, 42, 43, 45, 51, 52, 54, 55, 57, 58, 59, 60, 61, 62, 63, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 78, 80, 87, 88, 89, 90, 91, 92, 93, 94, 95, 975];
  if (h1Departments.includes(deptNum)) {
    return 'H1';
  }

  // Zone H2
  const h2Departments = [4, 7, 9, 12, 16, 17, 18, 22, 24, 26, 29, 31, 32, 33, 35, 36, 37, 40, 41, 44, 46, 47, 48, 49, 50, 53, 56, 64, 65, 72, 79, 81, 82, 84, 85, 86];
  if (h2Departments.includes(deptNum)) {
    return 'H2';
  }

  // Zone H3
  const h3Departments = [6, 11, 13, 20, 30, 34, 66, 83, 971, 972, 973, 974, 976];
  if (h3Departments.includes(deptNum)) {
    return 'H3';
  }

  // Si aucun match, retourner "Zone inconnue"
  return 'Zone inconnue';
}

/**
 * Calcule la région française à partir d'un code postal.
 * Réplique la logique de la fonction PostgreSQL et du script Airtable.
 */
export function calculateRegion(postcode: string): string {
  if (!postcode) return "";

  // Supprimer tous les espaces (y compris insécables)
  let rawCode = postcode.replace(/\s/g, '');

  // Si aucun chiffre trouvé, retourner "Code postal à remplir"
  if (rawCode === '') {
    return "Code postal à remplir";
  }

  // Vérifier que le code ne contient que 4 ou 5 chiffres
  if (!/^\d{4,5}$/.test(rawCode)) {
    return "Erreur de format";
  }

  // Ajouter un 0 devant si code à 4 chiffres
  if (rawCode.length === 4) {
    rawCode = "0" + rawCode;
  }

  // Extraire les 2 premiers chiffres (code département)
  const codeDept = rawCode.substring(0, 2);

  // Déterminer la région selon le code département
  switch (codeDept) {
    // Auvergne-Rhône-Alpes
    case "01":
    case "03":
    case "07":
    case "15":
    case "26":
    case "38":
    case "42":
    case "43":
    case "63":
    case "69":
    case "73":
    case "74":
      return "Auvergne-Rhône-Alpes";

    // Hauts-de-France
    case "02":
    case "59":
    case "60":
    case "62":
    case "80":
      return "Hauts-de-France";

    // Provence-Alpes-Côte d'Azur
    case "04":
    case "05":
    case "06":
    case "13":
    case "83":
    case "84":
      return "Provence-Alpes-Côte d'Azur";

    // Grand Est
    case "08":
    case "10":
    case "51":
    case "52":
    case "54":
    case "55":
    case "57":
    case "67":
    case "68":
    case "88":
      return "Grand Est";

    // Occitanie
    case "09":
    case "11":
    case "12":
    case "30":
    case "31":
    case "32":
    case "34":
    case "46":
    case "48":
    case "65":
    case "66":
    case "81":
    case "82":
      return "Occitanie";

    // Normandie
    case "14":
    case "27":
    case "50":
    case "61":
    case "76":
      return "Normandie";

    // Nouvelle-Aquitaine
    case "16":
    case "17":
    case "19":
    case "23":
    case "24":
    case "33":
    case "40":
    case "47":
    case "64":
    case "79":
    case "86":
    case "87":
      return "Nouvelle-Aquitaine";

    // Centre-Val de Loire
    case "18":
    case "28":
    case "36":
    case "37":
    case "41":
    case "45":
      return "Centre-Val de Loire";

    // Bourgogne-Franche-Comté
    case "21":
    case "25":
    case "39":
    case "58":
    case "70":
    case "71":
    case "89":
    case "90":
      return "Bourgogne-Franche-Comté";

    // Bretagne
    case "22":
    case "29":
    case "35":
    case "56":
      return "Bretagne";

    // Pays de la Loire
    case "44":
    case "49":
    case "53":
    case "72":
    case "85":
      return "Pays de la Loire";

    // Île-de-France
    case "75":
    case "77":
    case "78":
    case "91":
    case "92":
    case "93":
    case "94":
    case "95":
      return "Île-de-France";

    // Par défaut, région inconnue
    default:
      return "Région inconnue";
  }
}
