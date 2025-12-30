import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              // Log pour déboguer (seulement en développement)
              if (process.env.NODE_ENV === 'development') {
                console.log(`🍪 Setting cookie: ${name} (length: ${value?.length || 0})`);
              }
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ Error setting cookies in Server Action:', error);
            }
          }
        },
      },
    }
  );
}

