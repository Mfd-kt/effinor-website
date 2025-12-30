"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import {
  uploadBlogImageToStorage,
  deleteBlogImageFromStorage,
} from "@/lib/services/blog";
import Image from "next/image";

interface BlogImageUploaderProps {
  postId: string;
  coverImageUrl?: string;
  onCoverImageChange: (url: string | undefined) => void;
}

export function BlogImageUploader({
  postId,
  coverImageUrl,
  onCoverImageChange,
}: BlogImageUploaderProps) {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const validateImage = (file: File): string | null => {
    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return "Le fichier doit être une image (JPEG, PNG, WebP ou GIF)";
    }

    // Check file size (10MB max pour les images de blog)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "L'image ne doit pas dépasser 10MB";
    }

    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateImage(file);
    if (validationError) {
      addToast({
        title: "Erreur de validation",
        description: validationError,
        variant: "destructive",
      });
      e.target.value = ""; // Reset input
      return;
    }

    // Si l'article n'existe pas encore (postId = "new"), on ne peut pas uploader
    // L'utilisateur devra sauvegarder l'article d'abord
    if (postId === "new") {
      addToast({
        title: "Information",
        description: "Veuillez d'abord sauvegarder l'article avant d'uploader une image. Vous pourrez ensuite ajouter l'image.",
      });
      e.target.value = ""; // Reset input
      return;
    }

    try {
      setUploading(true);

      // Upload to storage
      const imageUrl = await uploadBlogImageToStorage(postId, file);

      // Update cover image
      onCoverImageChange(imageUrl);

      addToast({
        title: "Succès",
        description: "L'image de couverture a été ajoutée avec succès",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      addToast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleDeleteImage = async () => {
    if (!coverImageUrl) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image de couverture ?")) {
      return;
    }

    try {
      setDeleting(true);

      // Delete from storage
      await deleteBlogImageFromStorage(coverImageUrl);

      // Update local state
      onCoverImageChange(undefined);

      addToast({
        title: "Succès",
        description: "L'image de couverture a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Image de couverture</label>
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            disabled={uploading || deleting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="blog-image-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading || deleting || postId === "new"}
            asChild
          >
            <label
              htmlFor="blog-image-upload"
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Upload...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {coverImageUrl ? "Remplacer l'image" : "Ajouter une image"}
                </>
              )}
            </label>
          </Button>
        </div>
      </div>

      {coverImageUrl ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white">
          <div className="relative w-full h-64">
            <Image
              src={coverImageUrl}
              alt="Image de couverture"
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<div class="w-full h-full bg-[#F3F4F6] flex items-center justify-center text-[#4B5563]">Erreur de chargement</div>';
                }
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeleteImage}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 mb-2">
            Aucune image de couverture
          </p>
          <p className="text-xs text-gray-400">
            Cliquez sur "Ajouter une image" pour uploader une image de couverture
          </p>
        </div>
      )}

      {coverImageUrl && (
        <div className="space-y-2">
          <label className="text-sm font-medium">URL de l'image</label>
          <input
            type="text"
            value={coverImageUrl}
            onChange={(e) => onCoverImageChange(e.target.value || undefined)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#111827]"
            placeholder="URL de l'image de couverture"
          />
          <p className="text-xs text-[#4B5563]">
            Vous pouvez également coller une URL d'image externe directement
          </p>
        </div>
      )}
    </div>
  );
}

