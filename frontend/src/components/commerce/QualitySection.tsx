import { BadgeCheck, Headphones, MessageCircle, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { brand } from "@/config/brand";
import { getWhatsAppUrl } from "@/utils/contactLinks";

const categories = [
  {
    title: "Staples",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80"
  },
  {
    title: "Groceries",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"
  },
  {
    title: "Home Care",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=700&q=80"
  }
];

const points = [
  {
    icon: BadgeCheck,
    title: "Trusted Products",
    copy: "Curated FMCG products with clear pricing, stock, and brand information."
  },
  {
    icon: PackageCheck,
    title: "Order Visibility",
    copy: "Customer orders appear instantly in the admin dashboard with live status updates."
  },
  {
    icon: Truck,
    title: "Retail Focus",
    copy: "Built for repeat grocery baskets, wholesale ordering, and mobile-friendly checkout."
  }
];

export function QualitySection() {
  return (
    <>
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Product categories
          </p>
          <h2 className="mt-2">FMCG Essentials for Every Basket</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <div className="overflow-hidden rounded-component border border-surface-border bg-surface-white shadow-soft" key={category.title}>
              <img alt={category.title} className="h-48 w-full object-cover" src={category.image} />
              <div className="p-5">
                <h3 className="text-xl">{category.title}</h3>
                <p className="mt-2 text-sm leading-6">Premium stock for homes, shops, and bulk buyers.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-component border border-surface-border bg-surface-white p-6 shadow-soft lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            About {brand.name}
          </p>
          <h2 className="mt-2">Premium Retail Commerce for Daily Essentials</h2>
          <p className="mt-4 text-sm leading-7">
            {brand.name} supplies fast-moving consumer goods with a simple
            customer ordering experience and a clean admin workflow for products,
            orders, invoices, and customers.
          </p>
        </div>
        <img
          alt="Modern grocery retail aisle"
          className="h-72 w-full rounded-component object-cover"
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=82"
        />
      </section>

      <section className="space-y-6" id="why-choose-us">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Why choose us
          </p>
          <h2 className="mt-2">Built for Professional Retail Ordering</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div className="rounded-component border border-surface-border bg-surface-white p-5 shadow-soft" key={point.title}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-gold-pale">
                  <Icon className="h-5 w-5 text-gold-dark" />
                </div>
                <h3 className="text-xl">{point.title}</h3>
                <p className="mt-2 text-sm leading-6">{point.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-component border border-surface-border bg-surface-black p-6 text-surface-white shadow-soft">
        <div className="grid gap-5 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-secondary">
              Contact details
            </p>
            <h2 className="mt-2 text-surface-white">{brand.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="h-5 w-5 text-gold-secondary" />
            <span className="font-semibold">{brand.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-gold-secondary" />
            <span className="font-semibold">{brand.email}</span>
          </div>
          <a
            className="inline-flex h-11 items-center justify-center gap-2 rounded-component bg-gold-primary px-4 text-sm font-bold text-surface-black transition hover:bg-gold-secondary focus:outline-none focus-visible:shadow-focus"
            href={getWhatsAppUrl("Hello Xllent Retailers, I found your website and want to connect.")}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
