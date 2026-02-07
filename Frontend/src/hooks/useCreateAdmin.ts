import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import toast from "react-hot-toast";

export interface CreateAdminProps {
  username: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
}

const useCreateAdmin = (options?: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, CreateAdminProps>({
    mutationFn: async (payload) => {
      const res = await api.post("/auth/admin", payload);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins", "all"] });
      options?.onSuccess();
      toast.success("Admin Cretaed successfully");
    },
  });
};

export default useCreateAdmin;
