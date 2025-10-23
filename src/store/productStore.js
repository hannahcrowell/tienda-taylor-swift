import { create } from "zustand";
import { productsService } from "../services/products.service";

export const useProductStore = create((set, get) => ({
  productos: [],
  categorias: [],
  loading: false,
  error: null,
  filtros: {
    categoria_id: null,
    busqueda: "",
  },

  // Cargar productos
  fetchProductos: async (filters = {}) => {
    set({ loading: true, error: null });

    const result = await productsService.getProducts(filters);

    if (result.success) {
      set({ productos: result.productos, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }

    return result;
  },

  // Cargar categorías
  fetchCategorias: async () => {
    const result = await productsService.getCategories();

    if (result.success) {
      set({ categorias: result.categorias });
    }

    return result;
  },

  // Actualizar filtros
  setFiltros: (filtros) => {
    set({ filtros: { ...get().filtros, ...filtros } });
    get().fetchProductos(get().filtros);
  },

  // Limpiar filtros
  clearFiltros: () => {
    set({ filtros: { categoria_id: null, busqueda: "" } });
    get().fetchProductos();
  },

  // Buscar producto por slug
  getProductBySlug: async (slug) => {
    return await productsService.getProductBySlug(slug);
  },
}));
