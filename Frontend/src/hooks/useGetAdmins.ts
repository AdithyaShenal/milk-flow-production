import { useQuery } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AdminProps } from "./useAuth";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

const useGetAdmins = () => {
  return useQuery<AdminProps[], AxiosError<APIError>>({
    queryKey: ["admins", "all"],
    queryFn: async () => {
      const res = await api.get("/auth/admin/all");
      return res.data;
    },
  });
};

export default useGetAdmins;
