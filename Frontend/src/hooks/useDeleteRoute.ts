import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";

const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (route_id: string) => {
      const res = await api.delete(`/routing/routes/${route_id}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes", "dispatched"] });
      queryClient.invalidateQueries({ queryKey: ["routes", "InProgress"] });
    },
  });
};

export default useDeleteRoute;
