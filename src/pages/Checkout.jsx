import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { supabase } from "../services/supabase";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    calle: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    pais: "México",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Crear dirección
      const { data: direccion, error: direccionError } = await supabase
        .from("direcciones")
        .insert({
          usuario_id: user.id,
          ...formData,
        })
        .select()
        .single();

      if (direccionError) throw direccionError;

      // 2. Crear orden
      const { data: orden, error: ordenError } = await supabase
        .from("ordenes")
        .insert({
          usuario_id: user.id,
          direccion_id: direccion.id,
          total: getTotal(),
          estado: "pendiente",
        })
        .select()
        .single();

      if (ordenError) throw ordenError;

      // 3. Crear items de la orden
      const itemsOrden = items.map((item) => ({
        orden_id: orden.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio,
      }));

      const { error: itemsError } = await supabase
        .from("items_orden")
        .insert(itemsOrden);

      if (itemsError) throw itemsError;

      // 4. Actualizar inventario
      for (const item of items) {
        const { error: updateError } = await supabase
          .from("productos")
          .update({
            inventario: item.producto.inventario - item.cantidad,
          })
          .eq("id", item.producto.id);

        if (updateError) throw updateError;
      }

      // 5. Limpiar carrito
      clearCart();

      // 6. Redirigir a confirmación
      navigate("/ordenes");
    } catch (err) {
      console.error("Error al crear orden:", err);
      setError("Hubo un error al procesar tu orden. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/carrito");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-display text-gray-900 mb-8">
          💳 Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-display text-gray-900 mb-6">
                Dirección de Envío
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="calle"
                  label="Calle y Número"
                  placeholder="Av. Paseo de la Reforma 222"
                  value={formData.calle}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="ciudad"
                    label="Ciudad"
                    placeholder="Ciudad de México"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="estado"
                    label="Estado"
                    placeholder="CDMX"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="codigo_postal"
                    label="Código Postal"
                    placeholder="06600"
                    value={formData.codigo_postal}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="pais"
                    label="País"
                    value={formData.pais}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="pt-6">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Procesando..." : "Confirmar Pedido"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-display text-gray-900 mb-6">
                Tu Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.producto.id} className="flex gap-3">
                    <img
                      src={item.producto.url_imagen}
                      alt={item.producto.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">
                        {item.producto.nombre}
                      </p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.cantidad}
                      </p>
                      <p className="text-sm font-bold text-midnights-purple">
                        $
                        {(item.producto.precio * item.cantidad).toLocaleString(
                          "es-MX"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-6" />

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getTotal().toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-semibold">GRATIS</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-midnights-purple">
                    ${getTotal().toLocaleString("es-MX")} MXN
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
