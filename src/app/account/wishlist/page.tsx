"use client";

import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/components/commerce/CartProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeartIcon, TrashIcon, CartIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import Link from "next/link";
import type { Product } from "@/data/products";

// Set some default mock products in case local storage is empty
const defaultWishlistProducts: Product[] = [
  {
    id: "p1",
    slug: "macbook-air-13-m3",
    name: 'MacBook Air 13" M3',
    spec: "8-core · 16GB · 512GB",
    category: "laptops",
    brand: "Apple",
    ram: 16,
    storage: 512,
    price: 1199,
    compareAtPrice: 1299,
    rating: 4.8,
    reviewCount: 126,
    stock: "in-stock",
    badge: "sale",
  },
  {
    id: "p3",
    slug: "nvidia-rtx-4070-ti",
    name: "NVIDIA RTX 4070 Ti",
    spec: "12GB GDDR6X · triple fan",
    category: "components",
    brand: "NVIDIA",
    price: 799,
    compareAtPrice: 869,
    rating: 4.9,
    reviewCount: 203,
    stock: "in-stock",
    badge: "sale",
  },
];

const WISHLIST_STORAGE_KEY = "devops-target:wishlist";

export default function WishlistPage() {
  const toast = useToast();
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (raw) {
          setWishlist(JSON.parse(raw));
        } else {
          // Initialize with default items for demo
          setWishlist(defaultWishlistProducts);
          window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(defaultWishlistProducts));
        }
      } catch {
        setWishlist(defaultWishlistProducts);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const saveWishlist = (items: Product[]) => {
    setWishlist(items);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Safe fallback
      }
    }
  };

  const handleRemove = (productId: string) => {
    const next = wishlist.filter((p) => p.id !== productId);
    saveWishlist(next);
    toast.show("Product removed from wishlist.", "info");
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === "out-of-stock") {
      toast.show("This product is currently out of stock.", "warning");
      return;
    }
    addItem(product);
    toast.show(`Added ${product.name} to cart!`, "success");
    // Optionally remove from wishlist after adding to cart
    const next = wishlist.filter((p) => p.id !== product.id);
    saveWishlist(next);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Wishlist", href: "/account/wishlist" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          My Wishlist
        </h1>
        <p className="text-[13px] text-secondary">
          Products you saved for later. Add them to your cart to purchase.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4 space-y-4">
              <div className="aspect-square bg-surface-2 rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-surface-2 rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-surface-2 rounded animate-pulse" />
            </Card>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={<HeartIcon className="h-6 w-6 text-tertiary" />}
          title="Your wishlist is empty"
          description="Save products while browsing to keep track of them here."
          action={
            <Button as="a" href="/products">
              Browse Products
            </Button>
          }
          className="py-16"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <Card key={product.id} className="group relative flex flex-col justify-between overflow-hidden border border-border">
              <div className="p-4 flex-1">
                {/* Product badge & stock status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    {product.badge && (
                      <span className="rounded bg-accent/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-accent">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wide ${
                      product.stock === "in-stock"
                        ? "text-success"
                        : product.stock === "low-stock"
                        ? "text-warning"
                        : "text-danger"
                    }`}
                  >
                    {product.stock.replace("-", " ")}
                  </span>
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <span className="text-[10.5px] font-bold text-tertiary uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="text-[13.5px] font-bold text-primary truncate hover:text-accent group-hover:text-accent">
                    <Link href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-[11.5px] font-medium text-secondary truncate">
                    {product.spec}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-base font-extrabold font-mono text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-tertiary line-through font-mono">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border bg-surface-2 p-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRemove(product.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-secondary hover:text-danger hover:border-danger/30 transition-colors cursor-pointer"
                  aria-label="Remove from wishlist"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === "out-of-stock"}
                  size="sm"
                  variant="primary"
                  iconStart={<CartIcon className="h-4 w-4" />}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
