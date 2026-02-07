import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore";
import type { AdminProps } from "./useAuth";

interface Credentials {
  username: string;
  password: string;
}

const useLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  return useMutation<AdminProps, AxiosError<APIError>, Credentials>({
    mutationFn: async (credentials) => {
      const res = await api.post("auth/admin/login", credentials);
      return res.data;
    },

    onSuccess: (data: AdminProps) => {
      setUser(data);

      if (data.requirePasswordChange === true) {
        navigate("/password-reset");
      } else {
        toast.success("Login Successfull");
        navigate("/app");
      }
    },
  });
};

export default useLogin;
