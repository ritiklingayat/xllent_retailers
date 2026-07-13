import { useMemo, useRef, type ReactNode } from "react";
import { Edit3, Plus, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import type { Product } from "@/models/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { productCategories, type ProductForm } from "./types";

type SuperAdminProductsPageProps = {
  editingId: string | null;
  form: ProductForm;
  products: Product[];
  categories?: { id: number; categoryName: string }[];
  query: string;
  onDeleteProduct: (productId: string) => void;
  onEditProduct: (product: Product) => void;
  onQueryChange: (query: string) => void;
  onResetForm: () => void;
  onSubmitProduct: () => void;
  onUpdateForm: (key: keyof ProductForm, value: string) => void;
};

function ProductField({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-surface-muted">
      {label}
      {children}
    </label>
  );
}

export function SuperAdminProductsPage({
  editingId,
  form,
  products,
  categories,
  query,
  onDeleteProduct,
  onEditProduct,
  onQueryChange,
  onResetForm,
  onSubmitProduct,
  onUpdateForm
}: SuperAdminProductsPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageUpload = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateForm("imageUrl", String(reader.result ?? ""));
      // also set the File object
      // @ts-ignore
      onUpdateForm("imageFile", file);
    };
    reader.readAsDataURL(file);
  };

  return (
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
              onSubmitProduct();
            }}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <ProductField label="Product Name">
                <Input required placeholder="Product Name" value={form.name} onChange={(event) => onUpdateForm("name", event.target.value)} />
              </ProductField>
              <ProductField label="Category">
                <select
                  className="h-11 rounded-component border border-surface-border bg-surface-white px-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus"
                  onChange={(event) => onUpdateForm("category", event.target.value)}
                  value={form.category}
                >
                  <option value="">Select category</option>
                  {categories && categories.length > 0
                    ? categories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                          {cat.categoryName}
                        </option>
                      ))
                    : productCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                </select>
              </ProductField>
              <ProductField label="MRP">
                <Input required min="0" placeholder="MRP" type="number" value={form.mrp} onChange={(event) => onUpdateForm("mrp", event.target.value)} />
              </ProductField>
              <ProductField label="Admin Price">
                <Input required min="0" placeholder="Admin Price" type="number" value={form.adminPrice} onChange={(event) => onUpdateForm("adminPrice", event.target.value)} />
              </ProductField>
              <ProductField label="Super Stockiest Price">
                <Input required min="0" placeholder="Super Stockiest Price" type="number" value={form.superStockiestPrice} onChange={(event) => onUpdateForm("superStockiestPrice", event.target.value)} />
              </ProductField>
              <ProductField label="Distributors Price">
                <Input required min="0" placeholder="Distributors Price" type="number" value={form.distributorsPrice} onChange={(event) => onUpdateForm("distributorsPrice", event.target.value)} />
              </ProductField>
              <ProductField label="Wholesaler Price">
                <Input required min="0" placeholder="Wholesaler Price" type="number" value={form.wholesalerPrice} onChange={(event) => onUpdateForm("wholesalerPrice", event.target.value)} />
              </ProductField>
              <ProductField label="Image Upload">
                <Button className="h-11 justify-center gap-2" onClick={() => fileInputRef.current?.click()} type="button" variant="outline">
                  <Upload className="h-4 w-4" />
                  Image Upload
                </Button>
              </ProductField>
            </div>
            <ProductField label="Description">
              <Textarea required placeholder="Description" value={form.description} onChange={(event) => onUpdateForm("description", event.target.value)} />
            </ProductField>
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
              {editingId ? (
                <Button onClick={onResetForm} type="button" variant="ghost">
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-surface-muted" />
        <Input className="pl-9" onChange={(event) => onQueryChange(event.target.value)} placeholder="Search product, category, brand" value={query} />
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
              <div className="mt-3 grid gap-1 text-xs font-semibold text-surface-muted sm:text-sm">
                <span>MRP: {formatCurrency(product.mrp ?? product.price)}</span>
                <span>Admin: {formatCurrency(product.adminPrice ?? product.price)}</span>
                <span>Super Stockiest: {formatCurrency(product.superStockiestPrice ?? product.price)}</span>
                <span>Distributor: {formatCurrency(product.distributorsPrice ?? product.price)}</span>
                <span>Wholesaler: {formatCurrency(product.wholesalerPrice ?? product.price)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="gap-2" onClick={() => onEditProduct(product)} size="sm" variant="outline">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <Button className="gap-2" onClick={() => onDeleteProduct(product.id)} size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
