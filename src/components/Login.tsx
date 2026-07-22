import React, { useState } from "react";
import { Compass, User, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (user: { username: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    try {
      // 1. Attempt server API authentication if endpoint is present
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUser, password: trimmedPass }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          onLoginSuccess({ username: data.user?.username || trimmedUser });
          return;
        }
      }
    } catch (err) {
      console.warn("Server auth API unavailable, attempting client env check:", err);
    } finally {
      setLoading(false);
    }

    // 2. Client-side env fallback check
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
    const envUser = metaEnv.VITE_ADMIN_USERNAME;
    const envPass = metaEnv.VITE_ADMIN_PASSWORD;

    if (trimmedUser === envUser && trimmedPass === envPass) {
      onLoginSuccess({ username: trimmedUser });
    } else {
      setError("Invalid username or password. Please verify credentials.");
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-[200] flex items-center justify-center bg-slate-950/25 p-4 font-sans select-none animate-fadeIn">
      {/* Transparent Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/90 border border-white/60 dark:border-slate-700/60 shadow-2xl rounded-3xl p-8 transition-all relative overflow-hidden">
        {/* Subtle decorative glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Compass className="w-8 h-8 text-indigo-600 dark:text-indigo-400 stroke-[1.75]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bageshwar Geoportal
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-xs">
            Authorized Access Only. Please sign in to explore interactive district maps & planners.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-800 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-800 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{loading ? "Authenticating..." : "Explore Geoportal"}</span>
          </button>
        </form>

        {/* Secondary Branding / Footer */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center text-[10px] font-extrabold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase">
          <span>Bageshwar • Geoportal</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
