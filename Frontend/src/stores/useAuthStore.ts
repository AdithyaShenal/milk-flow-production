import { create } from "zustand";
import type { AdminProps } from "../hooks/useAuth";

interface AuthStore {
  user: AdminProps;
  setUser: (user: AdminProps) => void;
  resetUser: () => void;
}

const initUser: AdminProps = {
  _id: "",
  name: "",
  username: "",
  role: "admin",
  email: "",
  dob: "",
  phone: "",
  createdAt: "",
  requirePasswordChange: false,
  isActive: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: initUser,

  setUser: (user) =>
    set({
      user,
    }),

  resetUser: () =>
    set({
      user: initUser,
    }),
}));

export default useAuthStore;
