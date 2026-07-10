import { ProductCatalog } from "@/components/commerce/ProductCatalog";
import { Seo } from "@/components/seo/Seo";

type PageProps = {
  navigate: (path: string) => void;
};

export function ProductsPage({ navigate }: PageProps) {
  return (
    <div className="space-y-8 pb-12">
      <Seo
        description="Browse Xllent Retailers FMCG products by name, category, and brand."
        path="/products"
        title="Products"
      />
      
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
          Catalog
        </p>
        <h1 className="mt-2">Xllent Retailers Products</h1>
      </div>
      <ProductCatalog navigate={navigate} viewOnly />
    </div>
  );
}
