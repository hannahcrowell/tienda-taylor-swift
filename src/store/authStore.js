import { create } from "zustand";
import { authService } from "../services/auth.service";

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  initialized: false, // ← NUEVO

  // Inicializar autenticación
  initialize: async () => {
    // Evitar inicializar múltiples veces
    if (get().initialized) return; // ← NUEVO

    set({ loading: true });

    try {
      const { user } = await authService.getCurrentUser();

      if (user) {
        const { profile } = await authService.getProfile(user.id);
        set({ user, profile, loading: false, initialized: true }); // ← NUEVO
      } else {
        set({ user: null, profile: null, loading: false, initialized: true }); // ← NUEVO
      }
    } catch (error) {
      console.error("Error en initialize:", error);
      set({ user: null, profile: null, loading: false, initialized: true }); // ← NUEVO
    }

    // Escuchar cambios de autenticación
    authService.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", event); // ← NUEVO para debug

      if (session?.user) {
        const { profile } = await authService.getProfile(session.user.id);
        set({ user: session.user, profile });
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  // Iniciar sesión
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const result = await authService.signIn(email, password);

    if (result.success) {
      const { profile } = await authService.getProfile(result.data.user.id);
      set({ user: result.data.user, profile, loading: false });
      return result;
    } else {
      set({ error: result.error, loading: false });
      return result;
    }
  },

  // Login con Google
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    const result = await authService.signInWithGoogle();
    set({ loading: false });
    return result;
  },

  // Registrarse
  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null });
    const result = await authService.signUp(email, password, fullName);

    if (result.success) {
      set({ loading: false });
      return result;
    } else {
      set({ error: result.error, loading: false });
      return result;
    }
  },

  // Cerrar sesión
  signOut: async () => {
    set({ loading: true });
    await authService.signOut();
    set({ user: null, profile: null, loading: false });
  },

  // Actualizar perfil
  updateProfile: async (updates) => {
    const userId = get().user?.id;
    if (!userId) return { success: false, error: "No hay usuario autenticado" };

    set({ loading: true });
    const result = await authService.updateProfile(userId, updates);

    if (result.success) {
      set({ profile: result.data, loading: false });
    } else {
      set({ loading: false });
    }

    return result;
  },

  // Verificar si es admin
  isAdmin: () => {
    return get().profile?.rol === "admin";
  },
}));
