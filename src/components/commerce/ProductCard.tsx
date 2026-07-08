import { Check, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { brand } from "@/config/brand";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import type { Product } from "@/models/product";
import { addToCart } from "@/store/slices/cartSlice";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";

type ProductCardProps = {
  compact?: boolean;
  navigate: (path: string) => void;
  product: Product;
};

export function ProductCard({ compact = false, navigate, product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  return (
    <Card className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={cn(
          "relative bg-gradient-to-br",
          compact ? "h-28 sm:h-44" : "h-56 sm:h-64",
          product.colorClass
        )}
      >
        <img
          alt={product.name}
          className="h-full w-full object-contain p-3"
          loading="lazy"
          src={product.imageUrl}
        />
        <div className="absolute left-4 top-4 rounded-full bg-surface-white/92 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">
          {product.category}
        </div>
      </div>
      <CardContent className={cn(compact ? "space-y-2 p-2 sm:space-y-3 sm:p-3" : "space-y-5")}>
        <div className={cn("flex gap-4", compact ? "flex-col" : "items-start justify-between")}>
          <div>
            <h3 className={cn(compact ? "font-body text-sm sm:text-base" : "text-2xl")}>
              {product.name}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gold-dark">
              {product.brand}
            </p>
            <p
              className={cn(
                "mt-2 text-sm",
                compact ? "hidden leading-5 sm:line-clamp-2 sm:block" : "leading-6"
              )}
            >
              {product.shortDescription}
            </p>
          </div>
          <div className={cn(compact ? "text-left" : "text-right")}>
            <div className={cn("font-bold text-surface-black", compact ? "text-base sm:text-lg" : "text-xl")}>
              {formatCurrency(product.price)}
            </div>
            <div className={cn("text-surface-muted", compact ? "text-xs sm:text-sm" : "text-sm")}>Stock {product.stock}</div>
          </div>
        </div>

        <div className={cn("grid gap-2 text-sm text-surface-muted", compact && "hidden")}>
          {product.highlights.map((highlight) => (
            <div className="flex items-center gap-2" key={highlight}>
              <Check className="h-4 w-4 text-harvest-olive" />
              {highlight}
            </div>
          ))}
        </div>

        <div className={cn("grid gap-3", compact ? "grid-cols-2 gap-2" : "sm:grid-cols-2")}>
          <Button
            className="gap-2 px-2"
            onClick={() => dispatch(addToCart({ productId: product.id }))}
            size={compact ? "sm" : "md"}
            title="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className={cn(compact && "sr-only sm:not-sr-only")}>Add</span>
          </Button>
          <Button
            className="gap-2 px-2"
            onClick={() => navigate(`/products/${product.slug}`)}
            size={compact ? "sm" : "md"}
            title="View product details"
            variant="outline"
          >
            <Eye className="h-4 w-4" />
            <span className={cn(compact && "sr-only sm:not-sr-only")}>Details</span>
          </Button>
        </div>
        {!compact ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted">
            Supplied by {brand.name}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
