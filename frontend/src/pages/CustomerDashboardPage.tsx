import { useEffect, useState } from "react";
import { Clock, PackageCheck, ShoppingCart, UserRound } from "lucide-react";
import { CartSummary } from "@/components/commerce/CartSummary";
import { Seo } from "@/components/seo/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { brand } from "@/config/brand";
import { useAppSelector } from "@/hooks/useAppSelector";
import { loadCurrentCustomer, loadOrders, orderStoreEventName } from "@/services/localStore";
import { formatCurrency } from "@/utils/formatCurrency";

type PageProps = {
  navigate: (path: string) => void;
};

export function CustomerDashboardPage({ navigate }: PageProps) {
  const customer = loadCurrentCustomer();
  const [allOrders, setAllOrders] = useState(() => loadOrders());

  useEffect(() => {
    const refreshOrders = () => setAllOrders(loadOrders());
    window.addEventListener(orderStoreEventName(), refreshOrders);
    window.addEventListener("storage", refreshOrders);
    return () => {
      window.removeEventListener(orderStoreEventName(), refreshOrders);
      window.removeEventListener("storage", refreshOrders);
    };
  }, []);

  const orders = allOrders.filter((order) => {
    if (!customer) {
      return true;
    }
    return (
      (!!customer.email && order.customer.email === customer.email) ||
      (!!customer.phone && order.customer.phone === customer.phone)
    );
  });
  const cartCount = useAppSelector((state) =>
    state.cart.lines.reduce((total, line) => total + line.quantity, 0)
  );

  return (
    <div className="space-y-8 pb-12">
      <Seo
        description="Xllent Retailers customer dashboard with profile, cart, orders, order history, and status."
        path="/dashboard"
        title="Customer Dashboard"
      />
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Customer dashboard
          </p>
          <h1 className="mt-2">My Account</h1>
        </div>
        <div className="rounded-component border border-surface-border bg-surface-white px-4 py-3 text-sm font-semibold shadow-soft">
          {brand.phone} / {brand.email}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3">
            <UserRound className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-sm font-semibold text-surface-muted">Profile</p>
              <div className="font-bold text-surface-black">
                {customer?.name ?? "Guest Customer"}
              </div>
              <div className="text-sm text-surface-muted">{customer?.email || customer?.phone}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <PackageCheck className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-sm font-semibold text-surface-muted">My Orders</p>
              <div className="font-bold text-surface-black">{orders.length}</div>
              <div className="text-sm text-surface-muted">Stored demo orders</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-sm font-semibold text-surface-muted">Cart</p>
              <div className="font-bold text-surface-black">{cartCount} items</div>
              <div className="text-sm text-surface-muted">Ready for checkout</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Order History & Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            orders.map((order) => (
              <div
                className="grid gap-3 rounded-component border border-surface-border p-4 lg:grid-cols-[1fr_130px_150px]"
                key={order.id}
              >
                <div>
                  <div className="font-bold text-surface-black">{order.id}</div>
                  <p className="text-sm">
                    {order.items.map((item) => `${item.productName} x ${item.quantity}`).join(", ")}
                  </p>
                  <p className="text-xs font-semibold text-surface-muted">
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                </div>
                <div className="font-bold text-surface-black">{formatCurrency(order.total)}</div>
                <div className="rounded-component bg-gold-pale px-3 py-2 text-center text-sm font-bold text-surface-black">
                  {order.status}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <CartSummary navigate={navigate} />
    </div>
  );
}
