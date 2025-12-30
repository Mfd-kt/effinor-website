import { supabase } from '@/lib/supabase/client';

export interface SavedView {
  id: string;
  userId?: string;
  name: string;
  filters: {
    status?: string[];
    source?: string[];
    priority?: string[];
    dateRange?: { from: string; to: string };
    scoreRange?: { min: number; max: number };
    hasTags?: string[];
    search?: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  columns?: string[];
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function mapSavedView(item: any): SavedView {
  return {
    id: item.id,
    userId: item.user_id || undefined,
    name: item.name,
    filters: item.filters || {},
    sortBy: item.sort_by || undefined,
    sortOrder: item.sort_order || undefined,
    columns: item.columns || undefined,
    isDefault: item.is_default || false,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  };
}

export async function getSavedViews(): Promise<SavedView[]> {
  const { data, error } = await supabase
    .from('saved_views')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching saved views:', error);
    throw error;
  }
  
  return (data || []).map(mapSavedView);
}

export async function saveView(view: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedView> {
  const { data, error } = await supabase
    .from('saved_views')
    .insert({
      name: view.name,
      filters: view.filters,
      sort_by: view.sortBy || null,
      sort_order: view.sortOrder || null,
      columns: view.columns || null,
      is_default: view.isDefault || false,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving view:', error);
    throw error;
  }
  
  return mapSavedView(data);
}

export async function updateSavedView(id: string, updates: Partial<SavedView>): Promise<SavedView> {
  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.filters !== undefined) updateData.filters = updates.filters;
  if (updates.sortBy !== undefined) updateData.sort_by = updates.sortBy;
  if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;
  if (updates.columns !== undefined) updateData.columns = updates.columns;
  if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;
  
  const { data, error } = await supabase
    .from('saved_views')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating saved view:', error);
    throw error;
  }
  
  return mapSavedView(data);
}

export async function deleteSavedView(id: string): Promise<void> {
  const { error } = await supabase
    .from('saved_views')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting saved view:', error);
    throw error;
  }
}



