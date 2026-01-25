import { useQuery } from "@tanstack/react-query";
import { api } from "../services/apiClient";

const useGetConfigurations = () => {
  return useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const res = await api.get("/config");
      return res.data;
    },
  });
};

export default useGetConfigurations;
