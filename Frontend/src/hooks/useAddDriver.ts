import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import toast from "react-hot-toast";

export interface CreateDriverProps {
  name: string;
  phone: string;
  driver_license_no: string;
  shortName: string;
}

const useAddDriver = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, CreateDriverProps>({
    mutationFn: async (payload) => {
      const res = await api.post("/driver", payload);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      options?.onSuccess?.();
      toast.success("Driver added successfully");
    },
  });
};

export default useAddDriver;
