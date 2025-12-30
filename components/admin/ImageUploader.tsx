"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Upload, X, Loader2 } from "lucide-react";
import {
  uploadImageToStorage,
  addProductImage,
  removeProductImage,
  deleteImageFromStorage,
  getProductImageId,
} from "@/lib/services/products";

interface ImageUploaderProps {
  productId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUploader({
  productId,
  images,
  onImagesChange,
}: ImageUploaderProps) {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const validateImage = (file: File): string | null => {
    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "Le fichier doit être une image (JPEG, PNG ou WebP)";
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "L'image ne doit pas dépasser 5MB";
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

    try {
      setUploading(true);

      // Upload to storage
      const imageUrl = await uploadImageToStorage(productId, file);

      // Add to product_images table
      await addProductImage(productId, imageUrl, images.length);

      // Update local state
      onImagesChange([...images, imageUrl]);

      addToast({
        title: "Succès",
        description: "L'image a été ajoutée avec succès",
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

  const handleDeleteImage = async (index: number, imageUrl: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      return;
    }

    try {
      setDeletingIndex(index);

      // Get image ID from database
      const imageId = await getProductImageId(imageUrl, productId);

      // Delete from database
      if (imageId) {
        await removeProductImage(imageId);
      }

      // Delete from storage
      await deleteImageFromStorage(imageUrl);

      // Update local state
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);

      addToast({
        title: "Succès",
        description: "L'image a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      });
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Images du produit</label>
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            asChild
          >
            <label
              htmlFor="image-upload"
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
                  Ajouter une image
                </>
              )}
            </label>
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteImage(index, imageUrl)}
                  disabled={deletingIndex === index}
                >
                  {deletingIndex === index ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-[#10B981] text-white text-xs px-2 py-1 rounded">
                  Principale
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-500">
            Aucune image. Cliquez sur "Ajouter une image" pour commencer.
          </p>
        </div>
      )}
    </div>
  );
}

