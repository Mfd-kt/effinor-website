"use client";

import { useState, useEffect, useMemo } from "react";
import { KpiCards } from "@/components/admin/KpiCards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable, Column } from "@/components/admin/DataTable";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { ConversionFunnel } from "@/components/admin/ConversionFunnel";
import { TopProductsChart } from "@/components/admin/TopProductsChart";
import { SalesByCategoryChart } from "@/components/admin/SalesByCategoryChart";
import { LeadsTrendChart } from "@/components/admin/LeadsTrendChart";
import {
  Users,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Euro,
  Activity,
  Bell,
  Package,
  Target,
  AlertCircle,
  X,
} from "lucide-react";
import { getCommandes } from "@/lib/services/commandes";
import { getLeads } from "@/lib/services/leads";
import { getVisiteurs } from "@/lib/services/visiteurs";
import { useNotificationsContext } from "@/components/admin/NotificationsProvider";
import {
  calculateRevenue,
  calculateOrderStats,
  calculateLeadStats,
  calculateProductStats,
  getTopProducts,
  getSalesByCategory,
  getConversionFunnel,
  getRevenueTrend,
  getLeadTrend,
  Period,
  DateRange,
  getDateRange,
} from "@/lib/services/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

const activityColumns: Column<any>[] = [
  {
    header: "Type",
    accessor: "type",
  },
  {
    header: "Description",
    accessor: "description",
  },
  {
    header: "Date",
    accessor: (row) => format(row.date, "dd MMM yyyy", { locale: fr }),
  },
];

export default function DashboardPage() {
  const { addToast } = useToast();
  const { notifications, markAsRead, removeNotification, markAllAsRead, unreadCount } = useNotificationsContext();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("30d");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);

  // KPIs
  const [kpiCards, setKpiCards] = useState<any[]>([]);

  // Charts data
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [leadTrend, setLeadTrend] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<any>(null);

  // Recent activity
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Alerts
  const [alerts, setAlerts] = useState<any[]>([]);

  const dateRange = useMemo(() => {
    return getDateRange(period, customRange);
  }, [period, customRange]);

  const periodLabel = useMemo(() => {
    const labels: Record<Period, string> = {
      today: "Aujourd'hui",
      '7d': "7 derniers jours",
      '30d': "30 derniers jours",
      month: "Ce mois",
      quarter: "Ce trimestre",
      year: "Cette année",
      custom: customRange
        ? `${format(customRange.start, "dd MMM", { locale: fr })} - ${format(customRange.end, "dd MMM", { locale: fr })}`
        : "Personnalisé",
    };
    return labels[period];
  }, [period, customRange]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Charger toutes les données en parallèle
        const [
          revenueStats,
          orderStats,
          leadStats,
          productStats,
          ordersData,
          leadsData,
          visitorsData,
        ] = await Promise.all([
          calculateRevenue(period, customRange),
          calculateOrderStats(period, customRange),
          calculateLeadStats(period, customRange),
          calculateProductStats(),
          getCommandes(),
          getLeads(),
          getVisiteurs(),
        ]);
        
        // notificationsData sera chargé séparément si nécessaire
        const notificationsData: any[] = [];

        // Charger les données des graphiques
        const [revenueTrendData, leadTrendData, topProductsData, salesByCategoryData, conversionFunnelData] =
          await Promise.all([
            getRevenueTrend(period, customRange),
            getLeadTrend(period, customRange),
            getTopProducts(10, period, customRange),
            getSalesByCategory(period, customRange),
            getConversionFunnel(period, customRange),
          ]);

        setRevenueTrend(Array.isArray(revenueTrendData) ? revenueTrendData : []);
        setLeadTrend(Array.isArray(leadTrendData) ? leadTrendData : []);
        setTopProducts(Array.isArray(topProductsData) ? topProductsData : []);
        setSalesByCategory(Array.isArray(salesByCategoryData) ? salesByCategoryData : []);
        setConversionFunnel(conversionFunnelData || { new: 0, inProgress: 0, qualified: 0, won: 0, lost: 0 });

        // Calculer les KPIs avec les vraies données
        const activeVisitors = visitorsData.filter((v) => v.status === "active").length;

        setKpiCards([
          {
            title: "CA Total",
            value: `${(revenueStats.total / 1000).toFixed(0)}k €`,
            icon: Euro,
            trend: {
              value: revenueStats.growth,
              isPositive: revenueStats.growth >= 0,
              label: "vs période précédente",
            },
            description: `${revenueStats.orderCount} commandes terminées`,
          },
          {
            title: "CA Période",
            value: `${(revenueStats.period / 1000).toFixed(0)}k €`,
            icon: TrendingUp,
            trend: {
              value: revenueStats.growth,
              isPositive: revenueStats.growth >= 0,
              label: "vs période précédente",
            },
            description: `Panier moyen: ${revenueStats.averageOrderValue.toFixed(0)} €`,
          },
          {
            title: "Leads totaux",
            value: leadStats.total,
            icon: Target,
            trend: {
              value: leadStats.total > 0
                ? ((leadStats.periodNew / leadStats.total) * 100)
                : 0,
              isPositive: true,
              label: "nouveaux cette période",
            },
            description: `${leadStats.won} gagnés (${leadStats.conversionRate.toFixed(1)}%)`,
          },
          {
            title: "Commandes",
            value: orderStats.total,
            icon: ShoppingCart,
            trend: {
              value: orderStats.total > 0
                ? ((orderStats.periodTotal / orderStats.total) * 100)
                : 0,
              isPositive: true,
              label: "cette période",
            },
            description: `${orderStats.completed} terminées, ${orderStats.pending} en attente`,
          },
          {
            title: "Produits",
            value: productStats.total,
            icon: Package,
            description: `${productStats.active} actifs, ${productStats.lowStock} en stock faible`,
          },
          {
            title: "CA Potentiel",
            value: `${(leadStats.potentialRevenue / 1000).toFixed(0)}k €`,
            icon: Euro,
            description: "Basé sur les leads actifs",
          },
        ]);

        // Activité récente (commandes + leads)
        const recentOrders = ordersData
          .slice(0, 3)
          .map((order) => ({
            id: order.id,
            type: "Commande",
            description: `${order.orderNumber} - ${order.customerName}`,
            date: order.createdAt,
            link: `/admin/commandes/${order.id}`,
          }));

        const recentLeads = leadsData
          .slice(0, 2)
          .map((lead) => ({
            id: lead.id,
            type: "Lead",
            description: `${lead.fullName} - ${lead.email}`,
            date: lead.createdAt,
            link: `/admin/leads/${lead.id}`,
          }));

        setRecentActivity([...recentOrders, ...recentLeads].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5));

        // Alertes
        const newAlerts: any[] = [];
        if (orderStats.pending > 0) {
          newAlerts.push({
            id: "pending-orders",
            type: "warning",
            title: `${orderStats.pending} commande(s) en attente`,
            description: "Des commandes nécessitent votre attention",
            link: "/admin/commandes?status=pending",
            icon: ShoppingCart,
          });
        }
        if (productStats.lowStock > 0) {
          newAlerts.push({
            id: "low-stock",
            type: "warning",
            title: `${productStats.lowStock} produit(s) en stock faible`,
            description: "Vérifiez les niveaux de stock",
            link: "/admin/produits",
            icon: Package,
          });
        }
        if (leadStats.new > 0) {
          newAlerts.push({
            id: "new-leads",
            type: "info",
            title: `${leadStats.new} nouveau(x) lead(s)`,
            description: "Nouveaux leads à traiter",
            link: "/admin/leads?status=new",
            icon: Target,
          });
        }
        setAlerts(newAlerts);
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [period, customRange, addToast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec filtre de période */}
      <PageHeader
        title="Dashboard"
        description={`Vue d'ensemble de votre activité - ${periodLabel}`}
        actions={
          <DateRangeFilter
            period={period}
            onPeriodChange={setPeriod}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        }
      />

      {/* Alertes importantes */}
      {alerts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-effinor-gray-dark flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-effinor-emerald" />
            Alertes importantes
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-effinor-emerald hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <alert.icon className="h-5 w-5 text-effinor-emerald mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-effinor-gray-dark">{alert.title}</p>
                      <p className="text-xs text-effinor-gray-text mt-1">{alert.description}</p>
                      {alert.link && (
                        <Link href={alert.link}>
                          <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs">
                            Voir →
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Section Financier */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-effinor-gray-dark flex items-center gap-2">
            <Euro className="h-5 w-5 text-effinor-emerald" />
            Indicateurs financiers
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.slice(0, 4).map((card, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-effinor-gray-text">
                  {card.title}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-effinor-emerald/10 flex items-center justify-center">
                  <card.icon className="h-4 w-4 text-effinor-emerald" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-effinor-gray-dark">
                  {typeof card.value === 'number' 
                    ? card.value.toLocaleString('fr-FR')
                    : card.value}
                </div>
                {card.trend && (
                  <div className="flex items-center gap-1 mt-2">
                    {card.trend.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-effinor-emerald" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <p
                      className={`text-xs font-medium ${
                        card.trend.isPositive ? "text-effinor-emerald" : "text-red-600"
                      }`}
                    >
                      {card.trend.isPositive ? "+" : ""}
                      {Math.abs(card.trend.value).toFixed(1)}%
                      {card.trend.label && ` ${card.trend.label}`}
                    </p>
                  </div>
                )}
                {card.description && (
                  <p className="text-xs text-effinor-gray-text mt-1">
                    {card.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Graphiques de tendances */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-effinor-gray-dark flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-effinor-emerald" />
          Tendances
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart data={revenueTrend} loading={loading} period={periodLabel} />
          <LeadsTrendChart data={leadTrend} loading={loading} />
        </div>
      </section>

      {/* Section Ventes & Marketing */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-effinor-gray-dark flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-effinor-emerald" />
          Ventes & Marketing
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ConversionFunnel 
            data={conversionFunnel || { new: 0, inProgress: 0, qualified: 0, won: 0, lost: 0 }} 
            loading={loading} 
          />
          <SalesByCategoryChart data={salesByCategory} loading={loading} />
        </div>
      </section>

      {/* Section Produits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-effinor-gray-dark flex items-center gap-2">
            <Package className="h-5 w-5 text-effinor-emerald" />
            Produits
          </h2>
          <Link href="/admin/produits">
            <Button variant="outline" size="sm">
              Voir tous les produits →
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {kpiCards.slice(4, 6).map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-effinor-gray-text">
                  {card.title}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-effinor-emerald/10 flex items-center justify-center">
                  <card.icon className="h-4 w-4 text-effinor-emerald" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-effinor-gray-dark">
                  {typeof card.value === 'number' 
                    ? card.value.toLocaleString('fr-FR')
                    : card.value}
                </div>
                {card.description && (
                  <p className="text-xs text-effinor-gray-text mt-1">
                    {card.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <TopProductsChart data={topProducts} loading={loading} limit={10} />
      </section>

      {/* Section Activité & Notifications */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-effinor-gray-dark flex items-center gap-2">
          <Activity className="h-5 w-5 text-effinor-emerald" />
          Activité récente
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-effinor-emerald" />
                Dernières actions
              </CardTitle>
              <CardDescription>Commandes et leads récents</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-effinor-gray-text text-center py-8">
                  Aucune activité récente
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <Link
                      key={activity.id}
                      href={activity.link || "#"}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-effinor-emerald hover:bg-effinor-gray-light transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-effinor-gray-dark">
                            {activity.type}
                          </p>
                          <p className="text-xs text-effinor-gray-text mt-1 truncate">
                            {activity.description}
                          </p>
                        </div>
                        <p className="text-xs text-effinor-gray-text ml-3 flex-shrink-0">
                          {format(activity.date, "dd MMM", { locale: fr })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-effinor-emerald" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-effinor-emerald text-white">
                        {unreadCount}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Alertes et informations importantes</CardDescription>
                </div>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-sm text-effinor-gray-text text-center py-8">
                  Aucune notification
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notifications.slice(0, 10).map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.link}
                      onClick={() => markAsRead(notification.id)}
                      className={`block p-3 rounded-lg border transition-all ${
                        notification.read
                          ? 'border-gray-200 bg-effinor-gray-light hover:bg-effinor-gray-medium'
                          : 'border-effinor-emerald bg-effinor-emerald/5 hover:bg-effinor-emerald/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${
                              notification.read ? 'text-effinor-gray-dark' : 'text-effinor-gray-dark font-semibold'
                            }`}>
                              {notification.type === 'order' ? '🛒' : '📧'} {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-effinor-emerald flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-effinor-gray-text mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-effinor-gray-text mt-2">
                            {format(notification.createdAt, "dd MMM yyyy HH:mm", { locale: fr })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Link>
                  ))}
                  {notifications.length > 10 && (
                    <p className="text-xs text-effinor-gray-text text-center pt-2">
                      + {notifications.length - 10} autres notifications
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
