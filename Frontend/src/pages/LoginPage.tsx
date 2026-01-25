import { useState } from "react";
import bg from "../assets/images/login-bg.jpg";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div
        className="
          relative z-10
          w-full max-w-md
          bg-white/20
          backdrop-blur-xl
          border border-white/30
          rounded-2xl
          p-8
          shadow-2xl
          text-white
        "
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
            🥛
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <h2 className="text-3xl font-extrabold text-center mt-1">DairyFlow</h2>
        <p className="text-sm text-white/80 text-center mt-2">
          Milindu Dairy Products
        </p>

        <p className="text-sm text-white/70 text-center mt-4">
          Sign in to manage milk collection, logistics, and production data
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="name@milindu.lk"
              className="
                mt-1 w-full h-12 rounded-xl
                bg-white/10
                border border-white/30
                px-4
                text-white
                placeholder:text-white/50
                outline-none
                focus:border-blue-400
                focus:ring-2 focus:ring-blue-400/50
              "
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="
                  w-full h-12 rounded-xl
                  bg-white/10
                  border border-white/30
                  px-4 pr-16
                  text-white
                  placeholder:text-white/50
                  outline-none
                  focus:border-blue-400
                  focus:ring-2 focus:ring-blue-400/50
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/80">
              <input type="checkbox" className="accent-blue-500" />
              Remember me
            </label>
            <a href="#" className="text-blue-300 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="
              w-full h-12 rounded-xl font-semibold
              bg-linear-to-r from-blue-500 to-cyan-400
              hover:from-blue-600 hover:to-cyan-500
              shadow-lg shadow-blue-500/30
              transition-all duration-300
            "
          >
            Login
          </button>
        </form>

        <p className="text-xs text-white/60 text-center mt-6">
          © 2026 Milindu Dairy Products
        </p>
      </div>
    </div>
  );
}
