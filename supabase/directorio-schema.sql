-- ============================================================
-- Directorio — Tablas para el panel de administración
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS directorio_empresas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        VARCHAR(200) NOT NULL,
  slug          VARCHAR(200) NOT NULL,
  pais          VARCHAR(100) NOT NULL,
  categoria     VARCHAR(100) NOT NULL,
  descripcion   TEXT,
  telefono      VARCHAR(50),
  whatsapp      VARCHAR(50),
  email         VARCHAR(200),
  website       VARCHAR(300),
  instagram     VARCHAR(100),
  facebook      VARCHAR(100),
  direccion     TEXT,
  logo_color    VARCHAR(20) DEFAULT '#0984e3',
  logo_texto    VARCHAR(50),
  plan          VARCHAR(20) DEFAULT 'regular' CHECK (plan IN ('regular','destacado','premium','patrocinado')),
  badge         INTEGER DEFAULT 0,
  activa        BOOLEAN DEFAULT true,
  catalogos     JSONB DEFAULT '[]',
  tags          TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(slug, pais, categoria)
);

ALTER TABLE directorio_empresas ENABLE ROW LEVEL SECURITY;

-- Lectura pública para la app
CREATE POLICY "public_read_directorio"
  ON directorio_empresas FOR SELECT
  USING (activa = true);

-- Admin puede hacer todo
CREATE POLICY "admin_all_directorio"
  ON directorio_empresas FOR ALL
  USING (auth.role() = 'authenticated');
