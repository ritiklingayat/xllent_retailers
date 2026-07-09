import { useState } from "react";
import { ArrowRight, KeyRound, UserPlus } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { brand } from "@/config/brand";
import { loadAccounts, saveAccount, saveCurrentCustomer } from "@/services/localStore";

type LoginPageProps = {
  navigate: (path: string) => void;
};

export function LoginPage({ navigate }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginWithPassword = () => {
    const account = loadAccounts().find(
      (item) =>
        (item.email === identifier || item.phone === identifier) &&
        item.password === password
    );

    if (!account) {
      setMessage("Invalid mobile/email or password.");
      return;
    }

    saveCurrentCustomer(account);
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#f8fbf1]">
      <Seo
        description="Login to Xllent Retailers with customer registration and password access."
        path="/"
        title="Wholesaler Login"
      />
      <section className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-surface-black lg:block">
          <img
            alt="Premium FMCG retail shelves"
            className="h-full w-full object-cover opacity-88"
            loading="eager"
            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1400&q=82"
          />
          <div className="absolute inset-x-10 bottom-10 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-secondary">
              {brand.name}
            </p>
            <h1 className="mt-3 text-surface-white">Customer ordering made simple</h1>
            <p className="mt-4 text-lg leading-8 text-white/82">
              Register, login with your password, shop FMCG essentials, and track
              every order from your customer dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 md:px-10">
          <div className="w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-3">
              <img
                alt={`${brand.name} logo`}
                className="h-16 w-16 rounded-component object-contain"
                src={brand.logo}
              />
              <div>
                <div className="text-xl font-bold text-surface-black">{brand.name}</div>
                <p className="mt-1 text-sm text-surface-muted">{brand.phone}</p>
              </div>
            </div>

            <div className="rounded-component border border-surface-border bg-surface-white p-5 shadow-soft">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-component bg-gold-pale text-gold-dark">
                {mode === "signup" ? <UserPlus className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                  size="sm"
                  variant={mode === "login" ? "primary" : "outline"}
                >
                  Wholesaler Login
                </Button>
                <Button
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                  size="sm"
                  variant={mode === "signup" ? "primary" : "outline"}
                >
                  Customer Register
                </Button>
              </div>

              {mode === "login" ? (
                <form
                  className="grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    loginWithPassword();
                  }}
                >
                  <div>
                    <h2 className="text-2xl">Wholesaler Login</h2>
                    <p className="mt-2 text-sm leading-6">
                      Enter your registered mobile number or email and password.
                    </p>
                  </div>
                  <Input
                    required
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Mobile number or email"
                    value={identifier}
                  />
                  <Input
                    required
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    type="password"
                    value={password}
                  />
                  <Button className="w-full gap-2" type="submit">
                    Login
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = new FormData(event.currentTarget);
                    saveAccount({
                      name: String(form.get("name") ?? ""),
                      phone: String(form.get("phone") ?? ""),
                      email: String(form.get("email") ?? ""),
                      password: String(form.get("password") ?? "")
                    });
                    setMessage("Account created. You can now login with your password.");
                    event.currentTarget.reset();
                    setMode("login");
                  }}
                >
                  <h2 className="text-2xl">Customer Register</h2>
                  <p className="mt-2 text-sm leading-6">
                    Create a demo customer profile for order records.
                  </p>
                  <div className="mt-5 grid gap-3">
                    <Input required name="name" placeholder="Full name" />
                    <Input required name="phone" placeholder="Phone number" type="tel" />
                    <Input required name="email" placeholder="Email ID" type="email" />
                    <Input required name="password" placeholder="Password" type="password" />
                  </div>
                  <Button className="mt-5 w-full gap-2" type="submit">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </Button>
                </form>
              )}

              {message ? (
                <div className="mt-4 rounded-component border border-harvest-olive/30 bg-[#edf7e6] px-3 py-2 text-sm font-semibold text-harvest-olive">
                  {message}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
