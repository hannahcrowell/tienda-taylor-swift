import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";

// Paginas de Admin
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";

// Protector de Rutas
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Loading
import Loading from "./components/common/Loading";

function App() {
  const { initialize, loading, user } = useAuthStore();
  const { loadFromSupabase } = useCartStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (user) {
      loadFromSupabase(user.id);
    }
  }, [user]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Estas son rutas publicas*/}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Protegidas */}
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordenes"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <AdminRoute>
              <ProductsAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <AdminRoute>
              <CategoriesAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/ordenes"
          element={
            <AdminRoute>
              <OrdersAdmin />
            </AdminRoute>
          }
        />

        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
