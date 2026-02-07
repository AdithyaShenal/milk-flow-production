import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>>({
    mutationFn: async () => {
      const res = await api.post("auth/admin/logout");
      return res.data;
    },

    onSuccess: () => {
      queryClient.clear();
      toast.success("Logout Successfully");
      navigate("/");
    },

    onError: () => {
      toast.error("Logout failed");
    },
  });
};

export default useLogout;
