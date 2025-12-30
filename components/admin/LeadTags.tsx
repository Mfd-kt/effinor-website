"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getLeadTags, addLeadTag, removeLeadTag, getAllTags, LeadTag } from "@/lib/services/leadTags";

interface LeadTagsProps {
  leadId: string;
  onTagsChange?: (tags: LeadTag[]) => void;
}

export function LeadTags({ leadId, onTagsChange }: LeadTagsProps) {
  const [tags, setTags] = useState<LeadTag[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTags();
    loadAvailableTags();
  }, [leadId]);

  const loadTags = async () => {
    try {
      const leadTags = await getLeadTags(leadId);
      setTags(leadTags);
      if (onTagsChange) {
        onTagsChange(leadTags);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadAvailableTags = async () => {
    try {
      const allTags = await getAllTags();
      setAvailableTags(allTags);
    } catch (error) {
      console.error('Error loading available tags:', error);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || tags.some(t => t.tag.toLowerCase() === newTag.trim().toLowerCase())) {
      return;
    }
    
    setLoading(true);
    try {
      const addedTag = await addLeadTag(leadId, newTag.trim());
      await loadTags();
      setNewTag("");
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    setLoading(true);
    try {
      await removeLeadTag(leadId, tagToRemove);
      await loadTags();
    } catch (error) {
      console.error('Error removing tag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseSuggestedTag = (tag: string) => {
    setNewTag(tag);
    handleAddTag();
  };

  const suggestedTags = availableTags.filter(
    t => !tags.some(lt => lt.tag.toLowerCase() === t.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge 
            key={tag.id} 
            variant="secondary" 
            className="flex items-center gap-1 px-2 py-1"
            style={{ backgroundColor: `${tag.color}20`, color: tag.color, borderColor: tag.color }}
          >
            {tag.tag}
            <button
              onClick={() => handleRemoveTag(tag.tag)}
              className="ml-1 hover:opacity-70"
              disabled={loading}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-gray-400">Aucun tag</span>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Ajouter un tag..."
          className="w-48"
          disabled={loading}
        />
        <Button 
          onClick={handleAddTag} 
          size="sm"
          disabled={loading || !newTag.trim()}
          className="bg-effinor-emerald hover:bg-effinor-emerald/90"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {suggestedTags.length > 0 && (
        <div className="text-xs text-gray-500">
          <span className="font-medium">Tags suggérés: </span>
          {suggestedTags.map((tag, index) => (
            <button
              key={tag}
              onClick={() => handleUseSuggestedTag(tag)}
              className="underline hover:text-effinor-emerald mr-1"
            >
              {tag}{index < suggestedTags.length - 1 ? ',' : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



