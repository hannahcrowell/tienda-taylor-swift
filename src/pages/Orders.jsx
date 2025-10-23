import { useEffect, useState } from "react";
import { Package, Calendar, MapPin, CreditCard } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../services/supabase";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Orders() {
  const { user } = useAuthStore();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrdenes();
  }, [user]);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("ordenes")
        .select(
          `
          *,
          direcciones (*),
          items_orden (
            *,
            productos (*)
          )
        `
        )
        .eq("usuario_id", user.id)
        .order("fecha_creacion", { ascending: false });

      if (fetchError) throw fetchError;

      setOrdenes(data || []);
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
      setError("Error al cargar tus órdenes");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: "bg-yellow-100 text-yellow-800",
      confirmada: "bg-blue-100 text-blue-800",
      enviada: "bg-purple-100 text-purple-800",
      entregada: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800",
    };
    return colores[estado] || "bg-gray-100 text-gray-800";
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      pendiente: "⏳ Pendiente",
      confirmada: "✓ Confirmada",
      enviada: "🚚 En Camino",
      entregada: "✓ Entregada",
      cancelada: "✗ Cancelada",
    };
    return textos[estado] || estado;
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <ErrorMessage message={error} onRetry={fetchOrdenes} />
        </div>
      </Layout>
    );
  }

  if (ordenes.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-3xl font-display text-gray-900 mb-4">
              No tienes órdenes
            </h2>
            <p className="text-gray-600 mb-8">
              Cuando realices una compra, aparecerá aquí
            </p>
            <a href="/" className="btn-primary inline-block">
              Explorar Productos
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-display text-gray-900 mb-8">
          📦 Mis Órdenes
        </h1>

        <div className="space-y-6">
          {ordenes.map((orden) => (
            <div
              key={orden.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Header de la orden */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Orden</p>
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        #{orden.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-gray-300"></div>
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar size={14} />
                        Fecha
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(orden.fecha_creacion).toLocaleDateString(
                          "es-MX",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getEstadoColor(
                        orden.estado
                      )}`}
                    >
                      {getEstadoTexto(orden.estado)}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-xl font-bold text-midnights-purple">
                        ${orden.total.toLocaleString("es-MX")} MXN
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {orden.items_orden.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.productos.url_imagen}
                        alt={item.productos.nombre}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.productos.nombre}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.cantidad}
                        </p>
                        <p className="text-sm font-bold text-midnights-purple">
                          ${item.precio.toLocaleString("es-MX")} MXN c/u
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          $
                          {(item.precio * item.cantidad).toLocaleString(
                            "es-MX"
                          )}{" "}
                          MXN
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dirección de envío */}
              {orden.direcciones && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-500 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        Dirección de Envío
                      </p>
                      <p className="text-sm text-gray-700">
                        {orden.direcciones.calle}
                      </p>
                      <p className="text-sm text-gray-700">
                        {orden.direcciones.ciudad}, {orden.direcciones.estado}{" "}
                        {orden.direcciones.codigo_postal}
                      </p>
                      <p className="text-sm text-gray-700">
                        {orden.direcciones.pais}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
