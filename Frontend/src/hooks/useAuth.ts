import { useQuery } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

export interface AdminProps {
  _id: string;
  name: string;
  username: string;
  role: "admin" | "super-admin";
  email: string;
  dob?: string;
  phone?: string;
  createdAt: string;
  requirePasswordChange: boolean;
  isActive: boolean;
}

const useAuth = () => {
  return useQuery<AdminProps, AxiosError<APIError>>({
    queryKey: ["admin"],
    queryFn: async () => {
      const res = await api.get("auth/admin");
      return res.data;
    },
  });
};

export default useAuth;
