import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loading from "../components/common/Loading";

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuthStore();

  // Mostrar loading mientras se carga la sesión
  if (loading) {
    return <Loading message="Verificando permisos..." />;
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario es admin
  const isAdmin = profile?.rol === "admin";

  console.log("AdminRoute - Usuario:", user?.email);
  console.log("AdminRoute - Profile:", profile);
  console.log("AdminRoute - Es Admin:", isAdmin);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-8">
            No tienes permisos para acceder a esta sección.
          </p>
          <a href="/" className="btn-primary">
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return children;
}
