import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Category } from "@/models/category";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "@/services/categoryService";

type CategoryForm = {
  id: number | null;
  categoryName: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
};

const emptyForm: CategoryForm = {
  id: null,
  categoryName: "",
  description: "",
  status: "ACTIVE"
};

export function SuperAdminCategoriesPage() {
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = <K extends keyof CategoryForm>(key: K, value: CategoryForm[K]) => {
    setForm((cur) => ({ ...cur, [key]: value } as CategoryForm));
  };

  const edit = (c: Category) => {
    setForm({ id: c.id, categoryName: c.categoryName, description: c.description ?? "", status: c.status });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      if (form.id) {
        await updateCategory(form.id, { categoryName: form.categoryName, description: form.description, status: form.status });
        setMessage("Category updated successfully.");
      } else {
        await createCategory({ categoryName: form.categoryName, description: form.description, status: form.status });
        setMessage("Category added successfully.");
      }
      setForm(emptyForm);
      await load();
      window.dispatchEvent(new Event("categories:updated"));
} catch (err: any) {
      console.error(err);
      setMessage(err?.message ?? "Unable to save category. Please try again.");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    setMessage("Category deleted successfully.");
    window.dispatchEvent(new Event("categories:updated"));
    await load();
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">{form.id ? "Edit Category" : "Create Category"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={submit}>
            <div className="grid gap-3 md:grid-cols-2">
              <Input required placeholder="Category name" value={form.categoryName} onChange={(e) => updateForm("categoryName", e.target.value)} />
              <select className="h-11 rounded-component border border-surface-border bg-surface-white px-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus" value={form.status} onChange={(e) => updateForm("status", e.target.value as CategoryForm["status"])}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <Input placeholder="Description" value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="gap-2" type="submit">
                <Plus className="h-4 w-4" />
                {form.id ? "Update" : "Create"}
              </Button>
              {form.id ? (
                <Button type="button" variant="ghost" onClick={() => setForm(emptyForm)}>
                  Cancel
                </Button>
              ) : null}
            </div>
            {message ? <div className="mt-3 rounded-component border border-gold-primary/30 bg-gold-pale px-3 py-2 text-sm font-semibold text-gold-dark">{message}</div> : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {loading ? (
            <div>Loading...</div>
          ) : categories.length === 0 ? (
            <p>No categories yet.</p>
          ) : (
            categories.map((c) => (
              <div className="grid gap-3 rounded-component border border-surface-border p-4 xl:grid-cols-[1fr_150px_190px]" key={c.id}>
                <div>
                  <strong>{c.categoryName}</strong>
                  <p className="text-sm text-surface-muted">{c.description}</p>
                </div>
                <span className="h-fit rounded-component bg-gold-pale px-3 py-2 text-sm font-bold text-gold-dark">{c.status}</span>
                <div className="flex flex-wrap gap-2">
                  <Button className="gap-2" onClick={() => edit(c)} size="sm" variant="outline">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button className="gap-2" onClick={() => remove(c.id)} size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
