import { LockKeyhole } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { brand } from "@/config/brand";

type SuperAdminLoginPageProps = {
  loginError: string;
  onLogin: (email: string, password: string) => void;
};

export function SuperAdminLoginPage({
  loginError,
  onLogin
}: SuperAdminLoginPageProps) {
  return (
    <main className="min-h-screen bg-[#f7f9f2] text-surface-black">
      <Seo
        description="Xllent Retailers super admin login for product, order, and customer management."
        path="/super-admin"
        title="Super Admin Login"
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
              <h1 className="text-3xl">Super Admin Login</h1>
              <p className="text-sm">{brand.email}</p>
            </div>
          </div>
          <form
            className="mt-5 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              onLogin(
                String(formData.get("email") ?? ""),
                String(formData.get("password") ?? "")
              );
            }}
          >
            <Input required name="email" placeholder="superadmin@xllentretailers.com" type="email" />
            <Input required name="password" placeholder="super123" type="password" />
            {loginError ? (
              <div className="rounded-component border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {loginError}
              </div>
            ) : null}
            <Button className="gap-2" type="submit" variant="secondary">
              <LockKeyhole className="h-4 w-4" />
              Super Login
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
