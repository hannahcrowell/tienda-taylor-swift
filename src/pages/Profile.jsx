import { useState, useEffect } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuthStore } from "../store/authStore";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Profile() {
  const { user, profile, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nombre_completo: profile.nombre_completo || "",
        telefono: profile.telefono || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-midnights-purple rounded-full flex items-center justify-center">
                <User className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-display text-gray-900">
                  Mi Perfil
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <span className="mr-2">✓</span>
                Perfil actualizado correctamente
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg">
                    <Mail className="text-gray-500" size={20} />
                    <span className="text-gray-700">{user?.email}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    El email no puede ser modificado
                  </p>
                </div>

                <Input
                  name="nombre_completo"
                  label="Nombre Completo"
                  placeholder="Taylor Swift"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  disabled={loading}
                />

                <Input
                  name="telefono"
                  label="Teléfono"
                  type="tel"
                  placeholder="555-123-4567"
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Save size={20} />
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>

            {/* Profile Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Información de Cuenta
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {profile?.rol === "admin" ? "👑 Admin" : "👤 Usuario"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Miembro desde:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(profile?.fecha_creacion).toLocaleDateString(
                      "es-MX",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
