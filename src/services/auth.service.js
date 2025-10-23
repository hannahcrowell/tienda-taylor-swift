import { supabase } from "./supabase";

export const authService = {
  // Registro con email y contraseña
  async signUp(email, password, fullName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return {
        success: true,
        data,
        message: "Revisa tu email para confirmar tu cuenta",
      };
    } catch (error) {
      console.error("Error en signUp:", error);
      return { success: false, error: error.message };
    }
  },

  // Login con email y contraseña
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error en signIn:", error);
      return { success: false, error: error.message };
    }
  },

  // Login con Google OAuth
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error en signInWithGoogle:", error);
      return { success: false, error: error.message };
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error en signOut:", error);
      return { success: false, error: error.message };
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, user };
    } catch (error) {
      console.error("Error en getCurrentUser:", error);
      return { success: false, error: error.message };
    }
  },

  // Obtener perfil del usuario
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { success: true, profile: data };
    } catch (error) {
      console.error("Error en getProfile:", error);
      return { success: false, error: error.message };
    }
  },

  // Actualizar perfil
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from("perfiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error en updateProfile:", error);
      return { success: false, error: error.message };
    }
  },

  // Escuchar cambios en la autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};
