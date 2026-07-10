import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Building2,
  Candy,
  ChartNoAxesCombined,
  LogIn,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Store,
  Truck
} 

from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { brand } from "@/config/brand";
import chikkiImage from "@/images/Chikki.webp";
import chipsImage from "@/images/Chipps.webp";
import chocolateImage from "@/images/Chocolate.webp";
import spicesImage from "@/images/Pickles.jfif";

type LandingPageProps = {
  navigate: (path: string) => void;
};

const categoryTiles = [
  {
    title: "Chocolate",
    image: chocolateImage
  },
  {
    title: "Candy & Lollipop",
    image: chipsImage
  },
  {
    title: "Chikki",
    image: chikkiImage
  },
  {
    title: "Spices & Snacks",
    image: spicesImage
  }
];

const strengths = [
  { icon: Store, title: "Retail-first supply", copy: "Built for shops, wholesalers, distributors, and fast-moving FMCG counters." },
  { icon: Boxes, title: "Category control", copy: "Products, prices, and images are managed from the Super Admin workspace." },
  { icon: Truck, title: "Order visibility", copy: "Orders, invoices, approvals, and revenue stay connected in one simple flow." }
];

const steps = [
  "Super Admin creates user ID and password",
  "Users login with issued credentials",
  "Orders and product prices stay centrally managed"
];

export function LandingPage({ navigate }: LandingPageProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7ed] text-surface-blue">
      <Seo
        description="Xllent Retailers supplies FMCG products with Super Admin controlled users, product pricing, orders, and retailer-ready categories."
        path="/"
        title="Xllent Retailers"
      />

      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/20 bg-surface-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <button className="flex items-center gap-3 text-left" onClick={() => navigate("/")} type="button">
            <img alt={`${brand.name} logo`} className="h-12 w-12 rounded-component bg-white object-contain" src={brand.logo} />
            <div>
              <div className="text-lg font-bold text-surface-white">{brand.name}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-secondary">Retail FMCG supply</div>
            </div>
          </button>
          <Button className="gap-2" onClick={() => navigate("/login")} variant="secondary">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>
      </header>

      <section className="relative min-h-screen pt-24">
        <img
          alt="Retail shelves filled with FMCG products"
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1800&q=85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/58 to-black/20" />
        <div className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_420px]">
          <div className="max-w-3xl animate-rise-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-secondary/40 bg-white/10 px-4 py-2 text-sm font-bold text-gold-secondary backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Super Admin controlled retail network
            </div>
            <h1 className="text-5xl font-semibold leading-tight text-surface-white md:text-7xl">
              Xllent Retailers
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-white/90">
              A clean FMCG ordering platform for wholesalers, distributors,
              super stockists, and retailers, with product pricing and user
              access managed from one Super Admin panel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="gap-2" onClick={() => navigate("/products")} size="lg">
                Explore Products
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button className="gap-2 bg-white/95" onClick={() => navigate("/login")} size="lg" variant="outline">
                Login With User ID
              </Button>
            </div>
          </div>

          <div className="animate-float-panel rounded-component border border-white/20 bg-white/92 p-5 shadow-soft backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-component bg-gold-pale">
                <ChartNoAxesCombined className="h-6 w-6 text-gold-dark" />
              </div>
              <div>
                <h2 className="text-2xl text-white">Business Control</h2>
                <p className="text-white">Products, users, pricing, orders, and revenue.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {steps.map((step, index) => (
                <div className="flex items-center gap-3 rounded-component border border-surface-border bg-[#fffaf0] p-3" key={step}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-black text-sm font-bold text-surface-white">
                    {index + 1}
                  </div>
                  <span className="text-sm font-semibold text-surface-black">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-12 md:grid-cols-3">
        {strengths.map((item) => {
          const Icon = item.icon;
          return (
            <div className="group rounded-component border border-surface-border bg-surface-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl" key={item.title}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-component bg-gold-pale text-gold-dark transition group-hover:bg-surface-black group-hover:text-surface-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3>{item.title}</h3>
              <p className="mt-2 text-sm leading-6">{item.copy}</p>
            </div>
          );
        })}
      </section>

      <section className="bg-surface-black py-16 text-surface-white" id="categories">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold-secondary">Retail categories</p>
              <h2 className="mt-2 text-surface-white">Products made for everyday shelves</h2>
            </div>
            <Button className="gap-2" onClick={() => navigate("/products")} variant="secondary">
              View Catalogue
              <PackageCheck className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryTiles.map((tile) => (
              <button
                className="group relative min-h-72 overflow-hidden rounded-component text-left"
                key={tile.title}
                onClick={() => navigate("/products")}
                type="button"
              >
                <img alt={tile.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" src={tile.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <Candy className="mb-3 h-6 w-6 text-gold-secondary" />
                  <h3 className="text-surface-white">{tile.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr]" id="system">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold-dark">Authority structure</p>
          <h2 className="mt-2">Built around Super Admin control</h2>
          <p className="mt-4">
            The Super Admin creates users, controls product categories, manages
            prices for every role, views revenue, approves orders, and edits the
            retail network from one panel.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {["Admin", "Super Stockist", "Distributor", "Wholesaler"].map((role) => (
            <div className="rounded-component border border-surface-border bg-surface-white p-5 shadow-soft" key={role}>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-gold-dark">
                <BadgeCheck className="h-4 w-4" />
                {role}
              </div>
              <p className="text-sm leading-6">
                Credentials are issued by Super Admin. Access is clean,
                controlled, and ready for role-wise pricing and order workflows.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#7b2d22] px-5 py-16" id="contact">
        <div className="absolute inset-0 opacity-20">
          <img
            alt="Retail store aisle"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1600&q=82"
          />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-6 rounded-component border border-white/20 bg-white/95 p-6 shadow-soft md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-component bg-gold-pale text-gold-dark">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h2>Ready for retail growth</h2>
              <p className="mt-2">
                Contact {brand.name} for FMCG product supply, order support, and
                retailer network management.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-surface-black">
                <span>{brand.phone}</span>
                <span>{brand.email}</span>
              </div>
            </div>
          </div>
          <Button className="gap-2" onClick={() => navigate("/login")} size="lg">
            Login
            <ShieldCheck className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </main>
  );
}
