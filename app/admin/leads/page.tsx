"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { KpiCards } from "@/components/admin/KpiCards";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getLeads, getLeadStatuses, getLead, mergeLeads } from "@/lib/services/leads";
import { Lead, LeadStatus } from "@/lib/types/lead";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { StatBadge } from "@/components/admin/StatBadge";
import { TrendingUp, Users, Target, Euro, Eye, AlertTriangle, Search, FileDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MergeLeadsDialog } from "@/components/admin/MergeLeadsDialog";
import { BulkActionsBar } from "@/components/admin/BulkActionsBar";
import { AdvancedSearch, AdvancedSearchFilters } from "@/components/admin/AdvancedSearch";
import { exportLeadsToCSV, downloadCSV, bulkUpdateLeads, bulkDeleteLeads } from "@/lib/services/leads";

// Fonction pour détecter les doublons par email
function detectDuplicates(leads: Lead[]): Map<string, Lead[]> {
  const emailMap = new Map<string, Lead[]>();
  
  leads.forEach((lead) => {
    const normalizedEmail = lead.email.toLowerCase().trim();
    if (!emailMap.has(normalizedEmail)) {
      emailMap.set(normalizedEmail, []);
    }
    emailMap.get(normalizedEmail)!.push(lead);
  });
  
  // Ne garder que les emails avec plusieurs leads
  const duplicates = new Map<string, Lead[]>();
  emailMap.forEach((leadList, email) => {
    if (leadList.length > 1) {
      duplicates.set(email, leadList);
    }
  });
  
  return duplicates;
}

// Fonction pour obtenir le nombre de doublons d'un lead
function getDuplicateCount(lead: Lead, duplicates: Map<string, Lead[]>): number {
  const normalizedEmail = lead.email.toLowerCase().trim();
  const duplicateList = duplicates.get(normalizedEmail);
  return duplicateList ? duplicateList.length - 1 : 0; // -1 car on ne compte pas le lead lui-même
}

// Fonction pour calculer les KPIs
function calculateKPIs(leads: Lead[]) {
  const totalLeads = leads.length;
  const newLeadsThisMonth = leads.filter(
    (l) => l.createdAt.getMonth() === new Date().getMonth()
  ).length;
  const wonLeads = leads.filter((l) => l.status?.label?.toLowerCase().includes('gagné') || l.status?.label?.toLowerCase().includes('won')).length;
  const conversionRate = totalLeads > 0 ? wonLeads / totalLeads : 0;
  const potentialRevenue = leads.reduce(
    (sum, l) => sum + l.potentialRevenue,
    0
  );

  return {
    totalLeads,
    newLeadsThisMonth,
    conversionRate,
    potentialRevenue,
  };
}


export default function LeadsPage() {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [leadsToMerge, setLeadsToMerge] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedSearchFilters>({});

  // Lire le paramètre d'URL pour filtrer par email spécifique
  const duplicateEmail = searchParams.get('duplicateEmail');

  // Calculer les doublons une seule fois avec useMemo
  const duplicates = useMemo(() => detectDuplicates(leads), [leads]);

  // Fonction pour ouvrir le dialogue de fusion
  const handleOpenMergeDialog = (email: string) => {
    const duplicateLeads = leads.filter(
      l => l.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    setLeadsToMerge(duplicateLeads);
    setMergeDialogOpen(true);
  };

  // Fonction pour exécuter la fusion
  const handleMerge = async (mainLeadId: string, duplicateLeadIds: string[]) => {
    try {
      await mergeLeads(mainLeadId, duplicateLeadIds);
      addToast({
        title: "Succès",
        description: "Les leads ont été fusionnés avec succès",
        variant: "success",
      });
      
      // Recharger les leads
      const [leadsData] = await Promise.all([getLeads()]);
      setLeads(leadsData);
      
      // Rediriger vers le lead fusionné
      router.push(`/admin/leads/${mainLeadId}`);
    } catch (error) {
      addToast({
        title: "Erreur",
        description: `Erreur lors de la fusion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Fonction pour les actions en masse
  const handleBulkUpdate = async (leadIds: string[], action: string, value?: string) => {
    try {
      if (action === "update_status" && value) {
        const { success, errors } = await bulkUpdateLeads(leadIds, { statusId: value });
        if (success > 0) {
          addToast({
            title: "Succès",
            description: `${success} lead${success > 1 ? 's' : ''} mis à jour`,
            variant: "success",
          });
          const [leadsData] = await Promise.all([getLeads()]);
          setLeads(leadsData);
          setSelectedLeads([]);
        }
        if (errors.length > 0) {
          addToast({
            title: "Erreurs",
            description: `${errors.length} erreur${errors.length > 1 ? 's' : ''} lors de la mise à jour`,
            variant: "destructive",
          });
        }
      } else if (action === "delete") {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${leadIds.length} lead${leadIds.length > 1 ? 's' : ''} ?`)) {
          const { success, errors } = await bulkDeleteLeads(leadIds);
          if (success > 0) {
            addToast({
              title: "Succès",
              description: `${success} lead${success > 1 ? 's' : ''} supprimé${success > 1 ? 's' : ''}`,
              variant: "success",
            });
            const [leadsData] = await Promise.all([getLeads()]);
            setLeads(leadsData);
            setSelectedLeads([]);
          }
          if (errors.length > 0) {
            addToast({
              title: "Erreurs",
              description: `${errors.length} erreur${errors.length > 1 ? 's' : ''} lors de la suppression`,
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      addToast({
        title: "Erreur",
        description: `Erreur lors de l'action en masse: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    }
  };

  // Fonction pour exporter les leads sélectionnés
  const handleExport = async (leadIds: string[]) => {
    try {
      const leadsToExport = leads.filter(l => leadIds.includes(l.id));
      const csvContent = await exportLeadsToCSV(leadsToExport);
      const filename = `leads-export-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
      downloadCSV(csvContent, filename);
      addToast({
        title: "Succès",
        description: `${leadsToExport.length} lead${leadsToExport.length > 1 ? 's' : ''} exporté${leadsToExport.length > 1 ? 's' : ''}`,
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Erreur",
        description: `Erreur lors de l'export: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    }
  };

  // Colonnes du tableau (définies dans le composant pour accéder à leads et duplicates)
  const columns: Column<Lead>[] = useMemo(() => [
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
      header: "Doublons",
      accessor: (row) => {
        const count = getDuplicateCount(row, duplicates);
        if (count > 0) {
          return (
            <div className="flex items-center gap-2">
              <StatBadge
                label={`${count} doublon${count > 1 ? 's' : ''}`}
                variant="destructive"
              />
              <Link href={`/admin/leads?duplicateEmail=${encodeURIComponent(row.email)}`}>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  Voir
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMergeDialog(row.email);
                }}
              >
                Fusionner
              </Button>
            </div>
          );
        }
        return <span className="text-gray-400 text-sm">-</span>;
      },
    },
    {
      header: "Téléphone",
      accessor: (row) => row.phone || "N/A",
    },
    {
      header: "Source",
      accessor: (row) => row.source.charAt(0).toUpperCase() + row.source.slice(1),
    },
    {
      header: "Statut",
      accessor: (row) => {
        return row.status ? (
          <StatBadge label={row.status.label} color={row.status.color} />
        ) : (
          "N/A"
        );
      },
    },
    {
      header: "Priorité",
      accessor: (row) => (
        <StatBadge
          label={row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
          variant={
            row.priority === "urgent"
              ? "destructive"
              : row.priority === "high"
              ? "default"
              : "secondary"
          }
        />
      ),
    },
    {
      header: "Score",
      accessor: (row) => {
        const score = row.completionScore || 0;
        const getScoreColor = (score: number) => {
          if (score < 50) return "bg-red-600";
          if (score < 75) return "bg-orange-600";
          return "bg-[#10B981]";
        };
        
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 relative h-2 w-16 overflow-hidden rounded-full bg-[#F3F4F6]">
              <div
                className={cn("h-full transition-all", getScoreColor(score))}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={cn(
              "text-sm font-semibold",
              score < 50 ? "text-red-600" : score < 75 ? "text-orange-600" : "text-[#10B981]"
            )}>
              {score}
            </span>
          </div>
        );
      },
      sortable: true,
      sortKey: "completionScore",
    },
    {
      header: "CA Potentiel",
      accessor: (row) => `${row.potentialRevenue.toLocaleString()} €`,
      sortable: true,
    },
    {
      header: "Actions",
      accessor: (row) => (
        <Link href={`/admin/leads/${row.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ], [duplicates]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        console.log('🔄 Début du chargement des leads...');
        
        const [leadsData, statusesData] = await Promise.all([
          getLeads(),
          getLeadStatuses(),
        ]);
        
        console.log('✅ Leads chargés:', leadsData.length, 'leads');
        console.log('📊 Données des leads:', leadsData);
        console.log('📊 Statuts chargés:', statusesData.length, 'statuts');
        
        setLeads(leadsData);
        setLeadStatuses(statusesData);
        
        if (leadsData.length === 0) {
          console.warn('⚠️ Aucun lead trouvé dans la base de données');
          addToast({
            title: "Information",
            description: "Aucun lead trouvé dans la base de données",
          });
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
        addToast({
          title: "Erreur",
          description: `Impossible de charger les leads: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

  // Abonnement Realtime pour mettre à jour automatiquement la liste des leads
  useEffect(() => {
    // Vérifier que Supabase est configuré et supporte Realtime
    if (!isSupabaseConfigured() || !supabase || typeof supabase.channel !== 'function') {
      console.warn('⚠️ Supabase Realtime non disponible pour la mise à jour de la liste');
      return;
    }

    console.log('🔔 Configuration de l\'abonnement Realtime pour mettre à jour la liste des leads...');

    // Créer un channel pour écouter les inserts sur la table leads
    const channel = supabase
      .channel('leads-list-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        async (payload: any) => {
          console.log('🆕 Nouveau lead détecté pour mise à jour de la liste:', payload.new.id);
          
          try {
            // Récupérer le lead complet avec toutes ses relations
            const newLead = await getLead(payload.new.id);
            
            if (newLead) {
              // Ajouter le nouveau lead en haut de la liste
              setLeads((prevLeads) => {
                // Vérifier si le lead n'existe pas déjà (éviter les doublons)
                if (prevLeads.find((l) => l.id === newLead.id)) {
                  console.log('⚠️ Lead déjà présent dans la liste, ignoré');
                  return prevLeads;
                }
                console.log('✅ Nouveau lead ajouté à la liste:', newLead.fullName);
                return [newLead, ...prevLeads];
              });
            }
          } catch (error) {
            console.error('❌ Erreur lors de la récupération du nouveau lead pour la liste:', error);
          }
        }
      )
      .subscribe((status: string) => {
        console.log('📡 Statut de l\'abonnement Realtime (liste):', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Abonnement à la mise à jour de la liste activé');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erreur d\'abonnement à la mise à jour de la liste');
        } else if (status === 'TIMED_OUT') {
          console.error('❌ Timeout lors de l\'abonnement - Vérifiez que Realtime est activé dans Supabase');
        }
      });

    // Nettoyer l'abonnement au démontage
    return () => {
      console.log('🔕 Déconnexion de l\'abonnement Realtime (liste)');
      if (channel && typeof supabase.removeChannel === 'function') {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Recherche basique
      const matchesSearch =
        lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(search.toLowerCase()) ||
        lead.company?.toLowerCase().includes(search.toLowerCase());
      
      // Filtres de base
      const matchesStatus = statusFilter === "all" || lead.statusId === statusFilter;
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
      const matchesPriority =
        priorityFilter === "all" || lead.priority === priorityFilter;
      
      // Filtre doublons
      const matchesDuplicates = !showDuplicatesOnly || getDuplicateCount(lead, duplicates) > 0;
      
      // Si on filtre par email spécifique (depuis le lien "Voir")
      if (duplicateEmail) {
        const matchesEmail = lead.email.toLowerCase().trim() === duplicateEmail.toLowerCase().trim();
        if (!matchesEmail) return false;
      }
      
      // Filtres avancés
      if (advancedFilters.name && !lead.fullName.toLowerCase().includes(advancedFilters.name.toLowerCase())) {
        return false;
      }
      if (advancedFilters.email && !lead.email.toLowerCase().includes(advancedFilters.email.toLowerCase())) {
        return false;
      }
      if (advancedFilters.phone && !lead.phone?.toLowerCase().includes(advancedFilters.phone.toLowerCase())) {
        return false;
      }
      if (advancedFilters.company && !lead.company?.toLowerCase().includes(advancedFilters.company.toLowerCase())) {
        return false;
      }
      if (advancedFilters.status && advancedFilters.status.length > 0 && !advancedFilters.status.includes(lead.statusId)) {
        return false;
      }
      if (advancedFilters.source && advancedFilters.source.length > 0 && !advancedFilters.source.includes(lead.source)) {
        return false;
      }
      if (advancedFilters.priority && advancedFilters.priority.length > 0 && !advancedFilters.priority.includes(lead.priority)) {
        return false;
      }
      if (advancedFilters.dateFrom) {
        const leadDate = new Date(lead.createdAt);
        const filterDate = new Date(advancedFilters.dateFrom);
        if (leadDate < filterDate) return false;
      }
      if (advancedFilters.dateTo) {
        const leadDate = new Date(lead.createdAt);
        const filterDate = new Date(advancedFilters.dateTo);
        filterDate.setHours(23, 59, 59, 999);
        if (leadDate > filterDate) return false;
      }
      if (advancedFilters.scoreMin !== undefined && (lead.completionScore || 0) < advancedFilters.scoreMin) {
        return false;
      }
      if (advancedFilters.scoreMax !== undefined && (lead.completionScore || 0) > advancedFilters.scoreMax) {
        return false;
      }
      if (advancedFilters.workPostcode && lead.workPostcode?.toLowerCase() !== advancedFilters.workPostcode.toLowerCase()) {
        return false;
      }
      if (advancedFilters.workRegion && !lead.workRegion?.toLowerCase().includes(advancedFilters.workRegion.toLowerCase())) {
        return false;
      }
      if (advancedFilters.buildingType && lead.buildingType?.toLowerCase() !== advancedFilters.buildingType.toLowerCase()) {
        return false;
      }
      if (advancedFilters.hasPhotos && !lead.exteriorPhotoUrl && !lead.cadastralPhotoUrl) {
        return false;
      }
      if (advancedFilters.hasDetailedForm) {
        // Vérifier si detailed_form_data existe et n'est pas vide
        // Cette vérification nécessiterait d'avoir accès à leadRaw, donc on skip pour l'instant
      }
      
      return matchesSearch && matchesStatus && matchesSource && matchesPriority && matchesDuplicates;
    });
  }, [leads, search, statusFilter, sourceFilter, priorityFilter, showDuplicatesOnly, duplicateEmail, duplicates, advancedFilters]);

  const sources = Array.from(new Set(leads.map((l) => l.source)));
  const kpis = calculateKPIs(leads);
  
  // Calculer les statistiques de doublons
  const duplicateCount = Array.from(duplicates.values()).reduce((sum, list) => sum + list.length, 0);
  const uniqueDuplicateEmails = duplicates.size;
  
  const kpiCards = [
    {
      title: "Total Leads",
      value: kpis.totalLeads,
      icon: Users,
    },
    {
      title: "Nouveaux ce mois",
      value: kpis.newLeadsThisMonth,
      icon: TrendingUp,
    },
    {
      title: "Doublons",
      value: uniqueDuplicateEmails > 0 ? `${uniqueDuplicateEmails} (${duplicateCount} leads)` : "0",
      icon: AlertTriangle,
      description: uniqueDuplicateEmails > 0 ? "Emails en double détectés" : "Aucun doublon",
    },
    {
      title: "Taux conversion",
      value: `${(kpis.conversionRate * 100).toFixed(1)}%`,
      icon: Target,
    },
    {
      title: "CA Potentiel",
      value: `${(kpis.potentialRevenue / 1000).toFixed(0)}k €`,
      icon: Euro,
    },
  ];

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
        title="Leads"
        description="Gérez vos leads et prospects"
      />

      <KpiCards cards={kpiCards} />

      {/* Message d'information si filtre par email spécifique */}
      {duplicateEmail && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Affichage des leads avec l'email : <strong>{duplicateEmail}</strong>
                {' '}({filteredLeads.length} lead{filteredLeads.length > 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleOpenMergeDialog(duplicateEmail)}
                className="bg-[#10B981] hover:bg-[#10B981]/90"
              >
                Fusionner tous
              </Button>
              <Link href="/admin/leads">
                <Button variant="outline" size="sm">
                  Réinitialiser
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <BulkActionsBar
        selectedLeads={selectedLeads}
        onBulkUpdate={handleBulkUpdate}
        onExport={handleExport}
        onClearSelection={() => setSelectedLeads([])}
        leadStatuses={leadStatuses}
      />

      <FiltersBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdvancedSearchOpen(true)}
              className="whitespace-nowrap"
            >
              <Search className="w-4 h-4 mr-2" />
              Recherche avancée
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const csvContent = await exportLeadsToCSV(filteredLeads);
                const filename = `leads-export-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
                downloadCSV(csvContent, filename);
              }}
              className="whitespace-nowrap"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Exporter tout
            </Button>
            <Button
              variant={showDuplicatesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDuplicatesOnly(!showDuplicatesOnly)}
              className="whitespace-nowrap"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {showDuplicatesOnly ? "Tous les leads" : "Doublons uniquement"}
            </Button>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              {leadStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </Select>
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="all">Toutes les sources</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </option>
              ))}
            </Select>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </Select>
          </>
        }
      />

      <DataTable 
        data={filteredLeads} 
        columns={columns}
        selectable={true}
        selectedRows={selectedLeads}
        onSelectionChange={setSelectedLeads}
      />

      <MergeLeadsDialog
        open={mergeDialogOpen}
        onOpenChange={setMergeDialogOpen}
        leads={leadsToMerge}
        onMerge={handleMerge}
      />

      <AdvancedSearch
        open={advancedSearchOpen}
        onOpenChange={setAdvancedSearchOpen}
        onApplyFilters={setAdvancedFilters}
        leadStatuses={leadStatuses}
        sources={sources}
      />
    </div>
  );
}