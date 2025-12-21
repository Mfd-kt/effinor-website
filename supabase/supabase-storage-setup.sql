-- Script SQL pour configurer les buckets Supabase Storage et leurs politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Créer le bucket pour les images de produits (s'il n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Créer le bucket pour les documents PDF (s'il n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-documents', 'product-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les politiques existantes si elles existent (pour éviter les erreurs)
DROP POLICY IF EXISTS "Allow authenticated users to upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to update product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload product documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to upload product documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to product documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete product documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to delete product documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update product documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to update product documents" ON storage.objects;

-- 3. Politique RLS pour permettre l'upload d'images (authentifiés)
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- 3b. Politique RLS pour permettre l'upload d'images (anonymes - développement)
-- ⚠️ À supprimer en production si vous n'avez pas besoin d'uploads anonymes
CREATE POLICY "Allow anonymous users to upload product images"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- 4. Politique RLS pour permettre la lecture des images (public)
CREATE POLICY "Allow public read access to product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 5. Politique RLS pour permettre la suppression d'images (authentifiés)
CREATE POLICY "Allow authenticated users to delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- 5b. Politique RLS pour permettre la suppression d'images (anonymes - développement)
-- ⚠️ À supprimer en production si vous n'avez pas besoin de suppressions anonymes
CREATE POLICY "Allow anonymous users to delete product images"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'product-images');

-- 6. Politique RLS pour permettre l'upload de PDF (authentifiés)
CREATE POLICY "Allow authenticated users to upload product documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-documents' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- 6b. Politique RLS pour permettre l'upload de PDF (anonymes - développement)
-- ⚠️ À supprimer en production si vous n'avez pas besoin d'uploads anonymes
CREATE POLICY "Allow anonymous users to upload product documents"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'product-documents' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- 7. Politique RLS pour permettre la lecture des PDF (public)
CREATE POLICY "Allow public read access to product documents"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-documents');

-- 8. Politique RLS pour permettre la suppression de PDF (authentifiés)
CREATE POLICY "Allow authenticated users to delete product documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-documents');

-- 8b. Politique RLS pour permettre la suppression de PDF (anonymes - développement)
-- ⚠️ À supprimer en production si vous n'avez pas besoin de suppressions anonymes
CREATE POLICY "Allow anonymous users to delete product documents"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'product-documents');

-- 9. Politique RLS pour permettre la mise à jour (remplacement) de fichiers (authentifiés)
CREATE POLICY "Allow authenticated users to update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated users to update product documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-documents');

-- 9b. Politique RLS pour permettre la mise à jour (remplacement) de fichiers (anonymes - développement)
-- ⚠️ À supprimer en production si vous n'avez pas besoin de mises à jour anonymes
CREATE POLICY "Allow anonymous users to update product images"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'product-images');

CREATE POLICY "Allow anonymous users to update product documents"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'product-documents');

