import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { AxiosError } from "axios";

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  checkAdminStatus: async () => {
    // Don't check again if already loading
    if (get().isLoading) return;
    
    set({ isLoading: true, error: null });

    try {
      console.log("Checking admin status...");
      const response = await axiosInstance.get("/api/admin/check");
      console.log("Admin check response:", response.data);
      set({ isAdmin: response.data.admin });
    } catch (error: unknown) {
      console.error("Error checking admin status:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      
      // Handle specific error cases
      if (axiosError.response?.status === 401) {
        set({
          isAdmin: false,
          error: "Authentication required. Please log in again.",
        });
      } else if (axiosError.response?.status === 403) {
        set({
          isAdmin: false,
          error: "Admin access required.",
        });
      } else {
      set({
        isAdmin: false,
        error: axiosError.response?.data?.message || "An error occurred",
      });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({ isAdmin: false, isLoading: false, error: null }),
}));
