import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Boxes,
  Download,
  Edit3,
  Eye,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  Users
} from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
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
import { formatCurrency } from "@/utils/formatCurrency";

type AdminPageProps = {
  navigate: (path: string) => void;
};

type AdminModule = "Dashboard" | "Products" | "Orders" | "Customers";

type ProductForm = {
  name: string;
  category: string;
  brand: string;
  price: string;
  stock: string;
  imageUrl: string;
  description: string;
};

const modules: Array<{ label: AdminModule; icon: typeof LayoutDashboard }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Products", icon: Boxes },
  { label: "Orders", icon: PackageCheck },
  { label: "Customers", icon: Users }
];

const adminCredentials = {
  email: "admin@xllentretailers.com",
  password: "admin123"
};

const emptyForm: ProductForm = {
  name: "",
  category: "",
  brand: "",
  price: "",
  stock: "",
  imageUrl: "",
  description: ""
};

const statusOptions: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Delivered", "Cancelled"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createInvoicePdf(order: CustomerOrder) {
  const lines = [
    brand.name,
    `Phone: ${brand.phone}`,
    `Email: ${brand.email}`,
    `Invoice: ${order.id}`,
    `Order Date: ${new Date(order.orderDate).toLocaleString()}`,
    "------------------------------------------------",
    "Customer Details",
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Address: ${order.customer.address}`,
    "------------------------------------------------",
    "Order Details",
    ...order.items.map(
      (item) =>
        `${item.productName} | Qty ${item.quantity} | Price INR ${item.price} | Total INR ${item.total}`
    ),
    `Total Amount: INR ${order.total.toLocaleString("en-IN")}`,
    `Status: ${order.status}`,
    "------------------------------------------------",
    `Thank you for choosing ${brand.name}.`
  ];
  const content = [
    "BT",
    "/F1 22 Tf",
    "72 760 Td",
    `(${escapePdfText(lines[0])}) Tj`,
    "/F1 10 Tf",
    ...lines.slice(1).map((line) => `0 -22 Td (${escapePdfText(line)}) Tj`),
    "ET"
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];
  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(header.length + body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = header.length + body.length;
  const xref = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF"
  ].join("\n");

  return `${header}${body}${xref}`;
}

function MiniChart({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-44 items-end gap-2 rounded-component border border-surface-border bg-[#fbfcf7] p-4">
      {values.map((value, index) => (
        <div className="flex flex-1 flex-col items-center gap-2" key={`${value}-${index}`}>
          <div
            className={cn("w-full rounded-t-component", color)}
            style={{ height: `${Math.max(18, (value / max) * 132)}px` }}
          />
          <span className="text-xs font-semibold text-surface-muted">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function AdminPage({ navigate }: AdminPageProps) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeModule, setActiveModule] = useState<AdminModule>("Dashboard");
  const [query, setQuery] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(() => loadAccounts());
  const [products, setProducts] = useState<Product[]>(() => loadManagedProducts());
  const [orders, setOrders] = useState<CustomerOrder[]>(() => loadOrders());
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        [product.name, product.category, product.brand]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ),
    [products, query]
  );

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const stats = [
    { label: "Total Products", value: String(products.length), note: "Managed products" },
    { label: "Total Customers", value: String(accounts.length), note: "Registered customers" },
    { label: "Total Orders", value: String(orders.length), note: "Customer orders" },
    { label: "Revenue", value: formatCurrency(totalRevenue), note: "Order total" }
  ];

  const updateForm = (key: keyof ProductForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const persistProducts = (nextProducts: Product[]) => {
    setProducts(nextProducts);
    saveManagedProducts(nextProducts);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitProduct = () => {
    const slug = slugify(form.name);
    const product: Product = {
      id: editingId ?? slug,
      name: form.name,
      slug,
      category: form.category,
      brand: form.brand,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      shortDescription: form.description.slice(0, 120),
      description: form.description,
      imageUrl:
        form.imageUrl ||
        "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80",
      colorClass: "from-gold-secondary/20 to-harvest-cream",
      highlights: [form.category, form.brand, "Retail ready"].filter(Boolean),
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
      brand: product.brand,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      description: product.description
    });
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

  const downloadInvoice = (order: CustomerOrder) => {
    const invoice = createInvoicePdf(order);
    const blob = new Blob([invoice], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${order.id}-invoice.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateForm("imageUrl", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  if (!isAdminLoggedIn) {
    return (
      <main className="min-h-screen bg-[#f7f9f2] text-surface-black">
        <Seo
          description="Xllent Retailers admin login for product, order, and customer management."
          path="/admin"
          title="Admin Login"
        />
        <section className="flex min-h-screen items-center justify-center px-5 py-8">
          <div className="w-full max-w-md rounded-component border border-surface-border bg-surface-white p-6 shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <img
                alt={`${brand.name} logo`}
                className="h-14 w-14 rounded-component object-contain"
                src={brand.logo}
              />
              <div>
                <h1 className="text-3xl">Admin Login</h1>
                <p className="text-sm">{brand.email}</p>
              </div>
            </div>
            <form
              className="mt-5 grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const email = String(formData.get("email") ?? "");
                const password = String(formData.get("password") ?? "");

                if (email === adminCredentials.email && password === adminCredentials.password) {
                  setIsAdminLoggedIn(true);
                  setLoginError("");
                  return;
                }

                setLoginError("Invalid admin email or password.");
              }}
            >
              <Input required name="email" placeholder="admin@xllentretailers.com" type="email" />
              <Input required name="password" placeholder="admin123" type="password" />
              {loginError ? (
                <div className="rounded-component border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {loginError}
                </div>
              ) : null}
              <Button className="gap-2" type="submit" variant="secondary">
                <LockKeyhole className="h-4 w-4" />
                Open Admin
              </Button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const selectedInvoice = orders.find((order) => order.id === selectedInvoiceId);

  return (
    <main className="min-h-screen bg-[#f7f9f2] text-surface-black">
      <Seo
        description="Xllent Retailers admin panel for dashboard, products, orders, invoices, and customers."
        path="/admin"
        title="Admin Panel"
      />
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-surface-border bg-surface-white p-4 lg:border-b-0 lg:border-r">
          <button className="mb-6 flex items-center gap-3 text-left" onClick={() => navigate("/home")} type="button">
            <img alt={`${brand.name} logo`} className="h-12 w-12 object-contain" src={brand.logo} />
            <div>
              <div className="text-lg font-bold">{brand.name}</div>
              <div className="text-sm text-surface-muted">Admin workspace</div>
            </div>
          </button>
          <nav className="grid gap-1">
            {modules.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-component px-3 text-left text-sm font-semibold transition",
                    activeModule === item.label
                      ? "bg-surface-black text-surface-white"
                      : "text-surface-muted hover:bg-[#edf4e4] hover:text-surface-black"
                  )}
                  key={item.label}
                  onClick={() => setActiveModule(item.label)}
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
              <h1 className="mt-2">{activeModule}</h1>
            </div>
            <Button className="gap-2" onClick={() => navigate("/")} variant="outline">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {activeModule === "Dashboard" ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.label}>
                    <CardContent>
                      <p className="text-sm font-semibold text-surface-muted">{stat.label}</p>
                      <div className="mt-2 text-3xl font-bold">{stat.value}</div>
                      <p className="mt-1 text-sm">{stat.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Revenue Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MiniChart color="bg-gold-primary" values={[12, 20, 18, 31, orders.length * 8 + 12, 44, 38]} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PackageCheck className="h-5 w-5" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div className="flex justify-between gap-3 rounded-component border border-surface-border p-3" key={order.id}>
                        <div>
                          <div className="font-bold">{order.customer.name}</div>
                          <p className="text-sm">{order.id} / {order.status}</p>
                        </div>
                        <strong>{formatCurrency(order.total)}</strong>
                      </div>
                    ))}
                    {orders.length === 0 ? <p>No recent orders yet.</p> : null}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}

          {activeModule === "Products" ? (
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>{editingId ? "Update Product" : "Add Product"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitProduct();
                    }}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input required placeholder="Product Name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
                      <Input required placeholder="Category" value={form.category} onChange={(event) => updateForm("category", event.target.value)} />
                      <Input required placeholder="Brand" value={form.brand} onChange={(event) => updateForm("brand", event.target.value)} />
                      <Input required placeholder="Price" type="number" value={form.price} onChange={(event) => updateForm("price", event.target.value)} />
                      <Input required placeholder="Stock" type="number" value={form.stock} onChange={(event) => updateForm("stock", event.target.value)} />
                      <Input placeholder="Image URL" value={form.imageUrl} onChange={(event) => updateForm("imageUrl", event.target.value)} />
                    </div>
                    <Textarea required placeholder="Description" value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
                    {form.imageUrl ? (
                      <div className="flex max-h-[60vh] w-full items-center justify-center overflow-hidden rounded-component border border-surface-border bg-[#fbfcf7] p-3">
                        <img alt="Product preview" className="max-h-[56vh] w-full object-contain" src={form.imageUrl} />
                      </div>
                    ) : null}
                    <input
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleImageUpload(event.target.files?.[0])}
                      ref={fileInputRef}
                      type="file"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button className="gap-2" type="submit">
                        {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {editingId ? "Update Product" : "Add Product"}
                      </Button>
                      <Button className="gap-2" onClick={() => fileInputRef.current?.click()} type="button" variant="outline">
                        <Upload className="h-4 w-4" />
                        Image Upload
                      </Button>
                      {editingId ? (
                        <Button onClick={resetForm} type="button" variant="ghost">
                          Cancel Edit
                        </Button>
                      ) : null}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-surface-muted" />
                <Input className="pl-9" onChange={(event) => setQuery(event.target.value)} placeholder="Search product, category, brand" value={query} />
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Card className="overflow-hidden" key={product.id}>
                    <div className="flex h-32 items-center justify-center bg-[#fbfcf7] p-2 sm:h-44 md:h-52">
                      <img alt={product.name} className="h-full w-full object-contain" loading="lazy" src={product.imageUrl} />
                    </div>
                    <CardContent className="p-3 sm:p-5">
                      <h3 className="text-base sm:text-xl">{product.name}</h3>
                      <p className="mt-1 text-sm">{product.category} / {product.brand}</p>
                      <div className="mt-3 text-sm font-bold sm:text-base">{formatCurrency(product.price)} / Stock {product.stock}</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button className="gap-2" onClick={() => editProduct(product)} size="sm" variant="outline">
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button className="gap-2" onClick={() => deleteProduct(product.id)} size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {activeModule === "Orders" ? (
            <Card>
              <CardHeader>
                <CardTitle>Admin Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedInvoice ? (
                  <div className="overflow-hidden rounded-component border border-gold-primary bg-surface-white shadow-soft">
                    <div className="flex flex-col justify-between gap-4 bg-surface-black p-5 text-surface-white md:flex-row md:items-start">
                      <div className="flex items-center gap-3">
                        <img alt={`${brand.name} logo`} className="h-14 w-14 rounded-component bg-white object-contain" src={brand.logo} />
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-secondary">
                            {brand.name}
                          </div>
                          <h3 className="mt-1 text-3xl text-surface-white">Tax Invoice</h3>
                          <p className="text-sm text-white/75">{brand.phone} / {brand.email}</p>
                        </div>
                      </div>
                      <div className="text-left text-sm md:text-right">
                        <div className="font-bold">Invoice {selectedInvoice.id}</div>
                        <div className="mt-1 text-white/75">{new Date(selectedInvoice.orderDate).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="grid gap-5 p-5">
                      <div className="grid gap-4 rounded-component border border-surface-border bg-[#fbfcf7] p-4 md:grid-cols-2">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-[0.16em] text-surface-muted">Customer Details</div>
                          <div className="mt-2 font-bold">{selectedInvoice.customer.name}</div>
                          <p className="text-sm">{selectedInvoice.customer.phone}</p>
                          <p className="text-sm">{selectedInvoice.customer.email}</p>
                          <p className="text-sm">{selectedInvoice.customer.address}</p>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-[0.16em] text-surface-muted">Company Details</div>
                          <div className="mt-2 font-bold">{brand.name}</div>
                          <p className="text-sm">{brand.phone}</p>
                          <p className="text-sm">{brand.email}</p>
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-component border border-surface-border">
                        <div className="grid grid-cols-[1fr_80px_110px_120px] bg-gold-pale px-4 py-3 text-sm font-bold">
                          <span>Product</span>
                          <span>Qty</span>
                          <span>Price</span>
                          <span className="text-right">Total</span>
                        </div>
                        {selectedInvoice.items.map((item) => (
                          <div className="grid grid-cols-[1fr_80px_110px_120px] px-4 py-4 text-sm" key={item.productId}>
                            <span>{item.productName}</span>
                            <span>{item.quantity}</span>
                            <span>{formatCurrency(item.price)}</span>
                            <span className="text-right">{formatCurrency(item.total)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="ml-auto w-full max-w-sm rounded-component border border-surface-border p-4 text-sm">
                        <div className="flex justify-between text-lg">
                          <span>Total Amount</span>
                          <strong>{formatCurrency(selectedInvoice.total)}</strong>
                        </div>
                      </div>
                      <Button className="gap-2" onClick={() => downloadInvoice(selectedInvoice)}>
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ) : null}

                {orders.length === 0 ? <p>No customer orders yet.</p> : null}
                {orders.map((order) => (
                  <div className="grid gap-3 rounded-component border border-surface-border p-4 xl:grid-cols-[1fr_1fr_150px_240px]" key={order.id}>
                    <div>
                      <div className="font-bold">{order.id}</div>
                      <p className="text-sm">{order.customer.name}</p>
                      <p className="text-sm">{order.customer.phone}</p>
                      <p className="text-sm">{order.customer.email}</p>
                      <p className="text-sm">{order.customer.address}</p>
                    </div>
                    <div className="text-sm">
                      <div className="font-bold">Ordered Products</div>
                      {order.items.map((item) => (
                        <div key={item.productId}>
                          {item.productName} / Qty {item.quantity}
                        </div>
                      ))}
                      <div className="mt-2 font-bold">{formatCurrency(order.total)}</div>
                      <div>{new Date(order.orderDate).toLocaleString()}</div>
                    </div>
                    <select
                      className="h-10 rounded-component border border-surface-border bg-surface-white px-3 text-sm"
                      onChange={(event) => handleStatusChange(order.id, event.target.value as OrderStatus)}
                      value={order.status}
                    >
                      {statusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                      <Button className="gap-2" onClick={() => setSelectedInvoiceId(order.id)} size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                        View Invoice
                      </Button>
                      <Button className="gap-2" onClick={() => downloadInvoice(order)} size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {activeModule === "Customers" ? (
            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {accounts.length === 0 ? (
                  <p>No customer accounts created yet.</p>
                ) : (
                  accounts.map((account) => (
                    <div className="grid gap-3 rounded-component border border-surface-border p-4 md:grid-cols-[1fr_1fr_1fr_160px]" key={account.id}>
                      <strong>{account.name}</strong>
                      <span>{account.phone}</span>
                      <span>{account.email}</span>
                      <span>{new Date(account.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ) : null}
        </section>
      </div>
    </main>
  );
}
