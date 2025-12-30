"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { Select } from "@/components/ui/select";
import { getCommandes, getCommandeStatuses } from "@/lib/services/commandes";
import { Order, OrderStatus } from "@/lib/types/order";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { StatBadge } from "@/components/admin/StatBadge";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const columns: Column<Order>[] = [
  {
    header: "Numéro",
    accessor: "orderNumber",
    sortable: true,
  },
  {
    header: "Client",
    accessor: "customerName",
    sortable: true,
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
    header: "Montant",
    accessor: (row) => `${row.amount.toLocaleString()} €`,
    sortable: true,
  },
  {
    header: "Date",
    accessor: (row) => format(row.createdAt, "dd MMM yyyy"),
    sortable: true,
  },
  {
    header: "Actions",
    accessor: (row) => (
      <Link href={`/admin/commandes/${row.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function CommandesPage() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ordersData, statusesData] = await Promise.all([
          getCommandes(),
          getCommandeStatuses(),
        ]);
        setOrders(ordersData);
        setOrderStatuses(statusesData);
      } catch (error) {
        console.error('Error loading data:', error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les commandes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.statusId === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        title="Commandes"
        description="Gérez les commandes de vos clients"
        actions={
          <Link href="/admin/commandes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle commande
            </Button>
          </Link>
        }
      />

      <FiltersBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            {orderStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </Select>
        }
      />

      <DataTable data={filteredOrders} columns={columns} />
    </div>
  );
}

