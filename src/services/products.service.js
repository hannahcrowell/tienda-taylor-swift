import { supabase } from "./supabase";

export const productsService = {
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

      if (filters.categoria_id) {
        query = query.eq("categoria_id", filters.categoria_id);
      }

      if (filters.busqueda) {
        query = query.ilike("nombre", `%${filters.busqueda}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Mapear inventario → stock y url_imagen → imagen_url
      const productos =
        data?.map((p) => ({
          ...p,
          stock: p.inventario,
          imagen_url: p.url_imagen,
        })) || [];

      return { success: true, productos };
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return { success: false, error: error.message, productos: [] };
    }
  },

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

      // Mapear campos
      const producto = {
        ...data,
        stock: data.inventario,
        imagen_url: data.url_imagen,
      };

      return { success: true, producto };
    } catch (error) {
      console.error("Error al obtener producto:", error);
      return { success: false, error: error.message };
    }
  },

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
