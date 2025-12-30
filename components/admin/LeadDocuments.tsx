"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Trash2, Eye, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

interface LeadDocumentsProps {
  leadId: string;
}

export function LeadDocuments({ leadId }: LeadDocumentsProps) {
  const { addToast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [leadId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      // Pour l'instant, on simule - à implémenter avec une table lead_documents
      // const { data, error } = await supabase
      //   .from('lead_documents')
      //   .select('*')
      //   .eq('lead_id', leadId)
      //   .order('created_at', { ascending: false });
      
      setDocuments([]);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // Upload vers Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${leadId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lead-documents')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('lead-documents')
        .getPublicUrl(fileName);

      // Créer l'entrée dans la base (à implémenter avec une table lead_documents)
      const newDoc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        uploadedAt: new Date(),
        url: publicUrl,
      };

      setDocuments([newDoc, ...documents]);
      addToast({
        title: "Succès",
        description: "Document uploadé avec succès",
        variant: "success",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      addToast({
        title: "Erreur",
        description: "Impossible d'uploader le document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, docUrl: string) => {
    try {
      // Supprimer de Supabase Storage
      const fileName = docUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('lead-documents')
          .remove([`${leadId}/${fileName}`]);
      }

      setDocuments(documents.filter(d => d.id !== docId));
      addToast({
        title: "Succès",
        description: "Document supprimé",
        variant: "success",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" asChild disabled={uploading}>
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? 'Upload en cours...' : 'Ajouter un document'}
              </span>
            </Button>
          </label>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {format(doc.uploadedAt, 'dd MMM yyyy à HH:mm', { locale: fr })} • {formatFileSize(doc.size)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open(doc.url, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = doc.url;
                    link.download = doc.name;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
                      handleDelete(doc.id, doc.url);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
          
          {documents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucun document associé</p>
              <p className="text-sm mt-1">Ajoutez des documents pour mieux suivre ce lead</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



