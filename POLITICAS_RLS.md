<h2>Políticas Implementadas</h2>

<h3>1. Perfiles</h3>
<p><strong>Problema que resuelve:</strong> Evitar que los usuarios vean información de otros usuarios.</p>

<pre><code>CREATE POLICY "Los usuarios ven su propio perfil"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);
</code></pre>

<p><strong>Explicación:</strong></p>
<ul>
  <li><code>auth.uid()</code> es el ID del usuario que hace la petición (lo da Supabase automáticamente).</li>
  <li>Solo permite ver la fila donde el <code>id</code> coincide con el usuario actual.</li>
  <li>Si yo soy el usuario con ID "abc-123", solo veré mi fila en la tabla <code>perfiles</code>.</li>
</ul>

<p><strong>Para admins:</strong></p>

<pre><code>CREATE POLICY "Los admins ven todos los perfiles"
  ON perfiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );
</code></pre>

<p>Uso <code>EXISTS</code> para preguntar: "¿existe un perfil con este ID que sea admin?" Si sí, puede ver todas las filas.</p>

<h3>2. Productos</h3>
<p><strong>Problema:</strong> Los usuarios no deberían ver productos desactivados, pero los admins sí.</p>

<pre><code>CREATE POLICY "Todos ven productos activos"
  ON productos FOR SELECT
  USING (
    esta_activo = true 
    OR EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );
</code></pre>

<p><strong>Explicación:</strong></p>
<ul>
  <li>Si el producto está activo, todos lo ven.</li>
  <li>Si eres admin, puedes verlo todo.</li>
  <li>El <code>OR</code> permite que se cumpla cualquiera de las condiciones.</li>
</ul>

<p><strong>Crear/editar productos:</strong></p>

<pre><code>CREATE POLICY "Admins crean productos"
  ON productos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );
</code></pre>

<p>Solo los admins pueden crear productos, evitando que cualquier usuario agregue cosas falsas.</p>

<h3>3. Carritos</h3>
<p><strong>Problema:</strong> Cada usuario solo debe acceder a su propio carrito.</p>

<pre><code>CREATE POLICY "Ver mi carrito"
  ON carritos FOR SELECT
  USING (auth.uid() = usuario_id);
</code></pre>

<p>Simple: solo puedes ver tu propio carrito.</p>

<h3>4. Items del Carrito</h3>
<p><strong>Problema:</strong> Los items no tienen directamente el ID del usuario, por eso usamos:</p>

<pre><code>CREATE POLICY "Ver items de mi carrito"
  ON items_carrito FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carritos 
      WHERE carritos.id = items_carrito.carrito_id 
      AND carritos.usuario_id = auth.uid()
    )
  );
</code></pre>

<p>Se asegura que solo puedes ver items que pertenezcan a un carrito tuyo.</p>

<h3>5. Órdenes</h3>

<pre><code>CREATE POLICY "Ver mis órdenes"
  ON ordenes FOR SELECT
  USING (
    auth.uid() = usuario_id 
    OR EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );
</code></pre>

<p>Los usuarios ven solo sus órdenes; los admins pueden ver todas.</p>

<pre><code>CREATE POLICY "Admins actualizan órdenes"
  ON ordenes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles 
      WHERE perfiles.id = auth.uid() 
      AND perfiles.rol = 'admin'
    )
  );
</code></pre>

<p>Solo los admins pueden cambiar el estado de una orden.</p>

<h2>📝 Orden de Ejecución</h2>
<p>Es importante seguir este orden para evitar problemas:</p>
<ol>
  <li>Habilitar RLS en todas las tablas primero.</li>
  <li>Crear políticas básicas para perfiles.</li>
  <li>Crear políticas para productos y categorías.</li>
  <li>Crear políticas para carritos.</li>
  <li>Crear políticas para órdenes.</li>
</ol>

<h2>Pruebas que hice</h2>
<p><strong>Como usuario normal:</strong></p>
<ul>
  <li>Intenté ver productos de otros usuarios → Bloqueado </li>
  <li>Intenté crear un producto → Bloqueado </li>
  <li>Intenté ver el carrito de otro → Bloqueado </li>
</ul>

<p><strong>Como admin:</strong></p>
<ul>
  <li>Pude ver todos los perfiles </li>
  <li>Pude crear/editar productos </li>
  <li>Pude ver todas las órdenes </li>
</ul>
