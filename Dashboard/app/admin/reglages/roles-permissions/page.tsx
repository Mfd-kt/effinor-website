"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const roles = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Accès complet à toutes les fonctionnalités",
  },
  {
    id: "admin",
    name: "Admin",
    description: "Accès administratif complet",
  },
  {
    id: "editor",
    name: "Editor",
    description: "Peut créer et modifier du contenu",
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Accès en lecture seule",
  },
];

const permissionSections = [
  "Dashboard",
  "Leads",
  "Devis",
  "Commandes",
  "Blog",
  "Produits",
  "Utilisateurs",
  "Réglages",
  "Visiteurs",
];

export default function RolesPermissionsPage() {
  const { addToast } = useToast();
  const [selectedRole, setSelectedRole] = useState(roles[0].id);
  const [permissions, setPermissions] = useState<Record<string, boolean[]>>({
    super_admin: new Array(permissionSections.length).fill(true),
    admin: new Array(permissionSections.length).fill(true),
    editor: new Array(permissionSections.length).fill(false),
    viewer: new Array(permissionSections.length).fill(false),
  });

  const handlePermissionChange = (sectionIndex: number, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: prev[selectedRole].map((val, idx) =>
        idx === sectionIndex ? checked : val
      ),
    }));
  };

  const handleSave = () => {
    addToast({
      title: "Permissions enregistrées",
      description: "Les permissions ont été mises à jour avec succès.",
    });
  };

  const currentRole = roles.find((r) => r.id === selectedRole);
  const currentPermissions = permissions[selectedRole] || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rôles & Permissions"
        description="Gérez les rôles et permissions des utilisateurs"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rôles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedRole === role.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <div className="font-medium">{role.name}</div>
                <div className="text-xs opacity-80">{role.description}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Permissions - {currentRole?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {permissionSections.map((section, index) => (
              <div key={section} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{section}</div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentPermissions[index] || false}
                    onChange={(e) =>
                      handlePermissionChange(index, e.target.checked)
                    }
                  />
                  <span className="text-sm">Accès</span>
                </label>
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave}>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

