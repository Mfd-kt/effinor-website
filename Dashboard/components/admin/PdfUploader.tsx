"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Upload, X, FileText, Loader2, Download } from "lucide-react";
import {
  uploadPdfToStorage,
  deletePdfFromStorage,
} from "@/lib/services/products";

interface PdfUploaderProps {
  productId: string;
  pdfUrl?: string;
  onPdfChange: (url: string | null) => void;
}

export function PdfUploader({
  productId,
  pdfUrl,
  onPdfChange,
}: PdfUploaderProps) {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const validatePdf = (file: File): string | null => {
    // Check file type
    if (file.type !== "application/pdf") {
      return "Le fichier doit être un PDF";
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "Le PDF ne doit pas dépasser 10MB";
    }

    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validatePdf(file);
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

      // Delete old PDF if exists
      if (pdfUrl) {
        try {
          await deletePdfFromStorage(pdfUrl);
        } catch (error) {
          console.warn("Error deleting old PDF:", error);
          // Continue anyway
        }
      }

      // Upload to storage
      const newPdfUrl = await uploadPdfToStorage(productId, file);

      // Update local state
      onPdfChange(newPdfUrl);

      addToast({
        title: "Succès",
        description: "Le PDF a été uploadé avec succès",
      });
    } catch (error) {
      console.error("Error uploading PDF:", error);
      addToast({
        title: "Erreur",
        description: "Impossible d'uploader le PDF",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleDelete = async () => {
    if (!pdfUrl) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce PDF ?")) {
      return;
    }

    try {
      setDeleting(true);

      // Delete from storage
      await deletePdfFromStorage(pdfUrl);

      // Update local state
      onPdfChange(null);

      addToast({
        title: "Succès",
        description: "Le PDF a été supprimé avec succès",
      });
    } catch (error) {
      console.error("Error deleting PDF:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer le PDF",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Fiche technique / Plaquette</label>
        {!pdfUrl && (
          <div className="relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              id="pdf-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              asChild
            >
              <label
                htmlFor="pdf-upload"
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
                    Ajouter un PDF
                  </>
                )}
              </label>
            </Button>
          </div>
        )}
      </div>

      {pdfUrl ? (
        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium">PDF disponible</p>
              <p className="text-xs text-gray-500">
                Fiche technique ou plaquette
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </a>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Supprimer
                </>
              )}
            </Button>
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="pdf-replace"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                asChild
              >
                <label
                  htmlFor="pdf-replace"
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Remplacer
                    </>
                  )}
                </label>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 mb-2">
            Aucun PDF. Cliquez sur "Ajouter un PDF" pour uploader une fiche
            technique ou une plaquette.
          </p>
          <p className="text-xs text-gray-400">
            Format accepté : PDF (max 10MB)
          </p>
        </div>
      )}
    </div>
  );
}

