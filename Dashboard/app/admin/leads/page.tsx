"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { KpiCards } from "@/components/admin/KpiCards";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getLeads, getLeadStatuses } from "@/lib/services/leads";
import { Lead, LeadStatus } from "@/lib/types/lead";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { StatBadge } from "@/components/admin/StatBadge";
import { TrendingUp, Users, Target, Euro, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

const columns: Column<Lead>[] = [
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
        return "bg-effinor-emerald";
      };
      
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="flex-1 relative h-2 w-16 overflow-hidden rounded-full bg-effinor-gray-medium">
            <div
              className={cn("h-full transition-all", getScoreColor(score))}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className={cn(
            "text-sm font-semibold",
            score < 50 ? "text-red-600" : score < 75 ? "text-orange-600" : "text-effinor-emerald"
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
];

export default function LeadsPage() {
  const { addToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

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

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.statusId === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    const matchesPriority =
      priorityFilter === "all" || lead.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesSource && matchesPriority;
  });

  const sources = Array.from(new Set(leads.map((l) => l.source)));
  const kpis = calculateKPIs(leads);
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

      <FiltersBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={
          <>
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

      <DataTable data={filteredLeads} columns={columns} />
    </div>
  );
}

