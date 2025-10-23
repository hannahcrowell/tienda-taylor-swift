import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../services/supabase";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      // Agregar producto al carrito
      addItem: async (producto, cantidad = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.producto.id === producto.id
        );

        if (existingItem) {
          // Si ya existe, aumentar cantidad
          set({
            items: items.map((item) =>
              item.producto.id === producto.id
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            ),
          });
        } else {
          // Si no existe, agregar nuevo
          set({
            items: [...items, { producto, cantidad }],
          });
        }

        return { success: true };
      },

      // Actualizar cantidad de un item
      updateQuantity: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.producto.id === productoId ? { ...item, cantidad } : item
          ),
        });
      },

      // Eliminar item del carrito
      removeItem: (productoId) => {
        set({
          items: get().items.filter((item) => item.producto.id !== productoId),
        });
      },

      // Limpiar carrito
      clearCart: () => {
        set({ items: [] });
      },

      // Obtener total del carrito
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.producto.precio * item.cantidad,
          0
        );
      },

      // Obtener cantidad total de items
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
      },

      // Sincronizar carrito con Supabase (para usuarios autenticados)
      syncWithSupabase: async (userId) => {
        if (!userId) return;

        try {
          set({ loading: true });

          // Obtener o crear carrito
          let { data: carrito, error } = await supabase
            .from("carritos")
            .select("id")
            .eq("usuario_id", userId)
            .single();

          if (error && error.code === "PGRST116") {
            // Crear carrito si no existe
            const { data: newCarrito, error: createError } = await supabase
              .from("carritos")
              .insert({ usuario_id: userId })
              .select()
              .single();

            if (createError) throw createError;
            carrito = newCarrito;
          } else if (error) {
            throw error;
          }

          // Sincronizar items
          const items = get().items;
          if (items.length > 0) {
            // Eliminar items anteriores
            await supabase
              .from("items_carrito")
              .delete()
              .eq("carrito_id", carrito.id);

            // Insertar nuevos items
            const itemsToInsert = items.map((item) => ({
              carrito_id: carrito.id,
              producto_id: item.producto.id,
              cantidad: item.cantidad,
            }));

            await supabase.from("items_carrito").insert(itemsToInsert);
          }

          set({ loading: false });
          return { success: true };
        } catch (error) {
          console.error("Error al sincronizar carrito:", error);
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },

      // Cargar carrito desde Supabase
      loadFromSupabase: async (userId) => {
        if (!userId) return;

        try {
          set({ loading: true });

          const { data: carrito, error } = await supabase
            .from("carritos")
            .select(
              `
              id,
              items_carrito (
                id,
                cantidad,
                productos (*)
              )
            `
            )
            .eq("usuario_id", userId)
            .single();

          if (error && error.code !== "PGRST116") throw error;

          if (carrito?.items_carrito) {
            const items = carrito.items_carrito.map((item) => ({
              producto: item.productos,
              cantidad: item.cantidad,
            }));
            set({ items });
          }

          set({ loading: false });
          return { success: true };
        } catch (error) {
          console.error("Error al cargar carrito:", error);
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: "taylor-swift-cart", // Nombre para localStorage
      partialize: (state) => ({ items: state.items }), // Solo guardar items
    }
  )
);
