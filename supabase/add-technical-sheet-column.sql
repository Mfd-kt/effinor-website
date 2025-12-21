-- Script SQL pour ajouter la colonne technical_sheet_url à la table products
-- À exécuter dans l'éditeur SQL de Supabase si vous souhaitez stocker les URLs des PDF

-- Ajouter la colonne technical_sheet_url (optionnelle)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS technical_sheet_url TEXT;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN products.technical_sheet_url IS 'URL du PDF de la fiche technique ou plaquette du produit';

