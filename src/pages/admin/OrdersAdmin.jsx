import { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function OrdersAdmin() {
  const [ordenes, setOrdenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    const result = await adminService.getAllOrders();

    if (result.success) {
      setOrdenes(result.ordenes);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await adminService.updateOrderStatus(orderId, newStatus);

    if (result.success) {
      alert("Estado actualizado");
      loadOrders();
    } else {
      alert("Error: " + result.error);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={loadOrders} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold text-midnights-purple mb-8">
        Gestión de Órdenes
      </h1>

      {ordenes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600">No hay órdenes registradas</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td className="px-6 py-4 font-mono text-sm">
                    #{orden.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    {orden.perfiles?.nombre_completo ||
                      orden.perfiles?.email ||
                      "Usuario"}
                  </td>
                  <td className="px-6 py-4 font-semibold">${orden.total}</td>
                  <td className="px-6 py-4">
                    <select
                      value={orden.estado}
                      onChange={(e) =>
                        handleStatusChange(orden.id, e.target.value)
                      }
                      className="input-field py-1 text-sm"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="enviada">Enviada</option>
                      <option value="entregada">Entregada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(orden.fecha_creacion).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
