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
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [message, setMessage] = useState("");

  const generateOtp = () => {
    const demoOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(demoOtp);
    setOtp("");
    setMessage(`Demo OTP: ${demoOtp}`);
  };

  const verifyOtp = () => {
    if (!generatedOtp || otp !== generatedOtp) {
      setMessage("Enter the generated demo OTP to continue.");
      return;
    }

    const account = loadAccounts().find(
      (item) => item.email === identifier || item.phone === identifier
    );
    saveCurrentCustomer(
      account ?? {
        name: "Xllent Retailers Customer",
        email: identifier.includes("@") ? identifier : "",
        phone: identifier.includes("@") ? "" : identifier,
        address: ""
      }
    );
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#f8fbf1]">
      <Seo
        description="Login to Xllent Retailers with customer registration and demo OTP access."
        path="/"
        title="Customer Login"
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
              Register, login with a demo OTP, shop FMCG essentials, and track
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
                  Customer Login
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
                    verifyOtp();
                  }}
                >
                  <div>
                    <h2 className="text-2xl">OTP Login</h2>
                    <p className="mt-2 text-sm leading-6">
                      Enter your mobile number or email, generate a demo OTP, then verify.
                    </p>
                  </div>
                  <Input
                    required
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Mobile number or email"
                    value={identifier}
                  />
                  <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <Input
                      inputMode="numeric"
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter demo OTP"
                      value={otp}
                    />
                    <Button onClick={generateOtp} type="button" variant="outline">
                      Generate OTP
                    </Button>
                  </div>
                  <Button className="w-full gap-2" type="submit">
                    Verify OTP
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
                      password: "otp-demo"
                    });
                    setMessage("Account created. You can now login with demo OTP.");
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
