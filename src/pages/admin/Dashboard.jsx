import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/admin.service";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import { Package, ShoppingBag, DollarSign, Users } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    console.log("🔄 Dashboard: Cargando estadísticas...");
    setIsLoading(true);
    setError(null);

    const result = await adminService.getStats();
    console.log("📊 Dashboard: Resultado de getStats:", result);

    if (result.success) {
      console.log("✅ Dashboard: Stats cargadas:", result.stats);
      setStats(result.stats);
    } else {
      console.error("❌ Dashboard: Error al cargar stats:", result.error);
      setError(result.error);
    }
    setIsLoading(false);
  };

  if (isLoading) return <Loading message="Cargando estadísticas..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadStats} />;

  const cards = [
    {
      title: "Total Productos",
      value: stats?.productos || 0,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Total Órdenes",
      value: stats?.ordenes || 0,
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      title: "Ventas Totales",
      value: `$${(stats?.ventas || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
    {
      title: "Total Usuarios",
      value: stats?.usuarios || 0,
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  console.log("🎴 Dashboard: Cards a renderizar:", cards);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-display font-bold text-midnights-purple">
          Dashboard de Administración
        </h1>
        <button onClick={loadStats} className="btn-secondary text-sm py-2 px-4">
          🔄 Actualizar
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-display font-bold mb-4">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/productos"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-midnights-purple transition-colors"
          >
            <Package className="text-midnights-purple mb-2" size={32} />
            <h3 className="font-semibold text-lg">Gestionar Productos</h3>
            <p className="text-gray-600 text-sm">
              Crear, editar y eliminar productos
            </p>
          </Link>

          <Link
            to="/admin/categorias"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-midnights-purple transition-colors"
          >
            <ShoppingBag className="text-midnights-purple mb-2" size={32} />
            <h3 className="font-semibold text-lg">Gestionar Categorías</h3>
            <p className="text-gray-600 text-sm">
              Organizar categorías de productos
            </p>
          </Link>

          <Link
            to="/admin/ordenes"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-midnights-purple transition-colors"
          >
            <DollarSign className="text-midnights-purple mb-2" size={32} />
            <h3 className="font-semibold text-lg">Ver Órdenes</h3>
            <p className="text-gray-600 text-sm">
              Gestionar pedidos de clientes
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
