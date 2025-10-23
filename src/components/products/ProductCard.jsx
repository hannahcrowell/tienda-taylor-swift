import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useState } from "react";

export default function ProductCard({ producto }) {
  const { addItem } = useCartStore();
  const [agregando, setAgregando] = useState(false);

  const handleAddToCart = async () => {
    setAgregando(true);
    await addItem(producto, 1);
    setTimeout(() => setAgregando(false), 1000);
  };

  return (
    <div className="product-card group">
      {/* Imagen */}
      <div className="relative overflow-hidden h-64 bg-gray-100">
        <img
          src={producto.url_imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {producto.inventario <= 5 && producto.inventario > 0 && (
          <div className="absolute top-2 right-2 bg-red-classic text-white text-xs px-2 py-1 rounded-full font-semibold">
            ¡Solo {producto.inventario} disponibles!
          </div>
        )}
        {producto.inventario === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
              {producto.nombre}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {producto.descripcion}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <Star className="text-yellow-400 fill-current" size={16} />
          <span className="text-sm text-gray-600 ml-1">
            {producto.calificacion_promedio.toFixed(1)}
          </span>
        </div>

        {/* Precio y Botón */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-midnights-purple">
            ${producto.precio.toLocaleString("es-MX")} MXN
          </span>
          <button
            onClick={handleAddToCart}
            disabled={producto.inventario === 0 || agregando}
            className="btn-primary text-sm py-2 px-4 flex items-center space-x-2 disabled:opacity-50"
          >
            {agregando ? (
              <span>✓ Agregado</span>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
