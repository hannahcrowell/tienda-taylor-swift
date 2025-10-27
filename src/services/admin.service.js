import { supabase } from "./supabase";

export const adminService = {
  // ============ PRODUCTOS ============
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from("productos")
        .insert([
          {
            nombre: productData.nombre,
            slug: productData.slug,
            descripcion: productData.descripcion,
            precio: productData.precio,
            inventario: productData.stock,
            url_imagen: productData.imagen_url,
            categoria_id: productData.categoria_id,
            esta_activo: productData.esta_activo,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error al crear producto:", error);
      return { success: false, error: error.message };
    }
  },

  async updateProduct(id, updates) {
    try {
      const productData = {
        nombre: updates.nombre,
        slug: updates.slug,
        descripcion: updates.descripcion,
        precio: updates.precio,
        inventario: updates.stock,
        url_imagen: updates.imagen_url,
        categoria_id: updates.categoria_id,
        esta_activo: updates.esta_activo,
      };

      const { data, error } = await supabase
        .from("productos")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return { success: false, error: error.message };
    }
  },

  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from("productos")
        .update({ esta_activo: false })
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return { success: false, error: error.message };
    }
  },

  async getAllProducts() {
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
        .order("fecha_creacion", { ascending: false });

      if (error) throw error;

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

  // ============ CATEGORÍAS ============
  async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error al crear categoría:", error);
      return { success: false, error: error.message };
    }
  },

  async updateCategory(id, updates) {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      return { success: false, error: error.message };
    }
  },

  async deleteCategory(id) {
    try {
      const { error } = await supabase
        .from("categorias")
        .update({ esta_activo: false })
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      return { success: false, error: error.message };
    }
  },

  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("nombre");

      if (error) throw error;
      return { success: true, categorias: data || [] };
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      return { success: false, error: error.message, categorias: [] };
    }
  },

  // ============ ÓRDENES ============
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from("ordenes")
        .select(
          `
          id,
          total,
          estado,
          fecha_creacion,
          fecha_modificacion,
          usuario_id,
          perfiles (
            id,
            nombre_completo,
            email
          )`
        )
        .order("fecha_creacion", { ascending: false });

      if (error) throw error;
      return { success: true, ordenes: data || [] };
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      return { success: false, error: error.message, ordenes: [] };
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const { data, error } = await supabase
        .from("ordenes")
        .update({
          estado: newStatus,
          fecha_modificacion: new Date(),
        })
        .eq("id", orderId)
        .select();

      if (error) throw error;

      if (!data) {
        return { success: false, message: "No se encontró la orden." };
      }

      return { success: true, orden: data };
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      return { success: false, error: error.message };
    }
  },

  // ============ ESTADÍSTICAS ============
  async getStats() {
    try {
      console.log("📊 Obteniendo estadísticas...");

      // Total de productos activos
      const { count: productosCount, error: errorProductos } = await supabase
        .from("productos")
        .select("*", { count: "exact", head: true })
        .eq("esta_activo", true);

      console.log("📦 Productos activos:", productosCount, errorProductos);

      // Total de órdenes
      const { count: ordenesCount, error: errorOrdenes } = await supabase
        .from("ordenes")
        .select("*", { count: "exact", head: true });

      console.log("🛒 Total órdenes:", ordenesCount, errorOrdenes);

      // Total de ventas
      const { data: ventasData, error: errorVentas } = await supabase
        .from("ordenes")
        .select("total");

      console.log("💰 Datos de ventas:", ventasData, errorVentas);

      const totalVentas =
        ventasData?.reduce((sum, orden) => {
          const total = parseFloat(orden.total) || 0;
          return sum + total;
        }, 0) || 0;

      console.log("💵 Total ventas calculado:", totalVentas);

      // Total de usuarios
      const { count: usuariosCount, error: errorUsuarios } = await supabase
        .from("perfiles")
        .select("*", { count: "exact", head: true });

      console.log("👥 Total usuarios:", usuariosCount, errorUsuarios);

      const stats = {
        productos: productosCount || 0,
        ordenes: ordenesCount || 0,
        ventas: totalVentas,
        usuarios: usuariosCount || 0,
      };

      console.log("✅ Estadísticas finales:", stats);

      return {
        success: true,
        stats: stats,
      };
    } catch (error) {
      console.error("❌ Error al obtener estadísticas:", error);
      return {
        success: false,
        error: error.message,
        stats: { productos: 0, ordenes: 0, ventas: 0, usuarios: 0 },
      };
    }
  },
};
