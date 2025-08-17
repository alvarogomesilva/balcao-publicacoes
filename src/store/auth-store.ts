import { create } from "zustand";

export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface AuthStoreState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: JSON.parse(localStorage.getItem("@u") || "null"),

  login: (user: User) => {
    localStorage.setItem("@u", JSON.stringify(user)); // salva no storage
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("@u"); // limpa storage
    set({ user: null });
  },
}));
