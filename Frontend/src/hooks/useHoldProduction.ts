import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";

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
      queryClient.invalidateQueries({ queryKey: ["productions"] });
      options.onSuccess();
    },
  });
};

export default useHoldProduction;
