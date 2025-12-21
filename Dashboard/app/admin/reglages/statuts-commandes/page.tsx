"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCommandeStatuses } from "@/lib/services/commandes";
import { OrderStatus } from "@/lib/types/order";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { StatBadge } from "@/components/admin/StatBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns: Column<OrderStatus>[] = [
  {
    header: "Label",
    accessor: "label",
    sortable: true,
  },
  {
    header: "Couleur",
    accessor: (row) => <StatBadge label={row.label} color={row.color} />,
  },
  {
    header: "Ordre",
    accessor: "order",
    sortable: true,
  },
  {
    header: "Actif",
    accessor: (row) => (
      <StatBadge
        label={row.active ? "Oui" : "Non"}
        variant={row.active ? "default" : "secondary"}
      />
    ),
  },
];

export default function StatutsCommandesPage() {
  const { addToast } = useToast();
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const statusesData = await getCommandeStatuses();
        setStatuses(statusesData);
      } catch (error) {
        console.error('Error loading data:', error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les statuts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

  const handleSave = () => {
    addToast({
      title: "Statut enregistré",
      description: "Le statut a été enregistré avec succès.",
    });
    setDialogOpen(false);
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
        title="Statuts Commandes"
        description="Gérez les statuts des commandes"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau statut
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau statut</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Label</Label>
                  <Input placeholder="Nouveau statut" />
                </div>
                <div>
                  <Label>Couleur</Label>
                  <Input type="color" defaultValue="#3b82f6" />
                </div>
                <div>
                  <Label>Ordre</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" defaultChecked />
                  <Label htmlFor="active">Actif</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>Enregistrer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable data={statuses} columns={columns} />
    </div>
  );
}

