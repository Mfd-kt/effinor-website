"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Download, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

interface LeadPhotoUploaderProps {
  leadId: string;
  photoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
  label: string;
  photoType: "exterior" | "cadastral";
}

const BUCKET_NAME = "lead-photos";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function LeadPhotoUploader({
  leadId,
  photoUrl,
  onPhotoChange,
  label,
  photoType,
}: LeadPhotoUploaderProps) {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du type
    if (!ALLOWED_TYPES.includes(file.type)) {
      addToast({
        title: "Erreur",
        description: "Format de fichier non supporté. Utilisez JPG, PNG ou WebP.",
        variant: "destructive",
      });
      return;
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      addToast({
        title: "Erreur",
        description: "Le fichier est trop volumineux. Taille maximale : 10MB.",
        variant: "destructive",
      });
      return;
    }

    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true);

      // Générer un nom de fichier unique
      const fileExt = file.name.split(".").pop();
      const fileName = `${leadId}/${photoType}-${Date.now()}.${fileExt}`;

      // Supprimer l'ancienne photo si elle existe
      if (photoUrl) {
        await deletePhotoFromStorage(photoUrl);
      }

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        onPhotoChange(urlData.publicUrl);
        addToast({
          title: "Succès",
          description: "Photo uploadée avec succès",
        });
      }
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      addToast({
        title: "Erreur",
        description: error.message || "Impossible d'uploader la photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const deletePhotoFromStorage = async (url: string) => {
    try {
      // Extraire le nom du fichier depuis l'URL
      const urlParts = url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const fullPath = `${leadId}/${fileName}`;

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fullPath]);

      if (error) {
        console.error("Error deleting photo:", error);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleDelete = async () => {
    if (!photoUrl) return;

    try {
      setDeleting(true);
      await deletePhotoFromStorage(photoUrl);
      onPhotoChange(null);
      addToast({
        title: "Succès",
        description: "Photo supprimée",
      });
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer la photo",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handlePasteUrl = () => {
    const url = prompt("Collez l'URL de l'image :");
    if (url && url.trim()) {
      onPhotoChange(url.trim());
      addToast({
        title: "Succès",
        description: "URL de l'image ajoutée",
      });
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-effinor-gray-dark">
        {label}
      </Label>
      
      {photoUrl ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative group">
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 bg-effinor-gray-light">
                <Image
                  src={photoUrl}
                  alt={label}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Upload..." : "Remplacer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-effinor-gray-light">
                <ImageIcon className="h-8 w-8 text-effinor-gray-text" />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-effinor-gray-text">
                  Aucune photo uploadée
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Upload..." : "Joindre un fichier"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePasteUrl}
                  >
                    Coller une URL
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

