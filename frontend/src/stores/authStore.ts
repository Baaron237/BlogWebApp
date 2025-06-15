import create from "zustand";

interface AuthState {
  user: any | null;
  isAdmin: boolean;
  initialized: boolean;
  loading: boolean;
  login: (
    username: string,
    password: string,
    isAdmin: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  initialized: false,
  loading: false,

  login: async (username: string, password: string, isAdmin: boolean) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) throw error;

      set({
        user: data.user,
        isAdmin: isAdmin,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAdmin: false });
  },

  checkAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        set({
          user: session.user,
          isAdmin: userData?.is_admin || false,
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }
    } catch (error) {
      set({ initialized: true });
      console.error("Auth check failed:", error);
    }
  },
}));
