"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth/mockAuth";
import { User } from "@/lib/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles?: User["role"][];
}

export function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((userData) => {
      setUser(userData);
      setLoading(false);
    }).catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Vous devez être connecté pour accéder à cette page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Vous n'avez pas les permissions nécessaires pour accéder à cette
              page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

