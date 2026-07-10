import { useState } from "react";
import { Edit3, Plus, Trash2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  deleteAccount,
  saveAccount,
  type Account,
  type UserRole,
  type UserStatus
} from "@/services/localStore";

type SuperAdminUsersPageProps = {
  accounts: Account[];
};

type UserForm = {
  id: string | null;
  name: string;
  userId: string;
  password: string;
  role: UserRole;
  brand: string;
  status: UserStatus;
  phone: string;
  email: string;
};

const roleOptions: UserRole[] = [
  "Admin",
  "Super Stockist",
  "Distributor",
  "Wholesaler",
  "Customer"
];

const statusOptions: UserStatus[] = ["Active", "Inactive"];

const authorityByRole: Record<UserRole, string> = {
  Admin: "Create and support user credentials as assigned by Super Admin.",
  "Super Stockist": "Access stockist-level product and price coordination.",
  Distributor: "Access distributor-level product pricing and order flow.",
  Wholesaler: "Login, shop products, and place wholesale orders.",
  Customer: "Login, shop products, and track orders."
};

const emptyUserForm: UserForm = {
  id: null,
  name: "",
  userId: "",
  password: "",
  role: "Customer",
  brand: "",
  status: "Active",
  phone: "",
  email: ""
};

export function SuperAdminUsersPage({ accounts }: SuperAdminUsersPageProps) {
  const [form, setForm] = useState<UserForm>(emptyUserForm);

  const updateForm = (key: keyof UserForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => setForm(emptyUserForm);

  const editAccount = (account: Account) => {
    setForm({
      id: account.id,
      name: account.name,
      userId: account.userId,
      password: account.password,
      role: account.role,
      brand: account.brand,
      status: account.status,
      phone: account.phone,
      email: account.email
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {form.id ? "Update User Authority" : "Create User Authority"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (form.id) {
                deleteAccount(form.id);
              }
              saveAccount({
                name: form.name,
                userId: form.userId,
                password: form.password,
                role: form.role,
                brand: form.brand,
                status: form.status,
                phone: form.phone,
                email: form.email,
                updatedAt: form.id ? new Date().toISOString() : undefined
              });
              resetForm();
            }}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Input required placeholder="Name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
              <Input required placeholder="User ID" value={form.userId} onChange={(event) => updateForm("userId", event.target.value)} />
              <Input required placeholder="Password" value={form.password} onChange={(event) => updateForm("password", event.target.value)} />
              <select
                className="h-11 rounded-component border border-surface-border bg-surface-white px-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus"
                onChange={(event) => updateForm("role", event.target.value as UserRole)}
                value={form.role}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <Input placeholder="Brand" value={form.brand} onChange={(event) => updateForm("brand", event.target.value)} />
              <select
                className="h-11 rounded-component border border-surface-border bg-surface-white px-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus"
                onChange={(event) => updateForm("status", event.target.value as UserStatus)}
                value={form.status}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Input placeholder="Phone number" type="tel" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} />
              <Input placeholder="Email ID" type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
            </div>
            <div className="rounded-component border border-gold-primary/30 bg-gold-pale px-3 py-2 text-sm font-semibold text-gold-dark">
              Authority: {authorityByRole[form.role]}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="gap-2" type="submit">
                {form.id ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {form.id ? "Update User" : "Create User"}
              </Button>
              {form.id ? (
                <Button onClick={resetForm} type="button" variant="ghost">
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Created Users</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {accounts.length === 0 ? (
            <p>No users created yet.</p>
          ) : (
            accounts.map((account) => (
              <div className="grid gap-3 rounded-component border border-surface-border p-4 xl:grid-cols-[1fr_1fr_150px_150px_1fr_190px]" key={account.id}>
                <div>
                  <strong>{account.name}</strong>
                  <p className="text-sm text-surface-muted">{account.userId}</p>
                  <p className="text-sm text-surface-muted">{account.brand || "No brand"}</p>
                </div>
                <div className="text-sm">
                  <div>{account.email || "No email"}</div>
                  <div>{account.phone || "No phone"}</div>
                </div>
                <span className="h-fit rounded-component bg-gold-pale px-3 py-2 text-sm font-bold text-gold-dark">
                  {account.role}
                </span>
                <span className="h-fit rounded-component bg-[#edf4e4] px-3 py-2 text-sm font-bold text-harvest-olive">
                  {account.status}
                </span>
                <p className="text-sm text-surface-muted">{authorityByRole[account.role]}</p>
                <div className="flex flex-wrap gap-2">
                  <Button className="gap-2" onClick={() => editAccount(account)} size="sm" variant="outline">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button className="gap-2" onClick={() => deleteAccount(account.id)} size="sm" variant="ghost">
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
