import { MessageCircle, PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { brand } from "@/config/brand";
import { getWhatsAppUrl } from "@/utils/contactLinks";

type HeroSectionProps = {
  navigate: (path: string) => void;
};

const metrics = [
  { label: "FMCG categories", value: "6+" },
  { label: "Retail supply", value: "Fast" },
  { label: "Orders", value: "Live" }
];

export function HeroSection({ navigate }: HeroSectionProps) {
  return (
    <section className="oil-sheen grid min-h-[620px] gap-10 overflow-hidden rounded-component border border-surface-border p-6 md:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Premium retail essentials
          </p>
          <h1 className="max-w-3xl">{brand.name}</h1>
          <p className="max-w-2xl text-lg leading-8">
            Shop trusted FMCG products across grocery, staples, snacks,
            beverages, home care, and everyday essentials with a polished retail
            ordering experience.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" onClick={() => navigate("/products")} size="lg">
            <ShoppingBag className="h-5 w-5" />
            Shop Products
          </Button>
          <Button
            className="gap-2"
            onClick={() => document.getElementById("why-choose-us")?.scrollIntoView()}
            size="lg"
            variant="outline"
          >
            <ShieldCheck className="h-5 w-5" />
            Why Choose Us
          </Button>
          <a
            className="inline-flex h-12 items-center justify-center gap-2 rounded-component border border-gold-primary bg-surface-white px-6 text-base font-semibold text-surface-black transition hover:bg-gold-pale focus:outline-none focus-visible:shadow-focus"
            href={getWhatsAppUrl("Hello Xllent Retailers, I want to place an order.")}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              className="rounded-component border border-surface-border bg-surface-white/75 p-4 shadow-soft"
              key={metric.label}
            >
              <div className="text-2xl font-bold text-surface-black">{metric.value}</div>
              <div className="text-sm text-surface-muted">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[420px] overflow-hidden rounded-component bg-surface-black">
        <img
          alt="Organized FMCG products on retail shelves"
          className="absolute inset-0 h-full w-full object-cover opacity-88"
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=85"
        />
        <div className="absolute inset-x-5 bottom-5 rounded-component border border-surface-white/20 bg-surface-black/88 p-5 shadow-soft backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-pale">
              <Truck className="h-5 w-5 text-gold-dark" />
            </div>
            <div>
              <div className="font-bold text-surface-white">Retail-ready FMCG supply</div>
              <div className="text-sm text-gold-pale">
                {brand.phone} / {brand.email}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-5 top-5 rounded-component bg-surface-white/92 p-3 shadow-soft">
          <PackageCheck className="h-6 w-6 text-gold-dark" />
        </div>
      </div>
    </section>
  );
}
