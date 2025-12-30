"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCommande, getCommandeRaw, createOrder, updateOrder, CreateOrderData, UpdateOrderData } from "@/lib/services/commandes";
import { Order } from "@/lib/types/order";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ProductSelector, SelectedProduct } from "@/components/admin/ProductSelector";
import { StatBadge } from "@/components/admin/StatBadge";
import { supabase } from "@/lib/supabase/client";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const orderId = params.id as string;
  const isNew = orderId === "new";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(isNew);

  const [formData, setFormData] = useState({
    lang: "fr" as "fr" | "en" | "ar",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCompany: "",
    deliveryAddress: "",
    deliveryAddress2: "",
    deliveryPostcode: "",
    deliveryCity: "",
    deliveryCountry: "FR",
    orderType: "quote" as "paid" | "quote",
    paymentStatus: "quote" as "pending" | "paid" | "quote" | "failed" | "refunded",
    fulfillmentStatus: "to_confirm" as "to_confirm" | "to_ship" | "shipped" | "cancelled",
    currency: "EUR" as "EUR" | "USD",
    paymentMethod: "" as "card" | "transfer" | "",
    paidAt: undefined as Date | undefined,
    notes: "",
  });

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  useEffect(() => {
    async function loadData() {
      if (isNew) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [orderData, orderRaw] = await Promise.all([
          getCommande(orderId),
          getCommandeRaw(orderId),
        ]);

        if (!orderData || !orderRaw) {
          addToast({
            title: "Erreur",
            description: "Commande introuvable",
            variant: "destructive",
          });
          router.push("/admin/commandes");
          return;
        }

        setOrder(orderData);

        // Extraire l'adresse de livraison
        const addressParts = orderData.shippingAddress?.street?.split(", ") || [];
        const street = addressParts[0] || "";
        const street2 = addressParts.slice(1).join(", ") || "";

        setFormData({
          lang: (orderRaw.lang as "fr" | "en" | "ar") || "fr",
          customerName: orderData.customerName || "",
          customerEmail: orderData.customerEmail || "",
          customerPhone: orderData.customerPhone || "",
          customerCompany: orderRaw.customer_company || "",
          deliveryAddress: street,
          deliveryAddress2: street2,
          deliveryPostcode: orderData.shippingAddress?.zipCode || "",
          deliveryCity: orderData.shippingAddress?.city || "",
          deliveryCountry: orderData.shippingAddress?.country || "FR",
          orderType: (orderRaw.order_type as "paid" | "quote") || "quote",
          paymentStatus: (orderRaw.payment_status as any) || "quote",
          fulfillmentStatus: (orderRaw.fulfillment_status as any) || "to_confirm",
          currency: (orderRaw.currency as "EUR" | "USD") || "EUR",
          paymentMethod: (orderRaw.payment_method as "card" | "transfer" | "") || "",
          paidAt: orderRaw.paid_at ? new Date(orderRaw.paid_at) : undefined,
          notes: orderRaw.notes || "",
        });

        // Récupérer les items avec is_quote_only depuis order_items
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        // Convertir les items en SelectedProduct
        const products: SelectedProduct[] = orderData.items.map((item) => {
          const rawItem = orderItems?.find((oi: any) => oi.id === item.id);
          return {
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPriceHt: item.price,
            currency: (rawItem?.currency as "EUR" | "USD") || "EUR",
            isQuoteOnly: rawItem?.is_quote_only || false,
          };
        });
        setSelectedProducts(products);
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les données de la commande",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [orderId, isNew, router, addToast]);

  const totalAmount = useMemo(() => {
    return selectedProducts.reduce(
      (sum, product) => sum + product.unitPriceHt * product.quantity,
      0
    );
  }, [selectedProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customerName.trim()) {
      addToast({
        title: "Erreur",
        description: "Le nom du client est requis",
        variant: "destructive",
      });
      return;
    }
    if (!formData.customerEmail.trim()) {
      addToast({
        title: "Erreur",
        description: "L'email du client est requis",
        variant: "destructive",
      });
      return;
    }
    if (!formData.customerPhone.trim()) {
      addToast({
        title: "Erreur",
        description: "Le téléphone du client est requis",
        variant: "destructive",
      });
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      addToast({
        title: "Erreur",
        description: "L'adresse de livraison est requise",
        variant: "destructive",
      });
      return;
    }
    if (!formData.deliveryPostcode.trim()) {
      addToast({
        title: "Erreur",
        description: "Le code postal est requis",
        variant: "destructive",
      });
      return;
    }
    if (!formData.deliveryCity.trim()) {
      addToast({
        title: "Erreur",
        description: "La ville est requise",
        variant: "destructive",
      });
      return;
    }
    if (selectedProducts.length === 0) {
      addToast({
        title: "Erreur",
        description: "Au moins un produit doit être ajouté à la commande",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const orderItems = selectedProducts.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        unitPriceHt: product.unitPriceHt,
        currency: product.currency,
        isQuoteOnly: product.isQuoteOnly,
      }));

      if (isNew) {
        const createData: CreateOrderData = {
          lang: formData.lang,
          customerName: formData.customerName.trim(),
          customerEmail: formData.customerEmail.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerCompany: formData.customerCompany.trim() || undefined,
          deliveryAddress: formData.deliveryAddress.trim(),
          deliveryAddress2: formData.deliveryAddress2.trim() || undefined,
          deliveryPostcode: formData.deliveryPostcode.trim(),
          deliveryCity: formData.deliveryCity.trim(),
          deliveryCountry: formData.deliveryCountry,
          orderType: formData.orderType,
          paymentStatus: formData.paymentStatus,
          fulfillmentStatus: formData.fulfillmentStatus,
          currency: formData.currency,
          paymentMethod: formData.paymentMethod || undefined,
          paidAt: formData.paidAt,
          notes: formData.notes.trim() || undefined,
          items: orderItems,
        };

        const resultOrder = await createOrder(createData);
        if (resultOrder) {
          addToast({
            title: "Succès",
            description: "La commande a été créée avec succès",
          });
          router.replace(`/admin/commandes/${resultOrder.id}`);
        }
      } else {
        const updateData: UpdateOrderData = {
          lang: formData.lang,
          customerName: formData.customerName.trim(),
          customerEmail: formData.customerEmail.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerCompany: formData.customerCompany.trim() || undefined,
          deliveryAddress: formData.deliveryAddress.trim(),
          deliveryAddress2: formData.deliveryAddress2.trim() || undefined,
          deliveryPostcode: formData.deliveryPostcode.trim(),
          deliveryCity: formData.deliveryCity.trim(),
          deliveryCountry: formData.deliveryCountry,
          orderType: formData.orderType,
          paymentStatus: formData.paymentStatus,
          fulfillmentStatus: formData.fulfillmentStatus,
          currency: formData.currency,
          paymentMethod: formData.paymentMethod || undefined,
          paidAt: formData.paidAt,
          notes: formData.notes.trim() || undefined,
          items: orderItems,
        };

        const resultOrder = await updateOrder(orderId, updateData);
        if (resultOrder) {
          setOrder(resultOrder);
          setIsEditMode(false);
          addToast({
            title: "Succès",
            description: "La commande a été mise à jour avec succès",
          });
        }
      }
    } catch (error) {
      console.error("Error saving order:", error);
      addToast({
        title: "Erreur",
        description: `Impossible de ${isNew ? "créer" : "mettre à jour"} la commande`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!isNew && !order) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Commande introuvable"
          description="La commande demandée n'existe pas"
        />
        <Button onClick={() => router.push("/admin/commandes")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Nouvelle commande" : (order?.orderNumber || "Commande")}
        description={isNew ? "Créez une nouvelle commande" : "Détails de la commande"}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/commandes")}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            {!isNew && !isEditMode && (
              <Button
                variant="default"
                onClick={() => setIsEditMode(true)}
                size="sm"
              >
                Modifier
              </Button>
            )}
          </>
        }
      />

      {!isNew && !isEditMode ? (
        // Mode consultation
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-[#4B5563]">Nom</p>
                <p className="text-sm">{order?.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#4B5563]">Email</p>
                <p className="text-sm">{order?.customerEmail}</p>
              </div>
              {order?.customerPhone && (
                <div>
                  <p className="text-sm font-medium text-[#4B5563]">Téléphone</p>
                  <p className="text-sm">{order.customerPhone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adresse de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order?.shippingAddress && (
                <>
                  <div>
                    <p className="text-sm font-medium text-[#4B5563]">Adresse</p>
                    <p className="text-sm">{order.shippingAddress.street}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4B5563]">Ville</p>
                    <p className="text-sm">
                      {order.shippingAddress.zipCode} {order.shippingAddress.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4B5563]">Pays</p>
                    <p className="text-sm">{order.shippingAddress.country}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order?.status && (
                <div>
                  <p className="text-sm font-medium text-[#4B5563] mb-2">Statut</p>
                  <StatBadge label={order.status.label} color={order.status.color} />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[#4B5563]">Montant total</p>
                <p className="text-lg font-bold">{order?.amount.toLocaleString("fr-FR")} € HT</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#4B5563]">Date de création</p>
                <p className="text-sm">
                  {order?.createdAt && format(order.createdAt, "dd MMMM yyyy à HH:mm", { locale: fr })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order?.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-[#4B5563]">
                        {item.quantity} × {item.price.toLocaleString("fr-FR")} € HT
                      </p>
                    </div>
                    <p className="font-semibold">{item.total.toLocaleString("fr-FR")} € HT</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Mode édition/création
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle>Informations client</CardTitle>
                <CardDescription>Nom, email, téléphone et entreprise du client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-sm font-semibold">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                    required
                    placeholder="Nom complet du client"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail" className="text-sm font-semibold">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                    required
                    placeholder="email@example.com"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="text-sm font-semibold">
                    Téléphone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                    required
                    placeholder="0612345678"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerCompany" className="text-sm font-semibold">
                    Entreprise
                  </Label>
                  <Input
                    id="customerCompany"
                    value={formData.customerCompany}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerCompany: e.target.value }))}
                    placeholder="Nom de l'entreprise"
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Adresse de livraison */}
            <Card>
              <CardHeader>
                <CardTitle>Adresse de livraison</CardTitle>
                <CardDescription>Adresse complète de livraison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress" className="text-sm font-semibold">
                    Adresse <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                    required
                    placeholder="123 Rue Example"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress2" className="text-sm font-semibold">
                    Complément d'adresse
                  </Label>
                  <Input
                    id="deliveryAddress2"
                    value={formData.deliveryAddress2}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deliveryAddress2: e.target.value }))}
                    placeholder="Appartement, étage, etc."
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryPostcode" className="text-sm font-semibold">
                      Code postal <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deliveryPostcode"
                      value={formData.deliveryPostcode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deliveryPostcode: e.target.value }))}
                      required
                      placeholder="75001"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryCity" className="text-sm font-semibold">
                      Ville <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deliveryCity"
                      value={formData.deliveryCity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deliveryCity: e.target.value }))}
                      required
                      placeholder="Paris"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryCountry" className="text-sm font-semibold">
                    Pays
                  </Label>
                  <Select
                    id="deliveryCountry"
                    value={formData.deliveryCountry}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deliveryCountry: e.target.value }))}
                    className="h-11"
                  >
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="LU">Luxembourg</option>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Type et statuts */}
            <Card>
              <CardHeader>
                <CardTitle>Type et statuts</CardTitle>
                <CardDescription>Type de commande et statuts de paiement et expédition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderType" className="text-sm font-semibold">
                    Type de commande
                  </Label>
                  <Select
                    id="orderType"
                    value={formData.orderType}
                    onChange={(e) => setFormData((prev) => ({ ...prev, orderType: e.target.value as "paid" | "quote" }))}
                    className="h-11"
                  >
                    <option value="quote">Devis</option>
                    <option value="paid">Commande payée</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus" className="text-sm font-semibold">
                    Statut de paiement
                  </Label>
                  <Select
                    id="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData((prev) => ({ ...prev, paymentStatus: e.target.value as any }))}
                    className="h-11"
                  >
                    <option value="quote">Devis</option>
                    <option value="pending">En attente</option>
                    <option value="paid">Payé</option>
                    <option value="failed">Échec</option>
                    <option value="refunded">Remboursé</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fulfillmentStatus" className="text-sm font-semibold">
                    Statut d'expédition
                  </Label>
                  <Select
                    id="fulfillmentStatus"
                    value={formData.fulfillmentStatus}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fulfillmentStatus: e.target.value as any }))}
                    className="h-11"
                  >
                    <option value="to_confirm">À confirmer</option>
                    <option value="to_ship">À expédier</option>
                    <option value="shipped">Expédié</option>
                    <option value="cancelled">Annulé</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-semibold">
                    Devise
                  </Label>
                  <Select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value as "EUR" | "USD" }))}
                    className="h-11"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Paiement et notes */}
            <Card>
              <CardHeader>
                <CardTitle>Paiement et notes</CardTitle>
                <CardDescription>Méthode de paiement et notes internes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-sm font-semibold">
                    Méthode de paiement
                  </Label>
                  <Select
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value as "card" | "transfer" | "" }))}
                    className="h-11"
                  >
                    <option value="">Non spécifié</option>
                    <option value="card">Carte bancaire</option>
                    <option value="transfer">Virement</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold">
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:border-[#10B981] resize-y"
                    placeholder="Notes internes sur la commande"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Produits */}
          <Card>
            <CardHeader>
              <CardTitle>Produits</CardTitle>
              <CardDescription>Ajoutez les produits à la commande</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSelector
                selectedProducts={selectedProducts}
                onProductsChange={setSelectedProducts}
                lang={formData.lang}
              />
            </CardContent>
          </Card>

          {/* Total */}
          <Card>
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">Total HT</p>
                <p className="text-2xl font-bold">{totalAmount.toLocaleString("fr-FR")} €</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {!isNew && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditMode(false);
                  // Recharger les données
                  router.refresh();
                }}
                disabled={saving}
                size="lg"
              >
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={saving} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Enregistrement..." : `Enregistrer ${isNew ? "" : "les modifications"}`}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

