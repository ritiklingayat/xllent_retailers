import { BarChart3, PackageCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { CustomerOrder } from "@/models/order";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";

type SuperAdminDashboardPageProps = {
  productCount: number;
  userCount: number;
  orders: CustomerOrder[];
};

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

export function SuperAdminDashboardPage({
  productCount,
  userCount,
  orders
}: SuperAdminDashboardPageProps) {
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const stats = [
    { label: "Total Products", value: String(productCount), note: "Managed products" },
    { label: "Total Users", value: String(userCount), note: "Created by Super Admin" },
    { label: "Total Orders", value: String(orders.length), note: "Customer orders" },
    { label: "Revenue", value: formatCurrency(totalRevenue), note: "Order total" }
  ];

  return (
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
  );
}
