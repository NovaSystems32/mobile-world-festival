"use client";

import { useRef, useState, useTransition } from "react";
import { Download, Upload, Loader2, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { getAllProductsAdmin } from "@/lib/actions/products";
import { importProductsFromExcel } from "@/lib/actions/import";

interface ImportResult {
  created: number;
  updated: number;
  errors: string[];
}

export default function StockExcelTools() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ImportResult | null>(null);
  const [exporting, setExporting] = useState(false);

  // ── EXPORTAR ──
  async function handleExport() {
    setExporting(true);
    try {
      const products = await getAllProductsAdmin();
      const rows = products.map((p) => ({
        "Nombre":           p.name,
        "SKU":              p.sku || "",
        "Precio (USD)":     p.price,
        "Precio Mayorista": p.wholesale_price || "",
        "Stock":            p.stock,
        "Stock Mínimo":     p.low_stock_alert,
        "Categoría":        (p.category as { name?: string } | undefined)?.name || "",
        "Condición":        p.condition === "new" ? "Nuevo" : p.condition === "used" ? "Usado" : "Reacondicionado",
        "Activo":           p.is_active ? "Sí" : "No",
        "Destacado":        p.is_featured ? "Sí" : "No",
        "Mayorista":        p.is_wholesale ? "Sí" : "No",
        "Descripción":      p.description || "",
        "Slug":             p.slug,
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      // Ancho de columnas
      ws["!cols"] = [
        { wch: 30 }, { wch: 12 }, { wch: 14 }, { wch: 16 },
        { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
        { wch: 7 }, { wch: 10 }, { wch: 10 }, { wch: 50 }, { wch: 25 },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Productos");
      XLSX.writeFile(wb, `mobile-world-productos-${new Date().toISOString().slice(0,10)}.xlsx`);
    } finally {
      setExporting(false);
    }
  }

  // ── IMPORTAR ──
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws);

      startTransition(async () => {
        setResult(null);
        const res = await importProductsFromExcel(rows);
        setResult(res);
        if (fileRef.current) fileRef.current.value = "";
      });
    };
    reader.readAsArrayBuffer(file);
  }

  const btnBase = "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Exportar */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className={btnBase}
        style={{ background: "#082019", border: "1px solid rgba(34,197,94,0.30)", color: "#34D399" }}
      >
        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Exportar Excel
      </button>

      {/* Importar */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={isPending}
        className={btnBase}
        style={{ background: "#0D1E36", border: "1px solid rgba(59,130,246,0.30)", color: "#60A5FA" }}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {isPending ? "Importando..." : "Importar Excel"}
      </button>

      {/* Template */}
      <button
        onClick={downloadTemplate}
        className={btnBase}
        style={{ background: "#111D2E", border: "1px solid #1E2A3A", color: "#64748B" }}
      >
        <FileSpreadsheet className="w-4 h-4" />
        Descargar plantilla
      </button>

      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />

      {/* Resultado */}
      {result && (
        <div
          className="flex items-start gap-2 px-4 py-2.5 rounded-xl text-sm"
          style={{
            background: result.errors.length > 0 ? "rgba(239,68,68,0.10)" : "rgba(34,197,94,0.10)",
            border: `1px solid ${result.errors.length > 0 ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
            color: result.errors.length > 0 ? "#F87171" : "#34D399",
          }}
        >
          {result.errors.length > 0
            ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            : <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          }
          <div>
            <p className="font-semibold">
              {result.created} creados · {result.updated} actualizados
            </p>
            {result.errors.slice(0, 3).map((e, i) => (
              <p key={i} className="text-xs opacity-80">{e}</p>
            ))}
            {result.errors.length > 3 && (
              <p className="text-xs opacity-60">...y {result.errors.length - 3} errores más</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function downloadTemplate() {
  const template = [
    {
      "Nombre": "Nokia 106",
      "SKU": "NK-106",
      "Precio (USD)": 12.99,
      "Precio Mayorista": 10.50,
      "Stock": 20,
      "Stock Mínimo": 3,
      "Categoría": "Celulares",
      "Condición": "Nuevo",
      "Activo": "Sí",
      "Destacado": "No",
      "Mayorista": "Sí",
      "Descripción": "Nokia 106 clásico. Batería de larga duración.",
    },
  ];
  const ws = XLSX.utils.json_to_sheet(template);
  ws["!cols"] = [
    { wch: 30 }, { wch: 12 }, { wch: 14 }, { wch: 16 },
    { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
    { wch: 7 }, { wch: 10 }, { wch: 10 }, { wch: 50 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Productos");
  XLSX.writeFile(wb, "plantilla-productos.xlsx");
}
