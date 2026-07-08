import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Product } from "@/models/product";
import { loadManagedProducts, productStoreEventName } from "@/services/localStore";

type ProductCatalogProps = {
  navigate: (path: string) => void;
};

export function ProductCatalog({ navigate }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(() => loadManagedProducts());
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  useEffect(() => {
    const refreshProducts = () => setProducts(loadManagedProducts());
    window.addEventListener(productStoreEventName(), refreshProducts);
    window.addEventListener("storage", refreshProducts);
    window.addEventListener("focus", refreshProducts);
    document.addEventListener("visibilitychange", refreshProducts);
    refreshProducts();
    return () => {
      window.removeEventListener(productStoreEventName(), refreshProducts);
      window.removeEventListener("storage", refreshProducts);
      window.removeEventListener("focus", refreshProducts);
      document.removeEventListener("visibilitychange", refreshProducts);
    };
  }, []);

  const activeQuery = submittedQuery.trim().toLowerCase();
  const filteredProducts = activeQuery
    ? products.filter((product) =>
        [product.name, product.category, product.brand]
          .join(" ")
          .toLowerCase()
          .includes(activeQuery)
      )
    : products;

  return (
    <section className="space-y-6" id="products">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Shop FMCG products
          </p>
          <h2 className="mt-2">Premium Retail Products</h2>
        </div>
        <p className="max-w-xl text-sm leading-6">
          Search by product name, category, or brand and add fast-moving grocery,
          food, beverage, and home care items to your cart.
        </p>
      </div>

      <form
        className="grid gap-3 rounded-component border border-surface-border bg-surface-white p-3 shadow-soft md:grid-cols-[1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedQuery(query);
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-surface-muted" />
          <Input
            className="pl-9"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product name, category, or brand"
            value={query}
          />
        </div>
        <Button className="gap-2" type="submit">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard compact key={product.id} navigate={navigate} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-component border border-dashed border-surface-border bg-surface-white p-6 text-center">
          <p className="font-semibold text-surface-black">No products found.</p>
        </div>
      ) : null}
    </section>
  );
}
