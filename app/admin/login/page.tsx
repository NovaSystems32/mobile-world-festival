"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Lock, Eye, EyeOff, AlertCircle, Package, BarChart3, MessageSquare, Percent } from "lucide-react";

export default function LoginPage() {
  const router    = useRouter();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: "admin@mobileworldfestival.com", // cambiar si el usuario admin tiene otro email
      password,
    });
    if (error) {
      setError("Contraseña incorrecta. Intentá de nuevo.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const features = [
    { icon: Package,      label: "Gestión de productos" },
    { icon: BarChart3,    label: "Control de stock"     },
    { icon: Percent,      label: "Cupones y descuentos" },
    { icon: MessageSquare, label: "Mensajes de clientes" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#0A0F1E" }}>

      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #080D1A 0%, #0F1629 100%)" }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.15) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 65%)" }}
        />

        <div className="relative text-center space-y-8 px-12 max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.30) 0%, rgba(10,15,30,0.90) 70%)",
                border: "1.5px solid rgba(59,130,246,0.35)",
                boxShadow: "0 0 30px rgba(59,130,246,0.25)",
              }}
            >
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="Mobile World" fill className="object-contain" />
              </div>
            </div>
            <div className="text-left">
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "18px", color: "#F1F5F9", letterSpacing: "-0.02em" }}>
                Mobile World
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#00D4FF", letterSpacing: "0.10em", textTransform: "uppercase" }}>
                Festival
              </p>
            </div>
          </div>

          <div>
            <h1
              className="text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
            >
              Panel de<br />
              <span style={{
                background: "linear-gradient(90deg, #60A5FA, #A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                administración
              </span>
            </h1>
            <p style={{ color: "#64748B", lineHeight: 1.6 }}>
              Gestioná tu inventario, mensajes y cupones desde un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Icon className="w-4 h-4" style={{ color: "#60A5FA" }} />
                <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: "#0F1629" }}
      >
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.30) 0%, rgba(10,15,30,0.90) 70%)",
                border: "1.5px solid rgba(59,130,246,0.35)",
              }}
            >
              <div className="relative w-7 h-7">
                <Image src="/logo.png" alt="Mobile World" fill className="object-contain" />
              </div>
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "16px", color: "#F1F5F9" }}>
              Mobile World Festival
            </p>
          </div>

          <div>
            <h2
              className="font-bold text-2xl text-white mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              Bienvenido de nuevo
            </h2>
            <p style={{ color: "#64748B", fontSize: "14px" }}>
              Ingresá tu contraseña para acceder al panel.
            </p>
          </div>

          {error && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}
            >
              <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <p className="text-[#EF4444] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-[#334155] focus:outline-none transition-all text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.50)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.30)",
              }}
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Lock className="w-4 h-4" />
              }
              {loading ? "Ingresando..." : "Ingresar al panel"}
            </button>
          </form>

          <p className="text-center text-[#334155] text-xs">
            Acceso restringido · Solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
}
