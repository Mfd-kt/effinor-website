"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { getSeoScripts, toggleSeoScript, deleteSeoScript } from "@/lib/services/seo-scripts";
import { SeoScript } from "@/lib/types/seo";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Plus, Trash2, Power, PowerOff, Code, Tag, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SeoScriptsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [scripts, setScripts] = useState<SeoScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<SeoScript | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadScripts() {
      try {
        setLoading(true);
        const scriptsData = await getSeoScripts();
        setScripts(scriptsData);
      } catch (error) {
        console.error("Error loading scripts:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les scripts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadScripts();
  }, [addToast]);

  const filteredScripts = scripts.filter((script) => {
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" && script.active) || (statusFilter === "inactive" && !script.active);
    const matchesPosition = positionFilter === "all" || script.scriptPosition === positionFilter;
    return matchesStatus && matchesPosition;
  });

  const activeScriptsCount = scripts.filter((s) => s.active).length;

  const handleToggle = async (script: SeoScript) => {
    try {
      const updatedScript = await toggleSeoScript(script.name, !script.active);
      setScripts((prev) => prev.map((s) => (s.id === updatedScript.id ? updatedScript : s)));
      addToast({
        title: "Succès",
        description: `Script ${updatedScript.active ? "activé" : "désactivé"} avec succès`,
      });
    } catch (error) {
      console.error("Error toggling script:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de modifier le statut du script",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (script: SeoScript) => {
    setScriptToDelete(script);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scriptToDelete) return;

    try {
      setDeleting(true);
      await deleteSeoScript(scriptToDelete.name);
      setScripts((prev) => prev.filter((s) => s.id !== scriptToDelete.id));
      addToast({
        title: "Succès",
        description: "Script supprimé avec succès",
      });
      setDeleteDialogOpen(false);
      setScriptToDelete(null);
    } catch (error) {
      console.error("Error deleting script:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer le script",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scripts de tracking et publicité"
        description={`Gérez les scripts de tracking et publicité (${activeScriptsCount} actif${activeScriptsCount > 1 ? 's' : ''})`}
        actions={
          <Button onClick={() => router.push("/admin/seo/contenu/scripts/new")} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un script
          </Button>
        }
      />

      {/* Filtres */}
      <div className="flex gap-4">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-[180px]"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </Select>
        <Select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="w-[180px]"
        >
          <option value="all">Toutes les positions</option>
          <option value="head">Head</option>
          <option value="body">Body</option>
        </Select>
      </div>

      {/* Liste des scripts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredScripts.map((script) => (
          <Card key={script.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {script.scriptPosition === 'head' ? (
                      <Tag className="h-4 w-4 text-effinor-gray-text" />
                    ) : (
                      <FileText className="h-4 w-4 text-effinor-gray-text" />
                    )}
                    {script.label}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {script.description || "Aucune description"}
                  </CardDescription>
                </div>
                <Badge
                  variant={script.active ? "default" : "secondary"}
                  className="text-xs"
                >
                  {script.active ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap text-xs text-effinor-gray-text">
                <span>/{script.name}</span>
                <span>•</span>
                <span className="capitalize">{script.scriptPosition}</span>
                <span>•</span>
                <span>Priorité: {script.priority}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggle(script)}
                  variant={script.active ? "outline" : "default"}
                  size="sm"
                  className="flex-1"
                >
                  {script.active ? (
                    <>
                      <PowerOff className="h-4 w-4 mr-2" />
                      Désactiver
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 mr-2" />
                      Activer
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => router.push(`/admin/seo/contenu/scripts/${script.name}`)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteClick(script)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScripts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Code className="h-12 w-12 text-effinor-gray-text mx-auto mb-4" />
            <p className="text-effinor-gray-text">
              {scripts.length === 0
                ? "Aucun script configuré. Ajoutez votre premier script de tracking."
                : "Aucun script ne correspond aux filtres sélectionnés."}
            </p>
            {scripts.length === 0 && (
              <Button
                onClick={() => router.push("/admin/seo/contenu/scripts/new")}
                className="mt-4"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un script
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le script</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le script "{scriptToDelete?.label}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setScriptToDelete(null);
              }}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

