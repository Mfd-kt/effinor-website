"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase/client";

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface LeadNotesProps {
  leadId: string;
}

export function LeadNotes({ leadId }: LeadNotesProps) {
  const { addToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [leadId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      // Pour l'instant, on utilise internal_notes du lead
      // À améliorer avec une table lead_notes pour les notes collaboratives
      const { data: leadData } = await supabase
        .from('leads')
        .select('internal_notes')
        .eq('id', leadId)
        .single();

      if (leadData?.internal_notes) {
        // Si internal_notes est un JSON array, le parser
        try {
          const parsed = JSON.parse(leadData.internal_notes);
          if (Array.isArray(parsed)) {
            setNotes(parsed.map((n: any) => ({
              id: n.id || crypto.randomUUID(),
              content: n.content,
              author: n.author || 'Vous',
              createdAt: new Date(n.createdAt || Date.now()),
            })));
          }
        } catch {
          // Si ce n'est pas du JSON, créer une note unique
          setNotes([{
            id: crypto.randomUUID(),
            content: leadData.internal_notes,
            author: 'Vous',
            createdAt: new Date(),
          }]);
        }
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setSaving(true);
    try {
      const note: Note = {
        id: crypto.randomUUID(),
        content: newNote,
        author: "Vous", // À récupérer depuis le contexte auth
        createdAt: new Date(),
      };
      
      const updatedNotes = [note, ...notes];
      setNotes(updatedNotes);
      setNewNote("");

      // Sauvegarder dans internal_notes (à améliorer avec une table dédiée)
      const notesJson = JSON.stringify(updatedNotes.map(n => ({
        id: n.id,
        content: n.content,
        author: n.author,
        createdAt: n.createdAt.toISOString(),
      })));

      const { error } = await supabase
        .from('leads')
        .update({ internal_notes: notesJson })
        .eq('id', leadId);

      if (error) throw error;

      addToast({
        title: "Succès",
        description: "Note ajoutée",
        variant: "success",
      });
    } catch (error) {
      console.error('Error saving note:', error);
      addToast({
        title: "Erreur",
        description: "Impossible d'ajouter la note",
        variant: "destructive",
      });
      // Recharger les notes en cas d'erreur
      loadNotes();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Notes collaboratives
          </CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Notes collaboratives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ajouter une note..."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleAddNote();
              }
            }}
          />
          <Button
            onClick={handleAddNote}
            disabled={!newNote.trim() || saving}
            className="bg-effinor-emerald hover:bg-effinor-emerald/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Appuyez sur Cmd/Ctrl + Entrée pour envoyer rapidement
        </p>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{note.author}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(note.createdAt, 'dd MMM yyyy à HH:mm', { locale: fr })}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucune note pour le moment</p>
              <p className="text-sm mt-1">Ajoutez des notes pour suivre vos échanges</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



