import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Seo } from "@/components/seo/Seo";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loadManagedProducts } from "@/services/localStore";
import { addToCart } from "@/store/slices/cartSlice";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";

type ProductDetailsPageProps = {
  navigate: (path: string) => void;
  slug: string;
};

export function ProductDetailsPage({ navigate, slug }: ProductDetailsPageProps) {
  const dispatch = useAppDispatch();
  const product = loadManagedProducts().find((item) => item.slug === slug);


  if (!product) {
    return (
      <div className="pb-12">
        <h1>Product not found</h1>
        <p className="mt-3 max-w-xl">
          This product is not available in the Xllent Retailers catalog.
        </p>
        <Button className="mt-6" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 pb-12 lg:grid-cols-[0.95fr_1.05fr]">
      <Seo
        description={product.shortDescription}
        image={product.imageUrl.startsWith("http") ? product.imageUrl : undefined}
        path={`/products/${product.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          brand: product.brand,
          category: product.category,
          description: product.description,
          image: product.imageUrl,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability:
              product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }}
        title={product.name}
      />
      <div className={cn("flex min-h-[320px] max-h-[70vh] items-center justify-center overflow-hidden rounded-component bg-gradient-to-br p-4 sm:min-h-[420px]", product.colorClass)}>
        <img
          alt={product.name}
          className="max-h-[66vh] w-full object-contain"
          loading="lazy"
          src={product.imageUrl}
        />
        
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Product details
          </p>
          <h1 className="mt-2">{product.name}</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-gold-dark">
            {product.brand} / {product.category}
          </p>
          <p className="mt-4 text-lg leading-8">{product.description}</p>
        </div>

        <Card>
          <CardContent className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-sm text-surface-muted">Available stock</div>
                <div className="text-2xl font-bold text-surface-black">{product.stock}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-surface-black">
                  {formatCurrency(product.price)}
                </div>
                <div className="text-sm text-surface-muted">Unit price</div>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-surface-muted">
              {[...product.highlights, ...product.bestFor].map((item) => (
                <div className="flex items-center gap-2" key={item}>
                  <Check className="h-4 w-4 text-harvest-olive" />
                  {item}
                </div>
              ))}
            </div>

            <Button
              className="w-full gap-2"
              onClick={() => dispatch(addToCart({ productId: product.id }))}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
