import { getCommandes } from './commandes';
import { getLeads } from './leads';
import { getProducts } from './products';
import { format } from 'date-fns';
import { Order } from '@/lib/types/order';
import { Lead } from '@/lib/types/lead';
import { Product } from '@/lib/types/product';

export type Period = 'today' | '7d' | '30d' | 'month' | 'quarter' | 'year' | 'custom';
export interface DateRange {
  start: Date;
  end: Date;
}

export function getDateRange(period: Period, customRange?: DateRange): DateRange {
  const now = new Date();
  const end = customRange?.end || now;
  let start: Date;

  switch (period) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '7d':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case 'custom':
      start = customRange?.start || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { start, end };
}

export function getPreviousPeriodRange(currentRange: DateRange): DateRange {
  const duration = currentRange.end.getTime() - currentRange.start.getTime();
  return {
    start: new Date(currentRange.start.getTime() - duration),
    end: currentRange.start,
  };
}

export interface RevenueStats {
  total: number;
  period: number;
  previousPeriod: number;
  growth: number;
  orderCount: number;
  averageOrderValue: number;
}

export async function calculateRevenue(period: Period, customRange?: DateRange): Promise<RevenueStats> {
  const orders = await getCommandes();
  const range = getDateRange(period, customRange);
  const previousRange = getPreviousPeriodRange(range);

  // Filtrer les commandes terminées
  const completedOrders = orders.filter(
    (order) => order.statusId === 'completed' || order.statusId === 'paid'
  );

  // Revenus total (toutes les commandes terminées)
  const total = completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

  // Revenus de la période
  const periodOrders = completedOrders.filter(
    (order) => order.createdAt >= range.start && order.createdAt <= range.end
  );
  const periodRevenue = periodOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

  // Revenus de la période précédente
  const previousPeriodOrders = completedOrders.filter(
    (order) => order.createdAt >= previousRange.start && order.createdAt < previousRange.end
  );
  const previousPeriodRevenue = previousPeriodOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

  // Calcul de la croissance
  const growth = previousPeriodRevenue > 0
    ? ((periodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
    : periodRevenue > 0 ? 100 : 0;

  return {
    total,
    period: periodRevenue,
    previousPeriod: previousPeriodRevenue,
    growth,
    orderCount: periodOrders.length,
    averageOrderValue: periodOrders.length > 0 ? periodRevenue / periodOrders.length : 0,
  };
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  periodTotal: number;
  periodCompleted: number;
}

export async function calculateOrderStats(period: Period, customRange?: DateRange): Promise<OrderStats> {
  const orders = await getCommandes();
  const range = getDateRange(period, customRange);

  const periodOrders = orders.filter(
    (order) => order.createdAt >= range.start && order.createdAt <= range.end
  );

  return {
    total: orders.length,
    pending: orders.filter((o) => o.statusId === 'pending' || o.statusId === 'quote').length,
    processing: orders.filter((o) => o.statusId === 'processing').length,
    completed: orders.filter((o) => o.statusId === 'completed' || o.statusId === 'paid').length,
    cancelled: orders.filter((o) => o.statusId === 'cancelled').length,
    periodTotal: periodOrders.length,
    periodCompleted: periodOrders.filter((o) => o.statusId === 'completed' || o.statusId === 'paid').length,
  };
}

export interface LeadStats {
  total: number;
  new: number;
  inProgress: number;
  qualified: number;
  won: number;
  lost: number;
  conversionRate: number;
  potentialRevenue: number;
  periodNew: number;
  periodWon: number;
}

export async function calculateLeadStats(period: Period, customRange?: DateRange): Promise<LeadStats> {
  const leads = await getLeads();
  const range = getDateRange(period, customRange);

  const periodLeads = leads.filter(
    (lead) => lead.createdAt >= range.start && lead.createdAt <= range.end
  );

  const won = leads.filter((l) => l.statusId === 'won').length;
  const conversionRate = leads.length > 0 ? (won / leads.length) * 100 : 0;
  const potentialRevenue = leads.reduce((sum, l) => sum + (l.potentialRevenue || 0), 0);

  return {
    total: leads.length,
    new: leads.filter((l) => l.statusId === 'new').length,
    inProgress: leads.filter((l) => l.statusId === 'in_progress').length,
    qualified: leads.filter((l) => l.statusId === 'qualified').length,
    won,
    lost: leads.filter((l) => l.statusId === 'lost').length,
    conversionRate,
    potentialRevenue,
    periodNew: periodLeads.length,
    periodWon: periodLeads.filter((l) => l.statusId === 'won').length,
  };
}

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  inactive: number;
  lowStock: number;
}

export async function calculateProductStats(): Promise<ProductStats> {
  const products = await getProducts();

  return {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    draft: products.filter((p) => p.status === 'draft').length,
    inactive: products.filter((p) => p.status === 'inactive').length,
    lowStock: products.filter((p) => (p.stock || 0) < 10).length, // Seuil à 10
  };
}

export interface TopProduct {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export async function getTopProducts(limit: number = 10, period: Period, customRange?: DateRange): Promise<TopProduct[]> {
  const orders = await getCommandes();
  const range = getDateRange(period, customRange);

  // Filtrer les commandes de la période
  const periodOrders = orders.filter(
    (order) => order.createdAt >= range.start && order.createdAt <= range.end
  );

  // Compter les produits vendus
  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

  periodOrders.forEach((order) => {
    order.items?.forEach((item) => {
      const existing = productMap.get(item.productId) || { name: item.productName, quantity: 0, revenue: 0 };
      productMap.set(item.productId, {
        name: item.productName,
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.total,
      });
    });
  });

  // Trier par quantité et prendre le top
  return Array.from(productMap.entries())
    .map(([productId, data]) => ({
      productId,
      productName: data.name,
      quantity: data.quantity,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export interface SalesByCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
  orderCount: number;
}

export async function getSalesByCategory(period: Period, customRange?: DateRange): Promise<SalesByCategory[]> {
  const orders = await getCommandes();
  const products = await getProducts();
  const range = getDateRange(period, customRange);

  // Filtrer les commandes de la période
  const periodOrders = orders.filter(
    (order) => order.createdAt >= range.start && order.createdAt <= range.end
  );

  // Créer un map catégorie -> revenus
  const categoryMap = new Map<string, { name: string; revenue: number; orderCount: number }>();

  periodOrders.forEach((order) => {
    const orderCategories = new Set<string>();
    order.items?.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product?.categoryId) {
        orderCategories.add(product.categoryId);
        const categoryName = product.category?.name || 'Sans catégorie';
        const existing = categoryMap.get(product.categoryId) || { name: categoryName, revenue: 0, orderCount: 0 };
        categoryMap.set(product.categoryId, {
          name: categoryName,
          revenue: existing.revenue + item.total,
          orderCount: existing.orderCount + (orderCategories.has(product.categoryId) ? 0 : 1),
        });
      }
    });
    // Compter les commandes par catégorie
    orderCategories.forEach((catId) => {
      const existing = categoryMap.get(catId);
      if (existing) {
        categoryMap.set(catId, { ...existing, orderCount: existing.orderCount + 1 });
      }
    });
  });

  return Array.from(categoryMap.entries())
    .map(([categoryId, data]) => ({
      categoryId,
      categoryName: data.name,
      revenue: data.revenue,
      orderCount: data.orderCount,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface ConversionFunnel {
  new: number;
  inProgress: number;
  qualified: number;
  won: number;
  lost: number;
}

export async function getConversionFunnel(period: Period, customRange?: DateRange): Promise<ConversionFunnel> {
  const leads = await getLeads();
  const range = getDateRange(period, customRange);

  const periodLeads = leads.filter(
    (lead) => lead.createdAt >= range.start && lead.createdAt <= range.end
  );

  return {
    new: periodLeads.filter((l) => l.statusId === 'new').length,
    inProgress: periodLeads.filter((l) => l.statusId === 'in_progress').length,
    qualified: periodLeads.filter((l) => l.statusId === 'qualified').length,
    won: periodLeads.filter((l) => l.statusId === 'won').length,
    lost: periodLeads.filter((l) => l.statusId === 'lost').length,
  };
}

export interface RevenueTrendData {
  date: string;
  revenue: number;
  orders: number;
}

export async function getRevenueTrend(period: Period, customRange?: DateRange): Promise<RevenueTrendData[]> {
  const orders = await getCommandes();
  const range = getDateRange(period, customRange);

  // Filtrer les commandes terminées de la période
  const periodOrders = orders.filter(
    (order) =>
      (order.statusId === 'completed' || order.statusId === 'paid') &&
      order.createdAt >= range.start &&
      order.createdAt <= range.end
  );

  // Grouper par jour
  const dailyMap = new Map<string, { revenue: number; orders: number }>();

  periodOrders.forEach((order) => {
    const dateKey = format(order.createdAt, 'yyyy-MM-dd');
    const existing = dailyMap.get(dateKey) || { revenue: 0, orders: 0 };
    dailyMap.set(dateKey, {
      revenue: existing.revenue + (order.amount || 0),
      orders: existing.orders + 1,
    });
  });

  // Convertir en array et trier par date
  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface LeadTrendData {
  date: string;
  count: number;
  won: number;
}

export async function getLeadTrend(period: Period, customRange?: DateRange): Promise<LeadTrendData[]> {
  const leads = await getLeads();
  const range = getDateRange(period, customRange);

  // Filtrer les leads de la période
  const periodLeads = leads.filter(
    (lead) => lead.createdAt >= range.start && lead.createdAt <= range.end
  );

  // Grouper par jour
  const dailyMap = new Map<string, { count: number; won: number }>();

  periodLeads.forEach((lead) => {
    const dateKey = format(lead.createdAt, 'yyyy-MM-dd');
    const existing = dailyMap.get(dateKey) || { count: 0, won: 0 };
    dailyMap.set(dateKey, {
      count: existing.count + 1,
      won: existing.won + (lead.statusId === 'won' ? 1 : 0),
    });
  });

  // Convertir en array et trier par date
  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      count: data.count,
      won: data.won,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

