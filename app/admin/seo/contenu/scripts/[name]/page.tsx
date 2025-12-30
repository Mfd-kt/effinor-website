"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { getSeoScript, createSeoScript, updateSeoScript, deleteSeoScript } from "@/lib/services/seo-scripts";
import { SeoScript } from "@/lib/types/seo";
import { ArrowLeft, Save, Trash2, Code, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SeoScriptEditPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const name = params.name as string;
  const isNew = name === "new";

  const [script, setScript] = useState<SeoScript | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    label: "",
    description: "",
    scriptCode: "",
    scriptPosition: "head" as "head" | "body",
    active: false,
    priority: 0,
  });

  useEffect(() => {
    async function loadScript() {
      try {
        setLoading(true);
        if (isNew) {
          setFormData({
            name: "",
            label: "",
            description: "",
            scriptCode: "",
            scriptPosition: "head",
            active: false,
            priority: 0,
          });
          setLoading(false);
          return;
        }

        const scriptData = await getSeoScript(name);
        if (scriptData) {
          setScript(scriptData);
          setFormData({
            name: scriptData.name,
            label: scriptData.label,
            description: scriptData.description || "",
            scriptCode: scriptData.scriptCode,
            scriptPosition: scriptData.scriptPosition,
            active: scriptData.active,
            priority: scriptData.priority,
          });
        } else {
          addToast({
            title: "Erreur",
            description: "Script introuvable",
            variant: "destructive",
          });
          router.push("/admin/seo/contenu/scripts");
        }
      } catch (error) {
        console.error("Error loading script:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger le script",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadScript();
  }, [name, isNew, router, addToast]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validation
      if (!formData.name.trim()) {
        addToast({
          title: "Erreur",
          description: "Le nom du script est requis",
          variant: "destructive",
        });
        return;
      }

      if (!formData.label.trim()) {
        addToast({
          title: "Erreur",
          description: "Le libellé est requis",
          variant: "destructive",
        });
        return;
      }

      // Générer le nom à partir du label si non fourni
      const scriptName = formData.name.trim() || formData.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      if (isNew) {
        const newScript = await createSeoScript({
          name: scriptName,
          label: formData.label.trim(),
          description: formData.description.trim() || undefined,
          scriptCode: formData.scriptCode,
          scriptPosition: formData.scriptPosition,
          active: formData.active,
          priority: formData.priority,
        });
        setScript(newScript);
        addToast({
          title: "Succès",
          description: "Script créé avec succès",
        });
        router.push(`/admin/seo/contenu/scripts/${newScript.name}`);
      } else {
        const updatedScript = await updateSeoScript(name, {
          label: formData.label.trim(),
          description: formData.description.trim() || undefined,
          scriptCode: formData.scriptCode,
          scriptPosition: formData.scriptPosition,
          active: formData.active,
          priority: formData.priority,
        });
        setScript(updatedScript);
        addToast({
          title: "Succès",
          description: "Script mis à jour avec succès",
        });
      }
    } catch (error: any) {
      console.error("Error saving script:", error);
      addToast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le script",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!script) return;

    try {
      setDeleting(true);
      await deleteSeoScript(script.name);
      addToast({
        title: "Succès",
        description: "Script supprimé avec succès",
      });
      router.push("/admin/seo/contenu/scripts");
    } catch (error) {
      console.error("Error deleting script:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer le script",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Nouveau script" : script?.label || "Script"}
        description={isNew ? "Créez un nouveau script de tracking ou publicité" : "Modifiez le script de tracking"}
        actions={
          <Button
            variant="outline"
            onClick={() => router.push("/admin/seo/contenu/scripts")}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du script</CardTitle>
              <CardDescription>
                Configurez les informations de base du script
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Nom (slug) {isNew ? "" : "(non modifiable)"}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  disabled={!isNew}
                  placeholder="meta-ads"
                  className="h-11"
                />
                <p className="text-xs text-[#4B5563]">
                  Identifiant unique du script (généré automatiquement depuis le libellé si vide)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label" className="text-sm font-semibold">
                  Libellé <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Meta Ads"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[80px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:border-[#10B981] resize-y"
                  placeholder="Description du script..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scriptPosition" className="text-sm font-semibold">
                    Position
                  </Label>
                  <Select
                    id="scriptPosition"
                    value={formData.scriptPosition}
                    onChange={(e) => setFormData({ ...formData, scriptPosition: e.target.value as "head" | "body" })}
                    className="h-11"
                  >
                    <option value="head">Head</option>
                    <option value="body">Body</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-semibold">
                    Priorité
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="h-11"
                  />
                  <p className="text-xs text-[#4B5563]">
                    Plus petit = exécuté en premier
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
                />
                <Label htmlFor="active" className="text-sm font-semibold cursor-pointer">
                  Script actif
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code JavaScript</CardTitle>
              <CardDescription>
                Entrez le code JavaScript du script
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scriptCode" className="text-sm font-semibold">
                  Code du script
                </Label>
                <textarea
                  id="scriptCode"
                  value={formData.scriptCode}
                  onChange={(e) => setFormData({ ...formData, scriptCode: e.target.value })}
                  className="w-full min-h-[400px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:border-[#10B981] resize-y font-mono"
                  placeholder="<!-- Meta Pixel Code -->&#10;&lt;script&gt;&#10;  !function(f,b,e,v,n,t,s)&#10;  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?&#10;  n.callMethod.apply(n,arguments):n.queue.push(arguments)};&#10;  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';&#10;  n.queue=[];t=b.createElement(e);t.async=!0;&#10;  t.src=v;s=b.getElementsByTagName(e)[0];&#10;  s.parentNode.insertBefore(t,s)}(window, document,'script',&#10;  'https://connect.facebook.net/en_US/fbevents.js');&#10;  fbq('init', 'VOTRE_PIXEL_ID');&#10;  fbq('track', 'PageView');&#10;&lt;/script&gt;&#10;&lt;noscript&gt;&lt;img height=&quot;1&quot; width=&quot;1&quot; style=&quot;display:none&quot;&#10;  src=&quot;https://www.facebook.com/tr?id=VOTRE_PIXEL_ID&amp;ev=PageView&amp;noscript=1&quot;&#10;/&gt;&lt;/noscript&gt;&#10;&lt;!-- End Meta Pixel Code --&gt;"
                />
                <p className="text-xs text-[#4B5563]">
                  Collez le code JavaScript complet du script. Il sera injecté dans le {formData.scriptPosition} de la page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec infos et actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isNew && script && (
                <>
                  <div>
                    <Label className="text-xs text-[#4B5563]">Créé le</Label>
                    <p className="text-sm text-[#111827] mt-1">
                      {new Date(script.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-[#4B5563]">Modifié le</Label>
                    <p className="text-sm text-[#111827] mt-1">
                      {new Date(script.updatedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Enregistrement..." : isNew ? "Créer" : "Enregistrer"}
              </Button>
              {!isNew && script && (
                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le script</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le script "{script?.label}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
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



