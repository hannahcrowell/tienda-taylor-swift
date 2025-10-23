import { supabase } from "./supabase";

export const productsService = {
  // Obtener todos los productos activos
  async getProducts(filters = {}) {
    try {
      let query = supabase
        .from("productos")
        .select(
          `
          *,
          categorias (
            id,
            nombre,
            slug
          )
        `
        )
        .eq("esta_activo", true)
        .order("fecha_creacion", { ascending: false });

      // Filtrar por categoría
      if (filters.categoria_id) {
        query = query.eq("categoria_id", filters.categoria_id);
      }

      // Búsqueda por nombre
      if (filters.busqueda) {
        query = query.ilike("nombre", `%${filters.busqueda}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, productos: data || [] };
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return { success: false, error: error.message, productos: [] };
    }
  },

  // Obtener un producto por slug
  async getProductBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from("productos")
        .select(
          `
          *,
          categorias (
            id,
            nombre,
            slug
          )
        `
        )
        .eq("slug", slug)
        .eq("esta_activo", true)
        .single();

      if (error) throw error;

      return { success: true, producto: data };
    } catch (error) {
      console.error("Error al obtener producto:", error);
      return { success: false, error: error.message };
    }
  },

  // Obtener categorías
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("esta_activo", true)
        .order("nombre");

      if (error) throw error;

      return { success: true, categorias: data || [] };
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      return { success: false, error: error.message, categorias: [] };
    }
  },
};
