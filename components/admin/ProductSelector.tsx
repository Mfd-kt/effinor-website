"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Search, Plus, X } from "lucide-react";
import { getProducts } from "@/lib/services/products";
import { Product } from "@/lib/types/product";
import { Skeleton } from "@/components/ui/skeleton";

export interface SelectedProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceHt: number;
  currency: 'EUR' | 'USD';
  isQuoteOnly: boolean;
}

interface ProductSelectorProps {
  selectedProducts: SelectedProduct[];
  onProductsChange: (products: SelectedProduct[]) => void;
  lang?: 'fr' | 'en' | 'ar';
}

export function ProductSelector({
  selectedProducts,
  onProductsChange,
  lang = 'fr',
}: ProductSelectorProps) {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading products:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [addToast]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.slug?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleAddProduct = (product: Product) => {
    // Vérifier si le produit est déjà sélectionné
    const existingIndex = selectedProducts.findIndex(
      (p) => p.productId === product.id
    );

    if (existingIndex >= 0) {
      // Augmenter la quantité
      const updated = [...selectedProducts];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      onProductsChange(updated);
    } else {
      // Ajouter le produit
      const price = product.price || 0;
      const newProduct: SelectedProduct = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPriceHt: price,
        currency: 'EUR',
        isQuoteOnly: product.priceOnQuote || false,
      };
      onProductsChange([...selectedProducts, newProduct]);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleRemoveProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter((p) => p.productId !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    const updated = selectedProducts.map((p) =>
      p.productId === productId ? { ...p, quantity } : p
    );
    onProductsChange(updated);
  };

  const handlePriceChange = (productId: string, price: number) => {
    const updated = selectedProducts.map((p) =>
      p.productId === productId ? { ...p, unitPriceHt: price } : p
    );
    onProductsChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Produits</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {isOpen && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4B5563]" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-sm text-[#4B5563] text-center py-4">
                  Aucun produit trouvé
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-[#F9FAFB] cursor-pointer"
                      onClick={() => handleAddProduct(product)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-[#4B5563]">
                          {product.priceOnQuote
                            ? "Sur devis"
                            : `${(product.price || 0).toLocaleString("fr-FR")} € HT`}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddProduct(product);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          {selectedProducts.map((selected) => {
            const product = products.find((p) => p.id === selected.productId);
            const lineTotal = selected.unitPriceHt * selected.quantity;

            return (
              <Card key={selected.productId}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{selected.productName}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(selected.productId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-[#4B5563]">
                            Quantité
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={selected.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                selected.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#4B5563]">
                            Prix unitaire HT
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={selected.unitPriceHt}
                            onChange={(e) =>
                              handlePriceChange(
                                selected.productId,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#4B5563]">
                            Total HT
                          </label>
                          <div className="h-8 flex items-center text-sm font-medium">
                            {lineTotal.toLocaleString("fr-FR")} €
                          </div>
                        </div>
                      </div>

                      {product?.priceOnQuote && (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`quote-${selected.productId}`}
                            checked={selected.isQuoteOnly}
                            onChange={(e) => {
                              const updated = selectedProducts.map((p) =>
                                p.productId === selected.productId
                                  ? { ...p, isQuoteOnly: e.target.checked }
                                  : p
                              );
                              onProductsChange(updated);
                            }}
                            className="rounded"
                          />
                          <label
                            htmlFor={`quote-${selected.productId}`}
                            className="text-xs text-[#4B5563]"
                          >
                            Sur devis uniquement
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedProducts.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-sm text-[#4B5563]">
            Aucun produit sélectionné. Cliquez sur "Ajouter un produit" pour
            commencer.
          </p>
        </div>
      )}
    </div>
  );
}

