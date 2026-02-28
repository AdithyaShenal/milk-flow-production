import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import toast from "react-hot-toast";

interface Props {
  onSuccess: () => void;
}

const useHoldProduction = (options: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productionId: string) => {
      const res = await api.patch(`/production/block/${productionId}`);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Production Status Changed");
      queryClient.invalidateQueries({ queryKey: ["productions"] });
      options.onSuccess();
    },

    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "Operation Failed");
    },
  });
};

export default useHoldProduction;
