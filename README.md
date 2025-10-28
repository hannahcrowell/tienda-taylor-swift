<h1>
  Creación de Página de venta de productos para Proyecto de segundo Departamental
</h1>
<a href="https://youtu.be/Jr-DZmyDCKA">Video de Prueba de la aplicación AQUÍ</a>
<p> Por medio de uno de React y con ayuda de otras herramientas como "VSCode", "SupaBase", "Vercel" y "Github", entre otros para el desarrollo</p>
<img src="https://i.postimg.cc/pXRM3zB8/Captura-de-pantalla-2025-10-27-193026.png" alt="Captura-de-pantalla-2025-10-27-193026" >
<pre>
tienda-taylor-swift/
├── public/
├── src/
│   ├── assets/              # Imágenes y recursos estáticos
│   ├── components/          # Componentes reutilizables
│   │   ├── common/          # Botones, inputs, loading, etc.
│   │   ├── layout/          # Header, Footer, Layout
│   │   ├── products/        # ProductCard, ProductList
│   │   └── cart/            # Componentes del carrito
│   ├── pages/               # Páginas de la aplicación
│   │   ├── admin/           # Páginas de administración
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Profile.jsx
│   │   └── Orders.jsx
│   ├── routes/              # Configuración de rutas
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── services/            # Servicios de API
│   │   ├── supabase.js
│   │   ├── auth.service.js
│   │   └── products.service.js
│   ├── store/               # Zustand stores
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── productStore.js
│   ├── utils/               # Funciones utilitarias
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── database/                # Scripts SQL
│   ├── 01-create-tables.sql
│   ├── 02-create-policies.sql
│   └── 03-seed-data.sql
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└──  README.md
</pre>
<h2>Usuarios de Prueba</h2>
<h3>Administrador</h3>
<ul>
  <li><strong>Email:</strong> mfhm1316@gmail.com</li>
  <li><strong>Password:</strong>Taylor2024!</li>
  <li><strong>Rol:</strong> admin</li>
</ul>
<h3>Usuario</h3>
<ul>
  <li><strong>Email:</strong> 155295@udlondres.com</li>
  <li><strong>Password:</strong> 123456 </li>
  <li><strong>Rol:</strong> usuario</li>
</ul>

<h2>Seguridad Implementada</h2>

<h3>Row Level Security (RLS)</h3>
<p>Todas las tablas tienen RLS habilitado con políticas específicas:</p>

<h4>Perfiles</h4>
<ul>
  <li>Los usuarios solo pueden <strong>ver y editar su propio perfil</strong>.</li>
  <li>Los admins pueden <strong>ver todos los perfiles</strong>.</li>
</ul>

<h4>Productos y Categorías</h4>
<ul>
  <li>Todos pueden <strong>ver productos/categorías activos</strong>.</li>
  <li>Solo admins pueden <strong>crear, editar y eliminar</strong>.</li>
</ul>

<h4>Carritos y Items</h4>
<ul>
  <li>Los usuarios solo pueden <strong>gestionar su propio carrito</strong>.</li>
  <li>Validación mediante <strong>subconsultas</strong>.</li>
</ul>

<h4>Órdenes</h4>
<ul>
  <li>Los usuarios solo ven <strong>sus propias órdenes</strong>.</li>
  <li>Los admins pueden <strong>ver y gestionar todas las órdenes</strong>.</li>
</ul>

<h3>Validaciones</h3>
<ul>
  <li><strong>Tipos de datos:</strong> validados en la base de datos.</li>
  <li><strong>Entrada de usuario:</strong> validada en el frontend.</li>
  <li><strong>Sanitización de datos</strong> para evitar inyección.</li>
  <li><strong>Constraints de integridad referencial</strong> aplicados.</li>
</ul>

<h2>Funcionalidades</h2>

<h3>Para usuarios normales:</h3>
<ul>
  <li>Registro e inicio de sesión (con email o Google)</li>
  <li>Buscar productos por nombre</li>
  <li>Filtrar por categoría</li>
  <li>Agregar al carrito</li>
  <li>Hacer checkout (simulado)</li>
  <li>Ver historial de compras</li>
  <li>Editar perfil</li>
</ul>

<h3>Para administradores:</h3>
<ul>
  <li>Ver estadísticas (total de productos, usuarios, ventas)</li>
  <li>Gestionar productos (crear, editar, eliminar, activar/desactivar)</li>
  <li>Gestionar categorías</li>
  <li>Ver todas las órdenes</li>
  <li>Cambiar estado de órdenes</li>
</ul>

