import { supabase } from '@/lib/supabase/client';

export interface LeadHistoryEntry {
  id: string;
  leadId: string;
  userId?: string;
  userName?: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'merged' | 'note_added' | 'email_sent' | 'call_made';
  field?: string;
  oldValue?: any;
  newValue?: any;
  description: string;
  metadata?: any;
  timestamp: Date;
  createdAt: Date;
}

function mapHistoryEntry(item: any): LeadHistoryEntry {
  return {
    id: item.id,
    leadId: item.lead_id,
    userId: item.user_id || undefined,
    userName: item.user_name || undefined,
    action: item.action,
    field: item.field || undefined,
    oldValue: item.old_value || undefined,
    newValue: item.new_value || undefined,
    description: item.description,
    metadata: item.metadata || undefined,
    timestamp: new Date(item.timestamp),
    createdAt: new Date(item.created_at),
  };
}

export async function getLeadHistory(leadId: string): Promise<LeadHistoryEntry[]> {
  const { data, error } = await supabase
    .from('lead_history')
    .select('*')
    .eq('lead_id', leadId)
    .order('timestamp', { ascending: false });
  
  if (error) {
    console.error('Error fetching lead history:', error);
    throw error;
  }
  
  return (data || []).map(mapHistoryEntry);
}

export async function logLeadChange(
  leadId: string,
  action: LeadHistoryEntry['action'],
  description: string,
  field?: string,
  oldValue?: any,
  newValue?: any,
  metadata?: any
): Promise<void> {
  try {
    const { error } = await supabase
      .from('lead_history')
      .insert({
        lead_id: leadId,
        action,
        field: field || null,
        old_value: oldValue ? JSON.stringify(oldValue) : null,
        new_value: newValue ? JSON.stringify(newValue) : null,
        description,
        metadata: metadata || null,
        timestamp: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error logging lead change:', error);
      // Ne pas throw pour ne pas bloquer l'opération principale
    }
  } catch (error) {
    console.error('Exception logging lead change:', error);
  }
}

function generateDescription(
  action: LeadHistoryEntry['action'],
  field?: string,
  oldValue?: any,
  newValue?: any
): string {
  switch (action) {
    case 'created':
      return 'Lead créé';
    case 'updated':
      if (field) {
        return `Champ "${field}" modifié`;
      }
      return 'Lead mis à jour';
    case 'status_changed':
      return `Statut changé de "${oldValue || 'N/A'}" à "${newValue || 'N/A'}"`;
    case 'merged':
      return 'Lead fusionné avec d\'autres leads';
    case 'note_added':
      return 'Note ajoutée';
    case 'email_sent':
      return 'Email envoyé';
    case 'call_made':
      return 'Appel effectué';
    default:
      return 'Action effectuée';
  }
}



