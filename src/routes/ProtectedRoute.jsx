import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loading from "../components/common/Loading";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuthStore();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && profile?.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
