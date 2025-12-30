"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Users, Power } from "lucide-react";
import { getVisiteurs, getVisiteurSession } from "@/lib/services/visiteurs";
import { Visitor } from "@/lib/types/visitor";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { StatBadge } from "@/components/admin/StatBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";

export default function VisiteursPage() {
  const { addToast } = useToast();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveMode, setLiveMode] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    loadVisitors();
  }, []);

  useEffect(() => {
    if (selectedVisitor) {
      loadSession(selectedVisitor.sessionId);
    }
  }, [selectedVisitor]);

  async function loadVisitors() {
    try {
      setLoading(true);
      const visitorsData = await getVisiteurs();
      setVisitors(visitorsData);
    } catch (error) {
      console.error('Error loading data:', error);
      addToast({
        title: "Erreur",
        description: "Impossible de charger les visiteurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadSession(sessionId: string) {
    try {
      const sessionData = await getVisiteurSession(sessionId);
      setSession(sessionData);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }

  const handleRefresh = () => {
    loadVisitors();
    addToast({
      title: "Données rafraîchies",
      description: "Les données des visiteurs ont été mises à jour.",
    });
  };

  const activeVisitors = visitors.filter((v) => v.status === "active");

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visiteurs"
        description="Suivi des visiteurs en temps réel"
        actions={
          <>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={liveMode}
                  onChange={(e) => setLiveMode(e.target.checked)}
                />
                <span className="text-sm">Live</span>
              </label>
            </div>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Rafraîchir
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Visiteurs en ligne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeVisitors.length}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Visiteurs actifs actuellement
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visitors.map((visitor) => (
          <Card
            key={visitor.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedVisitor(visitor)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{visitor.ip}</CardTitle>
                <StatBadge
                  label={visitor.status === "active" ? "Actif" : "Parti"}
                  variant={visitor.status === "active" ? "default" : "secondary"}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Page:</span>{" "}
                {visitor.currentPage}
              </div>
              <div>
                <span className="text-muted-foreground">Source:</span>{" "}
                {visitor.source}
              </div>
              <div>
                <span className="text-muted-foreground">Navigateur:</span>{" "}
                {visitor.browser}
              </div>
              <div>
                <span className="text-muted-foreground">Device:</span>{" "}
                {visitor.device}
              </div>
              <div>
                <span className="text-muted-foreground">Dernière vue:</span>{" "}
                {format(visitor.lastSeen, "HH:mm:ss")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedVisitor && (
        <Sheet open={!!selectedVisitor} onOpenChange={() => setSelectedVisitor(null)}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Détails de la session</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold mb-2">Informations générales</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">IP:</span>{" "}
                    {selectedVisitor.ip}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Statut:</span>{" "}
                    <StatBadge
                      label={
                        selectedVisitor.status === "active" ? "Actif" : "Parti"
                      }
                      variant={
                        selectedVisitor.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    />
                  </div>
                  <div>
                    <span className="text-muted-foreground">Device:</span>{" "}
                    {selectedVisitor.device}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Navigateur:</span>{" "}
                    {selectedVisitor.browser}
                  </div>
                  {selectedVisitor.country && (
                    <div>
                      <span className="text-muted-foreground">Localisation:</span>{" "}
                      {selectedVisitor.city}, {selectedVisitor.country}
                    </div>
                  )}
                </div>
              </div>

              {session && session.pages && session.pages.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Parcours</h3>
                    <div className="space-y-2">
                      {session.pages.map((page: any, index: number) => (
                        <div
                          key={index}
                          className="p-2 border rounded text-sm"
                        >
                          <div className="font-medium">{page.title}</div>
                          <div className="text-muted-foreground">
                            {page.path}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(page.viewedAt, "HH:mm:ss")}
                            {page.duration && ` - ${page.duration}s`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Source & UTM</h3>
                    <div className="space-y-2 text-sm">
                      {session.referrer && (
                        <div>
                          <span className="text-muted-foreground">Referrer:</span>{" "}
                          {session.referrer}
                        </div>
                      )}
                      {session.utmSource && (
                        <div>
                          <span className="text-muted-foreground">UTM Source:</span>{" "}
                          {session.utmSource}
                        </div>
                      )}
                      {session.utmMedium && (
                        <div>
                          <span className="text-muted-foreground">UTM Medium:</span>{" "}
                          {session.utmMedium}
                        </div>
                      )}
                      {session.utmCampaign && (
                        <div>
                          <span className="text-muted-foreground">UTM Campaign:</span>{" "}
                          {session.utmCampaign}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

