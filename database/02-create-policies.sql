-- ==========================================
-- TIENDA TAYLOR SWIFT - POLÍTICAS DE SEGURIDAD (RLS)
-- Autor: Hannah Crowell
-- Descripción: Estas políticas controlan quién puede ver y modificar qué datos
-- ==========================================

-- Primero habilitamos RLS en todas las tablas
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE direcciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE carritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_carrito ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_orden ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLÍTICAS: perfiles
-- Lógica: Cada usuario solo ve su propio perfil, excepto los admins
-- ==========================================

CREATE POLICY "Los usuarios ven su propio perfil"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON perfiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden crear su propio perfil"
  ON perfiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Los admins ven todos los perfiles"
  ON perfiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

-- ==========================================
-- POLÍTICAS: categorias
-- Lógica: Todos ven categorías activas, solo admins las gestionan
-- ==========================================

CREATE POLICY "Todos ven categorías activas"
  ON categorias FOR SELECT
  USING (esta_activo = true OR EXISTS (
    SELECT 1 FROM perfiles 
    WHERE perfiles.id = auth.uid() 
    AND perfiles.rol = 'admin'
  ));

CREATE POLICY "Admins crean categorías"
  ON categorias FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

CREATE POLICY "Admins actualizan categorías"
  ON categorias FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

CREATE POLICY "Admins eliminan categorías"
  ON categorias FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

-- ==========================================
-- POLÍTICAS: productos
-- Lógica: Todos ven productos activos, solo admins los gestionan
-- ==========================================

CREATE POLICY "Todos ven productos activos"
  ON productos FOR SELECT
  USING (esta_activo = true OR EXISTS (
    SELECT 1 FROM perfiles 
    WHERE perfiles.id = auth.uid() 
    AND perfiles.rol = 'admin'
  ));

CREATE POLICY "Admins crean productos"
  ON productos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

CREATE POLICY "Admins actualizan productos"
  ON productos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

CREATE POLICY "Admins eliminan productos"
  ON productos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

-- ==========================================
-- POLÍTICAS: direcciones
-- Lógica: Solo gestionas tus propias direcciones
-- ==========================================

CREATE POLICY "Ver mis direcciones"
  ON direcciones FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Crear mis direcciones"
  ON direcciones FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Actualizar mis direcciones"
  ON direcciones FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Eliminar mis direcciones"
  ON direcciones FOR DELETE
  USING (auth.uid() = usuario_id);

-- ==========================================
-- POLÍTICAS: carritos
-- Lógica: Solo accedes a tu propio carrito
-- ==========================================

CREATE POLICY "Ver mi carrito"
  ON carritos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Crear mi carrito"
  ON carritos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Actualizar mi carrito"
  ON carritos FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Eliminar mi carrito"
  ON carritos FOR DELETE
  USING (auth.uid() = usuario_id);

-- ==========================================
-- POLÍTICAS: items_carrito
-- Lógica: Solo modificas items de tu carrito
-- ==========================================

CREATE POLICY "Ver items de mi carrito"
  ON items_carrito FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carritos 
      WHERE carritos.id = items_carrito.carrito_id 
      AND carritos.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Agregar items a mi carrito"
  ON items_carrito FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carritos 
      WHERE carritos.id = items_carrito.carrito_id 
      AND carritos.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Actualizar items de mi carrito"
  ON items_carrito FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM carritos 
      WHERE carritos.id = items_carrito.carrito_id 
      AND carritos.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Eliminar items de mi carrito"
  ON items_carrito FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM carritos 
      WHERE carritos.id = items_carrito.carrito_id 
      AND carritos.usuario_id = auth.uid()
    )
  );

-- ==========================================
-- POLÍTICAS: ordenes
-- Lógica: Ves tus órdenes, admins ven todas
-- ==========================================

CREATE POLICY "Ver mis órdenes"
  ON ordenes FOR SELECT
  USING (auth.uid() = usuario_id OR EXISTS (
    SELECT 1 FROM perfiles 
    WHERE perfiles.id = auth.uid() 
    AND perfiles.rol = 'admin'
  ));

CREATE POLICY "Crear mis órdenes"
  ON ordenes FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Admins actualizan órdenes"
  ON ordenes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

-- ==========================================
-- POLÍTICAS: items_orden
-- Lógica: Ves items de tus órdenes, admins ven todo
-- ==========================================

CREATE POLICY "Ver items de mis órdenes"
  ON items_orden FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ordenes 
      WHERE ordenes.id = items_orden.orden_id 
      AND ordenes.usuario_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );

CREATE POLICY "Crear items de mis órdenes"
  ON items_orden FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ordenes 
      WHERE ordenes.id = items_orden.orden_id 
      AND ordenes.usuario_id = auth.uid()
    )
  );