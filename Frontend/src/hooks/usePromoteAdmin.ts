import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import toast from "react-hot-toast";

const usePromoteAdmin = (options?: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, string>({
    mutationFn: async (adminId) => {
      const res = await api.patch(`/auth/admin/${adminId}/promote`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins", "all"] });
      options?.onSuccess();
      toast.success("Admin Promoted to Super Admin");
    },
  });
};

export default usePromoteAdmin;
