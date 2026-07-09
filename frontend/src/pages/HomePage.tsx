import { CartSummary } from "@/components/commerce/CartSummary";
import { HeroSection } from "@/components/commerce/HeroSection";
import { ProductCatalog } from "@/components/commerce/ProductCatalog";
import { QualitySection } from "@/components/commerce/QualitySection";
import { Seo } from "@/components/seo/Seo";

type PageProps = {
  navigate: (path: string) => void;
};

export function HomePage({ navigate }: PageProps) {
  return (
<div className="space-y-12 bg-gradient-to-br from-blue-50 via-white to-cyan-100">
  
        <Seo
        description="Shop Xllent Retailers FMCG products with categories, featured products, cart, checkout, and order dashboard."
        path="/home"
        title="Premium FMCG Retail"
      />
      <HeroSection navigate={navigate} />
      <ProductCatalog navigate={navigate} />
      <QualitySection />
      <CartSummary navigate={navigate} />
    </div>
  );
}
