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

    photo: File | null;

    fullName: string;

    mobile: string;

    email: string;

    password: string;

    role: UserRole;

    state: string;

    district: string;

    city: string;

    address: string;

    pinCode: string;

    gst: string;

    parentUser: string;

    status: UserStatus;
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

  photo: null,

  fullName: "",

  mobile: "",

  email: "",

  password: "",

  role: "Customer", // Change if your backend uses different role values

  state: "",

  district: "",

  city: "",

  address: "",

  pinCode: "",

  gst: "",

  parentUser: "",

  status: "Active" // Change if backend expects "ACTIVE"
};

export function SuperAdminUsersPage({ accounts }: SuperAdminUsersPageProps) {
  const [form, setForm] = useState<UserForm>(emptyUserForm);

  const updateForm = <K extends keyof UserForm>(key: K, value: UserForm[K]) => {
    setForm((current) => ({ ...current, [key]: value } as UserForm));
  };

  const resetForm = () => setForm(emptyUserForm);

  const editAccount = (account: Account) => {
  setForm({
  id: account.id,
  photo: null,
  fullName: account.name,
  mobile: account.phone,
  email: account.email,
  password: account.password,
  role: account.role,
  state: "",
  district: "",
  city: "",
  address: "",
  pinCode: "",
  gst: "",
  parentUser: "",
  status: account.status
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
  name: form.fullName,
  userId: form.email,
  password: form.password,
  role: form.role,
  brand: form.gst,
  status: form.status,
  phone: form.mobile,
  email: form.email,
  updatedAt: form.id ? new Date().toISOString() : undefined
});

              resetForm();
            }}
          >
           <div className="grid gap-3 md:grid-cols-2">
  {/* Photo */}
  <div className="md:col-span-2">
    <label className="mb-1 block text-sm font-medium">Photo</label>
    <input
      type="file"
      accept="image/*"
      onChange={(event) =>
        updateForm("photo", event.target.files?.[0] ?? null)
      }
      className="w-full rounded-component border border-surface-border p-2"
    />
  </div>

  {/* Full Name */}
  <Input
    required
    placeholder="Full Name"
    value={form.fullName}
    onChange={(event) => updateForm("fullName", event.target.value)}
  />

  {/* Mobile */}
  <Input
    required
    placeholder="Mobile"
    type="tel"
    value={form.mobile}
    onChange={(event) => updateForm("mobile", event.target.value)}
  />

  {/* Email */}
  <Input
    required
    placeholder="Email"
    type="email"
    value={form.email}
    onChange={(event) => updateForm("email", event.target.value)}
  />

  {/* Password */}
  <Input
    required
    placeholder="Password"
    type="password"
    value={form.password}
    onChange={(event) => updateForm("password", event.target.value)}
  />

  {/* Role */}
  <select
    className="h-11 rounded-component border border-surface-border bg-surface-white px-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus"
    value={form.role}
    onChange={(event) =>
      updateForm("role", event.target.value as UserRole)
    }
  >
    {roleOptions.map((role) => (
      <option key={role} value={role}>
        {role}
      </option>
    ))}
  </select>

  {/* Parent User */}
  <Input
    placeholder="Parent User"
    value={form.parentUser}
    onChange={(event) => updateForm("parentUser", event.target.value)}
  />

  {/* State */}
  <Input
    placeholder="State"
    value={form.state}
    onChange={(event) => updateForm("state", event.target.value)}
  />

  {/* District */}
  <Input
    placeholder="District"
    value={form.district}
    onChange={(event) => updateForm("district", event.target.value)}
  />

  {/* City */}
  <Input
    placeholder="City"
    value={form.city}
    onChange={(event) => updateForm("city", event.target.value)}
  />

  {/* Address */}
  <textarea
    className="rounded-component border border-surface-border p-3 md:col-span-2"
    rows={3}
    placeholder="Address"
    value={form.address}
    onChange={(event) => updateForm("address", event.target.value)}
  />

  {/* Pin Code */}
  <Input
    placeholder="Pin Code"
    value={form.pinCode}
    onChange={(event) => updateForm("pinCode", event.target.value)}
  />

  {/* GST */}
  <Input
    placeholder="GST"
    value={form.gst}
    onChange={(event) => updateForm("gst", event.target.value)}
  />

  {/* Status */}
  <select
    className="h-11 rounded-component border border-surface-border bg-surface-white px-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus"
    value={form.status}
    onChange={(event) =>
      updateForm("status", event.target.value as UserStatus)
    }
  >
    {statusOptions.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select>
</div>

<div className="rounded-component border border-gold-primary/30 bg-gold-pale px-3 py-2 text-sm font-semibold text-gold-dark">
  Authority: {authorityByRole[form.role]}
</div>

<div className="flex flex-wrap gap-2">
  <Button className="gap-2" type="submit">
    {form.id ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    Save
  </Button>

  <Button onClick={resetForm} type="button" variant="ghost">
    Cancel
  </Button>
</div>

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
