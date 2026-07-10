import { useEffect, useState } from "react";
import {
  Boxes,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  UserCheck
} from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { brand } from "@/config/brand";
import type { CustomerOrder, OrderStatus } from "@/models/order";
import type { Product } from "@/models/product";
import {
  accountStoreEventName,
  loadAccounts,
  loadManagedProducts,
  loadOrders,
  orderStoreEventName,
  saveManagedProducts,
  updateOrderStatus,
  type Account
} from "@/services/localStore";
import { cn } from "@/utils/cn";
import { SuperAdminDashboardPage } from "./super-admin/SuperAdminDashboardPage";
import { SuperAdminLoginPage } from "./super-admin/SuperAdminLoginPage";
import { SuperAdminOrdersPage } from "./super-admin/SuperAdminOrdersPage";
import { SuperAdminProductsPage } from "./super-admin/SuperAdminProductsPage";
import { SuperAdminUsersPage } from "./super-admin/SuperAdminUsersPage";
import {
  emptyProductForm,
  type ProductForm,
  type SuperAdminModule,
  type SuperAdminPageKey
} from "./super-admin/types";

type SuperAdminPageProps = {
  navigate: (path: string) => void;
};

const superAdminModules: SuperAdminModule[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Users", icon: UserCheck },
  { label: "Products", icon: Boxes },
  { label: "Orders", icon: PackageCheck }
];

const superAdminCredentials = {
  email: "superadmin@xllentretailers.com",
  password: "super123"
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function SuperAdminPage({ navigate }: SuperAdminPageProps) {
  const [isSuperAdminLoggedIn, setIsSuperAdminLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activePage, setActivePage] = useState<SuperAdminPageKey>("Dashboard");
  const [query, setQuery] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(() => loadAccounts());
  const [products, setProducts] = useState<Product[]>(() => loadManagedProducts());
  const [orders, setOrders] = useState<CustomerOrder[]>(() => loadOrders());
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    const refreshAccounts = () => setAccounts(loadAccounts());
    const refreshOrders = () => setOrders(loadOrders());
    window.addEventListener(accountStoreEventName(), refreshAccounts);
    window.addEventListener(orderStoreEventName(), refreshOrders);
    window.addEventListener("storage", refreshAccounts);
    window.addEventListener("storage", refreshOrders);
    return () => {
      window.removeEventListener(accountStoreEventName(), refreshAccounts);
      window.removeEventListener(orderStoreEventName(), refreshOrders);
      window.removeEventListener("storage", refreshAccounts);
      window.removeEventListener("storage", refreshOrders);
    };
  }, []);

  const handleLogin = (email: string, password: string) => {
    if (email === superAdminCredentials.email && password === superAdminCredentials.password) {
      setIsSuperAdminLoggedIn(true);
      setLoginError("");
      return;
    }

    setLoginError("Invalid super admin email or password.");
  };

  const updateForm = (key: keyof ProductForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const persistProducts = (nextProducts: Product[]) => {
    setProducts(nextProducts);
    saveManagedProducts(nextProducts);
  };

  const resetForm = () => {
    setForm(emptyProductForm);
    setEditingId(null);
  };

  const submitProduct = () => {
    const slug = slugify(form.name);
    const wholesalerPrice = Number(form.wholesalerPrice || 0);
    const product: Product = {
      id: editingId ?? slug,
      name: form.name,
      slug,
      category: form.category,
      brand: "Xllent",
      mrp: Number(form.mrp || 0),
      price: wholesalerPrice,
      adminPrice: Number(form.adminPrice || 0),
      superStockiestPrice: Number(form.superStockiestPrice || 0),
      distributorsPrice: Number(form.distributorsPrice || 0),
      wholesalerPrice,
      stock: editingId ? products.find((item) => item.id === editingId)?.stock ?? 0 : 0,
      shortDescription: form.description.slice(0, 120),
      description: form.description,
      imageUrl:
        form.imageUrl ||
        "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80",
      colorClass: "from-gold-secondary/20 to-harvest-cream",
      highlights: [form.category, "Xllent", "Retail ready"].filter(Boolean),
      bestFor: ["Customer orders", "Retail shelves", "Wholesale supply"]
    };

    persistProducts(
      editingId
        ? products.map((item) => (item.id === editingId ? product : item))
        : [product, ...products]
    );
    resetForm();
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      mrp: String(product.mrp ?? product.price),
      adminPrice: String(product.adminPrice ?? product.price),
      superStockiestPrice: String(product.superStockiestPrice ?? product.price),
      distributorsPrice: String(product.distributorsPrice ?? product.price),
      wholesalerPrice: String(product.wholesalerPrice ?? product.price),
      imageUrl: product.imageUrl,
      description: product.description
    });
    setActivePage("Products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = (productId: string) => {
    persistProducts(products.filter((product) => product.id !== productId));
    if (editingId === productId) {
      resetForm();
    }
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders(updateOrderStatus(orderId, status));
  };

  if (!isSuperAdminLoggedIn) {
    return <SuperAdminLoginPage loginError={loginError} onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-[#f7f9f2] text-surface-black">
      <Seo
        description="Xllent Retailers super admin panel for dashboard, products, orders, invoices, and customers."
        path="/super-admin"
        title="Super Admin Panel"
      />
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-surface-border bg-surface-white p-4 lg:border-b-0 lg:border-r">
          <button className="mb-6 flex items-center gap-3 text-left" onClick={() => navigate("/home")} type="button">
            <img alt={`${brand.name} logo`} className="h-12 w-12 object-contain" src={brand.logo} />
            <div>
              <div className="text-lg font-bold">{brand.name}</div>
              <div className="text-sm text-surface-muted">Super Admin workspace</div>
            </div>
          </button>
          <nav className="grid gap-1">
            {superAdminModules.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-component px-3 text-left text-sm font-semibold transition",
                    activePage === item.label
                      ? "bg-surface-black text-surface-white"
                      : "text-surface-muted hover:bg-[#edf4e4] hover:text-surface-black"
                  )}
                  key={item.label}
                  onClick={() => setActivePage(item.label)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="p-5 md:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-harvest-olive">
                {brand.name}
              </p>
              <h1 className="mt-2">{activePage}</h1>
            </div>
            <Button className="gap-2" onClick={() => navigate("/")} variant="outline">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {activePage === "Dashboard" ? (
            <SuperAdminDashboardPage
              orders={orders}
              productCount={products.length}
              userCount={accounts.length}
            />
          ) : null}

          {activePage === "Users" ? <SuperAdminUsersPage accounts={accounts} /> : null}

          {activePage === "Products" ? (
            <SuperAdminProductsPage
              editingId={editingId}
              form={form}
              onDeleteProduct={deleteProduct}
              onEditProduct={editProduct}
              onQueryChange={setQuery}
              onResetForm={resetForm}
              onSubmitProduct={submitProduct}
              onUpdateForm={updateForm}
              products={products}
              query={query}
            />
          ) : null}

          {activePage === "Orders" ? (
            <SuperAdminOrdersPage
              onSelectInvoice={setSelectedInvoiceId}
              onStatusChange={handleStatusChange}
              orders={orders}
              selectedInvoiceId={selectedInvoiceId}
            />
          ) : null}

        </section>
      </div>
    </main>
  );
}
