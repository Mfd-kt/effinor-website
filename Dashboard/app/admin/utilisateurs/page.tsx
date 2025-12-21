"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getUtilisateurs } from "@/lib/services/utilisateurs";
import { User } from "@/lib/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { StatBadge } from "@/components/admin/StatBadge";
import { format } from "date-fns";
import Link from "next/link";

const columns: Column<User>[] = [
  {
    header: "Nom",
    accessor: "fullName",
    sortable: true,
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Rôle",
    accessor: (row) => (
      <StatBadge
        label={row.role.replace("_", " ").toUpperCase()}
        variant={row.role === "super_admin" ? "default" : "secondary"}
      />
    ),
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
  {
    header: "Dernière connexion",
    accessor: (row) =>
      row.lastLogin ? format(row.lastLogin, "dd MMM yyyy") : "Jamais",
    sortable: true,
  },
];

export default function UtilisateursPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const usersData = await getUtilisateurs();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading data:', error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

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
        title="Utilisateurs"
        description="Gérez les utilisateurs du système"
        actions={
          <Button asChild>
            <Link href="/admin/utilisateurs/inviter">
              <Plus className="h-4 w-4 mr-2" />
              Inviter un utilisateur
            </Link>
          </Button>
        }
      />

      <DataTable data={users} columns={columns} />
    </div>
  );
}

