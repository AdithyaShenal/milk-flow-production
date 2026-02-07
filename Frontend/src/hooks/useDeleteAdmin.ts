import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

const useDeleteAdmin = (options: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, string>({
    mutationFn: async (adminId) => {
      const res = await api.delete(`/auth/admin/${adminId}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins", "all"] });
      options.onSuccess?.();
      toast.success("Admin deleted successfully");
    },
  });
};

export default useDeleteAdmin;
