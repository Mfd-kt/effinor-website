import { supabase } from '@/lib/supabase/client';

export interface LeadReminder {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  createdBy?: string;
}

function mapReminder(item: any): LeadReminder {
  return {
    id: item.id,
    leadId: item.lead_id,
    title: item.title,
    description: item.description || undefined,
    dueDate: new Date(item.due_date),
    completed: item.completed || false,
    completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
    createdAt: new Date(item.created_at),
    createdBy: item.created_by || undefined,
  };
}

export async function getLeadReminders(leadId: string): Promise<LeadReminder[]> {
  const { data, error } = await supabase
    .from('lead_reminders')
    .select('*')
    .eq('lead_id', leadId)
    .order('due_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching lead reminders:', error);
    throw error;
  }
  
  return (data || []).map(mapReminder);
}

export async function getUpcomingReminders(limit: number = 10): Promise<LeadReminder[]> {
  const { data, error } = await supabase
    .from('lead_reminders')
    .select('*')
    .eq('completed', false)
    .gte('due_date', new Date().toISOString())
    .order('due_date', { ascending: true })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching upcoming reminders:', error);
    throw error;
  }
  
  return (data || []).map(mapReminder);
}

export async function createLeadReminder(
  leadId: string,
  title: string,
  dueDate: Date,
  description?: string
): Promise<LeadReminder> {
  const { data, error } = await supabase
    .from('lead_reminders')
    .insert({
      lead_id: leadId,
      title,
      description: description || null,
      due_date: dueDate.toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating lead reminder:', error);
    throw error;
  }
  
  return mapReminder(data);
}

export async function completeReminder(reminderId: string): Promise<void> {
  const { error } = await supabase
    .from('lead_reminders')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq('id', reminderId);
  
  if (error) {
    console.error('Error completing reminder:', error);
    throw error;
  }
}

export async function deleteReminder(reminderId: string): Promise<void> {
  const { error } = await supabase
    .from('lead_reminders')
    .delete()
    .eq('id', reminderId);
  
  if (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
}



