import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import useLogin from "../hooks/useLogin";
import { useLottie } from "lottie-react";
import loadingAnimation from "../assets/logo.json";
import LoginImage from "../assets/images/Login_Image_2.webp";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

type LoginData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isError, error, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const submitHandler = (data: LoginData) => {
    login(data);
  };

  const options = {
    animationData: loadingAnimation,
    loop: true,
    style: {
      height: 130,
      width: 130,
    },
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View } = useLottie(options);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-12">
            {/* Heading */}
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                Milk Flow
              </h1>
              <p className="text-base font-medium text-gray-700">
                Logistic System
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-gray-500 leading-relaxed">
              Sign in to your account to manage and optimize your dairy supply
              chain
            </p>
          </div>

          {/* Demo Credentials Banner */}
          <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Demo Account
                </h3>
                <p className="text-xs text-blue-700 mb-3">
                  Use these credentials to explore the system:
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-blue-800 w-20">
                      Username:
                    </span>
                    <code className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-900 font-mono">
                      shenal
                    </code>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-blue-800 w-20">
                      Password:
                    </span>
                    <code className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-900 font-mono">
                      12345678
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Authentication failed
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {error?.response?.data.message}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                {...register("username")}
                placeholder="Enter your username"
                type="text"
                className={`
                    input
                    w-full
                    bg-white
                    border ${errors.password ? "border-red-300" : ""}
                    px-4 pr-12
                    outline-none
                    transition-all
                    focus:ring-4 focus:ring-blue-500/10
                    ${errors.password ? "focus:border-red-500 focus:ring-red-500/10" : ""}
                  `}
              />
              {errors.username && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`
                    input
                    w-full
                    bg-white
                    border ${errors.password ? "border-red-300" : ""}
                    px-4 pr-12
                    outline-none
                    transition-all
                    focus:ring-4 focus:ring-blue-500/10
                    ${errors.password ? "focus:border-red-500 focus:ring-red-500/10" : ""}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="
                btn
                btn-primary
                w-full
                transition-all
                disabled:bg-blue-300 
                disabled:cursor-not-allowed
              "
            >
              {isPending && <span className="loading loading-spinner"></span>}
              Log in
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2026 Milk Flow. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Hero Image/Illustration */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: `url(${LoginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay for better text readability */}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <div className="flex flex-col text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-12 max-w-xl">
            {/* Illustration/Icon */}
            <div className="flex w-full justify-center items-center mb-6">
              {View}
            </div>

            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
              Welcome to Milk Flow
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Streamline your dairy management with our comprehensive platform.
              Track, analyze, and optimize your operations all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
