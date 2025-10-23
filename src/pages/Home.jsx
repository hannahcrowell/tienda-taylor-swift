import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductList from "../components/products/ProductList";
import { useProductStore } from "../store/productStore";

export default function Home() {
  const {
    productos,
    categorias,
    loading,
    fetchProductos,
    fetchCategorias,
    setFiltros,
  } = useProductStore();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    setFiltros({ busqueda });
  };

  const handleCategoriaClick = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    setFiltros({ categoria_id: categoriaId });
  };

  const handleLimpiarFiltros = () => {
    setCategoriaSeleccionada(null);
    setBusqueda("");
    setFiltros({ categoria_id: null, busqueda: "" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-midnights-purple via-midnights-blue to-1989-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-display mb-4">
            🎵 Taylor Swift Official Store
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Encuentra todo el merch oficial de Taylor Swift
          </p>

          {/* Búsqueda */}
          <form onSubmit={handleBuscar} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-midnights-purple px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              onClick={handleLimpiarFiltros}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                !categoriaSeleccionada
                  ? "bg-midnights-purple text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => handleCategoriaClick(categoria.id)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  categoriaSeleccionada === categoria.id
                    ? "bg-midnights-purple text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display text-gray-900">
            {categoriaSeleccionada
              ? categorias.find((c) => c.id === categoriaSeleccionada)?.nombre
              : "Todos los Productos"}
          </h2>
          <p className="text-gray-600">
            {productos.length} producto{productos.length !== 1 ? "s" : ""}
          </p>
        </div>

        <ProductList
          productos={productos}
          loading={loading}
          onRetry={fetchProductos}
        />
      </section>
    </Layout>
  );
}
