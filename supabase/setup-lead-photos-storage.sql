-- Script pour créer le bucket Supabase Storage pour les photos de leads
-- et configurer les permissions RLS

-- Créer le bucket lead-photos s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-photos',
  'lead-photos',
  true, -- Public pour permettre l'accès aux images
  10485760, -- 10MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les politiques existantes si elles existent (pour éviter les erreurs)
DROP POLICY IF EXISTS "Allow authenticated users to upload lead photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to upload lead photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to lead photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete lead photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to delete lead photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update lead photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to update lead photos" ON storage.objects;

-- Politique RLS : Permettre l'upload pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to upload lead photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lead-photos' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- Politique RLS : Permettre l'upload pour les utilisateurs anonymes (développement)
-- ⚠️ À supprimer en production si vous n'avez pas besoin d'uploads anonymes
CREATE POLICY "Allow anonymous users to upload lead photos"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'lead-photos' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- Politique RLS : Permettre la lecture publique
CREATE POLICY "Allow public read access to lead photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'lead-photos');

-- Politique RLS : Permettre la suppression pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to delete lead photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'lead-photos');

-- Politique RLS : Permettre la suppression pour les utilisateurs anonymes (développement)
-- ⚠️ À supprimer en production si vous n'avez pas besoin de suppressions anonymes
CREATE POLICY "Allow anonymous users to delete lead photos"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'lead-photos');

-- Politique RLS : Permettre la mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to update lead photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'lead-photos');

-- Politique RLS : Permettre la mise à jour pour les utilisateurs anonymes (développement)
-- ⚠️ À supprimer en production si vous n'avez pas besoin de mises à jour anonymes
CREATE POLICY "Allow anonymous users to update lead photos"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'lead-photos');

-- Note: En développement, vous pouvez aussi permettre l'accès anonyme
-- en créant une politique pour anon, mais ce n'est pas recommandé en production

