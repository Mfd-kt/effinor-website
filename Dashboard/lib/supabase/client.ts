"use client";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log pour déboguer (seulement en développement)
if (typeof window !== 'undefined') {
  console.log('🔍 Configuration Supabase:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPreview: supabaseUrl ? (supabaseUrl.length > 30 ? supabaseUrl.substring(0, 30) + '...' : supabaseUrl) : 'undefined',
    keyPreview: supabaseAnonKey ? (supabaseAnonKey.length > 20 ? supabaseAnonKey.substring(0, 20) + '...' : supabaseAnonKey) : 'undefined',
  });
}

// Vérifier si on a des valeurs valides (pas de placeholder)
const hasValidConfig = supabaseUrl && 
                       supabaseAnonKey && 
                       supabaseUrl !== 'your_supabase_project_url' && 
                       supabaseAnonKey !== 'your_supabase_anon_key' &&
                       !supabaseUrl.includes('placeholder') &&
                       supabaseUrl.trim() !== '';

// Créer le client Supabase seulement si configuré, sinon créer un mock silencieux
export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      auth: {
        getUser: async () => {
          // Ne pas logger d'erreur, juste retourner null silencieusement
          // Ne pas créer d'erreur AuthSessionMissingError
          return { 
            data: { user: null }, 
            error: null 
          };
        },
        getSession: async () => ({ 
          data: { session: null }, 
          error: null 
        }),
        signOut: async () => ({ error: null }),
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => {
              console.warn(`⚠️ Supabase non configuré - Mock appelé pour ${table}.${column}=${value}`);
              return { data: null, error: null };
            },
            order: (column: string, options?: any) => ({
              limit: async (count?: number) => {
                console.warn(`⚠️ Supabase non configuré - Mock appelé pour ${table} (limit: ${count})`);
                return { data: [], error: null };
              },
            }),
          }),
          order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
          single: async () => {
            console.warn(`⚠️ Supabase non configuré - Mock appelé pour ${table}.single()`);
            return { data: null, error: null };
          },
        }),
        insert: (values: any) => ({
          select: (columns?: string) => ({
            single: async () => {
              console.warn(`⚠️ Supabase non configuré - Mock appelé pour insert dans ${table}`);
              return { data: null, error: null };
            },
          }),
        }),
        update: (values: any) => ({
          eq: (column: string, value: any) => ({
            select: (columns?: string) => ({
              single: async () => {
                console.warn(`⚠️ Supabase non configuré - Mock appelé pour update ${table}.${column}=${value}`);
                return { data: null, error: null };
              },
            }),
          }),
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            select: async () => {
              console.warn(`⚠️ Supabase non configuré - Mock appelé pour delete ${table}.${column}=${value}`);
              return { data: null, error: null };
            },
          }),
        }),
      }),
    } as any);

// Export une fonction pour vérifier si Supabase est configuré
export const isSupabaseConfigured = () => {
  const configured = hasValidConfig;
  if (!configured) {
    console.warn('⚠️ Supabase non configuré:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlValue: supabaseUrl ? (supabaseUrl.length > 30 ? supabaseUrl.substring(0, 30) + '...' : supabaseUrl) : 'undefined',
    });
  } else {
    console.log('✅ Supabase configuré correctement');
  }
  return configured;
};

