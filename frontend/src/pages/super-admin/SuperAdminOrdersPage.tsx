import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { brand } from "@/config/brand";
import type { CustomerOrder, OrderStatus } from "@/models/order";
import { formatCurrency } from "@/utils/formatCurrency";

type SuperAdminOrdersPageProps = {
  orders: CustomerOrder[];
  selectedInvoiceId: string | null;
  onSelectInvoice: (orderId: string) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
};

const statusOptions: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Delivered", "Cancelled"];

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

function downloadInvoice(order: CustomerOrder) {
  const invoice = createInvoicePdf(order);
  const blob = new Blob([invoice], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${order.id}-invoice.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export function SuperAdminOrdersPage({
  orders,
  selectedInvoiceId,
  onSelectInvoice,
  onStatusChange
}: SuperAdminOrdersPageProps) {
  const selectedInvoice = orders.find((order) => order.id === selectedInvoiceId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Super Admin Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedInvoice ? (
          <div className="overflow-hidden rounded-component border border-gold-primary bg-surface-white shadow-soft">
            <div className="flex flex-col justify-between gap-4 bg-surface-black p-5 text-surface-white md:flex-row md:items-start">
              <div className="flex items-center gap-3">
                <img alt={`${brand.name} logo`} className="h-20 w-20 rounded-component bg-white object-contain" src={brand.logo} />
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
              onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}
              value={order.status}
            >
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              <Button className="gap-2" onClick={() => onSelectInvoice(order.id)} size="sm" variant="outline">
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
  );
}
