import { useMutation } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export interface ResetPasswordProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const useResetPassword = (options?: { onSuccess: () => void }) => {
  const navigate = useNavigate();

  return useMutation<unknown, AxiosError<APIError>, ResetPasswordProps>({
    mutationFn: async (payload) => {
      const res = await api.post("/auth/admin/change-password", payload);
      return res.data;
    },

    onSuccess: () => {
      options?.onSuccess();
      toast.success("Password Reset Successful");
      navigate("/app");
    },
  });
};

export default useResetPassword;
