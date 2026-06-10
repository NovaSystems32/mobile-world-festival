import { getCoupons } from "@/lib/actions/coupons";
import CuponesClient from "@/components/admin/CuponesClient";

export default async function CuponesPage() {
  const coupons = await getCoupons();
  const active = coupons.filter((c) => c.is_active).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1
          className="font-bold text-2xl text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Cupones de descuento
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          Creá y administrá códigos de descuento para tus clientes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total cupones", value: coupons.length, color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
          { label: "Activos", value: active, color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
          {
            label: "Usos totales",
            value: coupons.reduce((sum, c) => sum + c.used_count, 0),
            color: "#A78BFA",
            bg: "rgba(167,139,250,0.12)",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <span className="font-bold text-lg" style={{ color }}>{value}</span>
            </div>
            <p className="text-[#64748B] text-sm">{label}</p>
          </div>
        ))}
      </div>

      <CuponesClient coupons={coupons} />
    </div>
  );
}
