import { create } from "zustand";
import { readStoredUser } from "@/features/auth/utils/auth-user";

export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt?: unknown;
}

interface AuthStoreState {
  user: User | null;
  authReady: boolean;
  login: (user: User) => void;
  logout: () => void;
  setAuthReady: (authReady: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: readStoredUser(),
  authReady: false,

  login: (user: User) => {
    localStorage.setItem("@u", JSON.stringify(user));
    set({ user, authReady: true });
  },

  logout: () => {
    localStorage.removeItem("@u");
    set({ user: null, authReady: true });
  },

  setAuthReady: (authReady: boolean) => set({ authReady }),
}));
