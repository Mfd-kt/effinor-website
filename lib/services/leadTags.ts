import { supabase } from '@/lib/supabase/client';

export interface LeadTag {
  id: string;
  leadId: string;
  tag: string;
  color: string;
  createdAt: Date;
  createdBy?: string;
}

export async function getLeadTags(leadId: string): Promise<LeadTag[]> {
  const { data, error } = await supabase
    .from('lead_tags')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching lead tags:', error);
    throw error;
  }
  
  return (data || []).map((item: any) => ({
    id: item.id,
    leadId: item.lead_id,
    tag: item.tag,
    color: item.color || '#3b82f6',
    createdAt: new Date(item.created_at),
    createdBy: item.created_by || undefined,
  }));
}

export async function addLeadTag(leadId: string, tag: string, color: string = '#3b82f6'): Promise<LeadTag> {
  const { data, error } = await supabase
    .from('lead_tags')
    .insert({
      lead_id: leadId,
      tag: tag.trim(),
      color,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding lead tag:', error);
    throw error;
  }
  
  return {
    id: data.id,
    leadId: data.lead_id,
    tag: data.tag,
    color: data.color,
    createdAt: new Date(data.created_at),
    createdBy: data.created_by || undefined,
  };
}

export async function removeLeadTag(leadId: string, tag: string): Promise<void> {
  const { error } = await supabase
    .from('lead_tags')
    .delete()
    .eq('lead_id', leadId)
    .eq('tag', tag);
  
  if (error) {
    console.error('Error removing lead tag:', error);
    throw error;
  }
}

export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('lead_tags')
    .select('tag')
    .order('tag');
  
  if (error) {
    console.error('Error fetching all tags:', error);
    return [];
  }
  
  const uniqueTags = Array.from(new Set((data || []).map((item: any) => item.tag)));
  return uniqueTags;
}



