"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, Mail, MapPin, Send, CheckCircle2, Phone } from "lucide-react";
import { submitContact } from "@/lib/actions/contact";
import { whatsappLink } from "@/lib/utils";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [form, setForm]       = useState({ name: "", phone: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl text-sm transition-all";

  return (
    <section id="contacto" className="py-20 lg:py-28 section-alt relative overflow-hidden">
      <div className="section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="badge badge-blue mb-4">Contacto</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Hablemos
          </h2>
          <p className="text-[#64748B] text-lg">
            Respondemos rápido. Por WhatsApp o por el formulario, como prefieras.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-5xl mx-auto">

          {/* Form — 3 cols */}
          <div className="lg:col-span-3 rounded-2xl p-6 lg:p-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-5 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                </div>
                <h3 className="font-display font-bold text-white text-xl">¡Mensaje enviado!</h3>
                <p className="text-[#64748B]">Te contactamos a la brevedad.</p>
                <button
                  onClick={() => setSent(false)}
                  className="text-[#60A5FA] text-sm font-semibold hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display font-bold text-white text-lg mb-6">
                  Envianos un mensaje
                </h3>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#94A3B8] text-sm font-semibold mb-1.5">
                      Nombre <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-semibold mb-1.5">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="+54 9 351 ..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94A3B8] text-sm font-semibold mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[#94A3B8] text-sm font-semibold mb-1.5">
                    Mensaje <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="¿En qué te podemos ayudar?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className={inputCls + " resize-none"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3.5 text-base"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>

          {/* Info — 2 cols */}
          <div className="lg:col-span-2 space-y-4">

            <a
              href={whatsappLink("Hola, quisiera consultar sobre sus productos.")}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl transition-all group"
              style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(34,197,94,0.15)")}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#22C55E]/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-0.5">WhatsApp</p>
                  <p className="font-display font-bold text-white">+54 9 351 237 3751</p>
                  <p className="text-[#22C55E] text-xs font-semibold mt-1">Escribir ahora →</p>
                </div>
              </div>
            </a>

            <a
              href="mailto:info@mobileworldfestival.com"
              className="block p-5 rounded-2xl transition-all group"
              style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)")}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-[#60A5FA]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Email</p>
                  <p className="font-display font-bold text-white text-sm">info@mobileworldfestival.com</p>
                </div>
              </div>
            </a>

            <div
              className="p-5 rounded-2xl"
              style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#A78BFA]/15 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Dirección</p>
                  <p className="font-display font-bold text-white">Acuña 45</p>
                </div>
              </div>
            </div>

            {/* WhatsApp big CTA */}
            <a
              href={whatsappLink("Hola, quisiera consultar sobre sus productos.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center py-4 text-base rounded-2xl"
            >
              <MessageCircle className="w-5 h-5" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
