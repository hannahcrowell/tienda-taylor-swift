-- ==========================================
-- TIENDA TAYLOR SWIFT - CREACIÓN DE TABLAS
-- Autor: Hannah Crowell
-- Fecha: Octubre 2024
-- ==========================================

-- Primero habilitamos la extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLA: perfiles
-- Descripción: Información extendida de cada usuario registrado
-- ==========================================
CREATE TABLE perfiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre_completo TEXT,
  telefono TEXT,
  rol TEXT DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin')),
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_modificacion TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLA: categorias
-- Descripción: Categorías de productos (Discos, Vinilos, Cardigans, Ropa)
-- ==========================================
CREATE TABLE categorias (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  esta_activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLA: productos
-- Descripción: Catálogo de productos de Taylor Swift
-- ==========================================
CREATE TABLE productos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  inventario INTEGER DEFAULT 0 CHECK (inventario >= 0),
  url_imagen TEXT,
  esta_activo BOOLEAN DEFAULT true,
  calificacion_promedio DECIMAL(3,2) DEFAULT 0,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_modificacion TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLA: direcciones
-- Descripción: Direcciones de envío de los usuarios
-- ==========================================
CREATE TABLE direcciones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  calle TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  estado TEXT NOT NULL,
  codigo_postal TEXT NOT NULL,
  pais TEXT DEFAULT 'México',
  es_predeterminada BOOLEAN DEFAULT false,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLA: carritos
-- Descripción: Carrito de compras por usuario
-- ==========================================
CREATE TABLE carritos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_modificacion TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLA: items_carrito
-- Descripción: Productos dentro del carrito
-- ==========================================
CREATE TABLE items_carrito (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  carrito_id UUID REFERENCES carritos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(carrito_id, producto_id)
);

-- ==========================================
-- TABLA: ordenes
-- Descripción: Órdenes de compra realizadas
-- ==========================================
CREATE TABLE ordenes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  direccion_id UUID REFERENCES direcciones(id),
  total DECIMAL(10,2) NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada')),
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_modificacion TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLA: items_orden
-- Descripción: Productos dentro de cada orden
-- ==========================================
CREATE TABLE items_orden (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  orden_id UUID REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ÍNDICES
-- Los creé para mejorar el rendimiento en las búsquedas más comunes
-- ==========================================
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_slug ON productos(slug);
CREATE INDEX idx_productos_activo ON productos(esta_activo);
CREATE INDEX idx_items_carrito_carrito ON items_carrito(carrito_id);
CREATE INDEX idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX idx_items_orden_orden ON items_orden(orden_id);
CREATE INDEX idx_categorias_slug ON categorias(slug);
CREATE INDEX idx_categorias_activo ON categorias(esta_activo);

-- ==========================================
-- FUNCIÓN: actualizar_fecha_modificacion
-- Descripción: Actualiza automáticamente el campo fecha_modificacion
-- ==========================================
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_modificacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- TRIGGERS para actualizar fecha_modificacion
-- ==========================================
CREATE TRIGGER trigger_perfiles_fecha_modificacion 
  BEFORE UPDATE ON perfiles
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_productos_fecha_modificacion 
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_carritos_fecha_modificacion 
  BEFORE UPDATE ON carritos
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_ordenes_fecha_modificacion 
  BEFORE UPDATE ON ordenes
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

-- ==========================================
-- FUNCIÓN: manejar_nuevo_usuario
-- Descripción: Crea automáticamente un perfil cuando alguien se registra
-- ==========================================
CREATE OR REPLACE FUNCTION public.manejar_nuevo_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre_completo, rol)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'usuario'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- TRIGGER: Crear perfil al registrarse
-- ==========================================
CREATE TRIGGER trigger_crear_perfil_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.manejar_nuevo_usuario();