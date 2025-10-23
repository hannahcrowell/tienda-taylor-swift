import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { Music } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const result = await signUp(
      formData.email,
      formData.password,
      formData.fullName
    );

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setError(result.error);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lover-pink via-midnights-purple to-1989-blue flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-display text-gray-900 mb-2">
              ¡Registro Exitoso!
            </h2>
            <p className="text-gray-600">
              Revisa tu email para confirmar tu cuenta.
            </p>
          </div>
          <p className="text-sm text-gray-500">Redirigiendo a login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lover-pink via-midnights-purple to-1989-blue flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Music className="text-midnights-purple" size={48} />
          </div>
          <h1 className="text-3xl font-display text-midnights-purple mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">Únete a la familia Swiftie</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="fullName"
            label="Nombre Completo"
            placeholder="Taylor Swift"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="taylor@swift.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="password"
            name="password"
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="text-midnights-purple font-semibold hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
