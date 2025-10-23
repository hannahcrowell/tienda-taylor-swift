import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotal, getTotalItems } =
    useCartStore();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-3xl font-display text-gray-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              Agrega algunos productos increíbles de Taylor Swift
            </p>
            <Button onClick={() => navigate("/")}>Explorar Productos</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-display text-gray-900 mb-8">
          🛒 Mi Carrito
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.producto.id}
                className="bg-white rounded-xl shadow-md p-6 flex gap-6"
              >
                {/* Imagen */}
                <img
                  src={item.producto.url_imagen}
                  alt={item.producto.nombre}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {item.producto.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.producto.descripcion?.substring(0, 60)}...
                  </p>
                  <p className="text-xl font-bold text-midnights-purple">
                    ${item.producto.precio.toLocaleString("es-MX")} MXN
                  </p>
                </div>

                {/* Cantidad */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.producto.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.producto.id, item.cantidad - 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.producto.id, item.cantidad + 1)
                      }
                      disabled={item.cantidad >= item.producto.inventario}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-display text-gray-900 mb-6">
                Resumen
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${getTotal().toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-semibold">GRATIS</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-midnights-purple">
                    ${getTotal().toLocaleString("es-MX")} MXN
                  </span>
                </div>
              </div>

              <Button
                className="w-full mb-3"
                onClick={() => navigate("/checkout")}
              >
                Proceder al Pago
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Seguir Comprando
              </Button>

              <div className="mt-6 p-4 bg-lover-pink/10 rounded-lg">
                <p className="text-sm text-gray-700 text-center">
                  🎵 <strong>Envío gratis</strong> en todos los pedidos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
