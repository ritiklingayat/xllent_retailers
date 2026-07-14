import { useMemo, useState, type ReactNode } from "react";
import { Camera, Edit3, Save, Trash2, UserCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
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
  fullName: string;
  profileImage: string;
  mobile: string;
  email: string;
  password: string;
  role: UserRole;
  state: string;
  district: string;
  city: string;
  address: string;
  pincode: string;
  gstin: string;
  parentUserId: string;
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
  fullName: "",
  profileImage: "",
  mobile: "",
  email: "",
  password: "",
  role: "Customer",
  state: "",
  district: "",
  city: "",
  address: "",
  pincode: "",
  gstin: "",
  parentUserId: "",
  status: "Active"
};

const selectClassName =
  "h-11 w-full rounded-component border border-surface-border bg-surface-white px-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus";

function Field({
  label,
  children,
  className = ""
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-1.5 text-sm font-semibold text-surface-black ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function SuperAdminUsersPage({ accounts }: SuperAdminUsersPageProps) {
  const [form, setForm] = useState<UserForm>(emptyUserForm);

  const parentOptions = useMemo(
    () => accounts.filter((account) => account.id !== form.id),
    [accounts, form.id]
  );

  const updateForm = <K extends keyof UserForm>(key: K, value: UserForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => setForm(emptyUserForm);

  const editAccount = (account: Account) => {
    setForm({
      id: account.id,
      fullName: account.name,
      profileImage: account.profileImage,
      mobile: account.phone,
      email: account.email,
      password: account.password,
      role: account.role,
      state: account.state,
      district: account.district,
      city: account.city,
      address: account.address,
      pincode: account.pincode,
      gstin: account.gstin,
      parentUserId: account.parentUserId,
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
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (form.id) {
                deleteAccount(form.id);
              }
              saveAccount({
                name: form.fullName.trim(),
                userId: form.email.trim(),
                password: form.password,
                role: form.role,
                brand: "",
                profileImage: form.profileImage,
                status: form.status,
                phone: form.mobile.trim(),
                email: form.email.trim(),
                state: form.state.trim(),
                district: form.district.trim(),
                city: form.city.trim(),
                address: form.address.trim(),
                pincode: form.pincode.trim(),
                gstin: form.gstin.trim(),
                parentUserId: form.parentUserId,
                updatedAt: form.id ? new Date().toISOString() : undefined
              });
              resetForm();
            }}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field className="md:col-span-2 xl:col-span-3" label="Photo">
                <div className="flex flex-wrap items-center gap-4 rounded-component border border-dashed border-surface-border bg-surface-gray/40 p-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surface-border bg-surface-white">
                    {form.profileImage ? (
                      <img
                        alt="Selected user"
                        className="h-full w-full object-cover"
                        src={form.profileImage}
                      />
                    ) : (
                      <Camera className="h-7 w-7 text-surface-muted" />
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Input
                      accept="image/png,image/jpeg,image/webp"
                      className="h-auto max-w-sm py-2"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () =>
                          updateForm("profileImage", String(reader.result ?? ""));
                        reader.readAsDataURL(file);
                      }}
                      type="file"
                    />
                    <span className="text-xs font-normal text-surface-muted">
                      PNG, JPG or WebP
                    </span>
                  </div>
                </div>
              </Field>

              <Field label="Full Name">
                <Input
                  required
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={(event) => updateForm("fullName", event.target.value)}
                />
              </Field>
              <Field label="Mobile">
                <Input
                  required
                  inputMode="numeric"
                  placeholder="Enter mobile number"
                  type="tel"
                  value={form.mobile}
                  onChange={(event) => updateForm("mobile", event.target.value)}
                />
              </Field>
              <Field label="Email">
                <Input
                  required
                  placeholder="Enter email address"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                />
              </Field>
              <Field label="Password">
                <Input
                  required
                  minLength={6}
                  placeholder="Enter password"
                  type="password"
                  value={form.password}
                  onChange={(event) => updateForm("password", event.target.value)}
                />
              </Field>
              <Field label="State">
                <Input
                  placeholder="Enter state"
                  value={form.state}
                  onChange={(event) => updateForm("state", event.target.value)}
                />
              </Field>
              <Field label="District">
                <Input
                  placeholder="Enter district"
                  value={form.district}
                  onChange={(event) => updateForm("district", event.target.value)}
                />
              </Field>
              <Field label="City">
                <Input
                  placeholder="Enter city"
                  value={form.city}
                  onChange={(event) => updateForm("city", event.target.value)}
                />
              </Field>
              <Field label="Pin Code">
                <Input
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter pin code"
                  value={form.pincode}
                  onChange={(event) => updateForm("pincode", event.target.value)}
                />
              </Field>
              <Field label="GST">
                <Input
                  maxLength={15}
                  placeholder="Enter GSTIN"
                  value={form.gstin}
                  onChange={(event) => updateForm("gstin", event.target.value.toUpperCase())}
                />
              </Field>
              <Field className="md:col-span-2 xl:col-span-3" label="Address">
                <Textarea
                  placeholder="Enter complete address"
                  value={form.address}
                  onChange={(event) => updateForm("address", event.target.value)}
                />
              </Field>
              <Field label="Parent User">
                <select
                  className={selectClassName}
                  value={form.parentUserId}
                  onChange={(event) => updateForm("parentUserId", event.target.value)}
                >
                  <option value="">No parent user</option>
                  {parentOptions.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.role})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="User Authority">
                <select
                  className={selectClassName}
                  value={form.role}
                  onChange={(event) => updateForm("role", event.target.value as UserRole)}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  className={selectClassName}
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
              </Field>
            </div>

            <div className="rounded-component border border-gold-primary/30 bg-gold-pale px-3 py-2 text-sm font-semibold text-gold-dark">
              Authority: {authorityByRole[form.role]}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="gap-2" type="submit">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button className="gap-2" onClick={resetForm} type="button" variant="ghost">
                <X className="h-4 w-4" />
                Cancel
              </Button>
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
              <div
                className="grid gap-3 rounded-component border border-surface-border p-4 xl:grid-cols-[1.2fr_1fr_1fr_150px_1fr_190px]"
                key={account.id}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold-pale font-bold text-gold-dark">
                    {account.profileImage ? (
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={account.profileImage}
                      />
                    ) : (
                      account.name.slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div>
                    <strong>{account.name}</strong>
                    <p className="text-sm text-surface-muted">
                      {account.gstin || "No GSTIN"}
                    </p>
                  </div>
                </div>
                <div className="text-sm">
                  <div>{account.email || "No email"}</div>
                  <div>{account.phone || "No phone"}</div>
                </div>
                <div className="text-sm">
                  <div>
                    {[account.city, account.district, account.state]
                      .filter(Boolean)
                      .join(", ") || "No location"}
                  </div>
                  <div className="text-surface-muted">
                    {account.pincode || "No pin code"}
                  </div>
                </div>
                <span className="h-fit rounded-component bg-[#edf4e4] px-3 py-2 text-sm font-bold text-harvest-olive">
                  {account.status}
                </span>
                <div className="text-sm">
                  <strong>{account.role}</strong>
                  <p className="text-surface-muted">
                    Parent:{" "}
                    {accounts.find((item) => item.id === account.parentUserId)?.name ||
                      "None"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="gap-2"
                    onClick={() => editAccount(account)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    className="gap-2"
                    onClick={() => deleteAccount(account.id)}
                    size="sm"
                    variant="ghost"
                  >
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
