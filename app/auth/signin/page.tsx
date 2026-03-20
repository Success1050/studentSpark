"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, Github, Chrome, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { userLogin } from "@/lib/auth-actions";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await userLogin(email, password);

      if (res.success && res.data) {
        const loggedInUserId = res.data.user.id;

        // Generate motivation for the logged-in user (as in the mobile app)
        fetch("https://studentspark-backend-n0vk.onrender.com/api/motivation-gen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedInUserId }),
        }).catch((err) => console.log("Motivation API error:", err));

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black items-center justify-center p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800"
      >
        <div className="p-8 sm:p-12">
          {/* Back button */}
          <button 
            onClick={() => router.push("/")}
            className="group mb-8 flex items-center gap-2 text-zinc-400 hover:text-indigo-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Home</span>
          </button>

          <div className="flex items-center gap-2 mb-8 group cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:rotate-12">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">StudySpark</span>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Welcome Back!</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">Sign in to continue your academic journey.</p>

          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-4 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1 pr-1">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                <Link href="/auth/forgot-password" className="text-sm text-indigo-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-12 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-500 font-medium tracking-wider italic">Or sign in with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="h-14 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3 font-semibold text-zinc-700 dark:text-zinc-300">
              <Chrome className="w-5 h-5" />
              <span>Google</span>
            </button>
            <button className="h-14 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3 font-semibold text-zinc-700 dark:text-zinc-300">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </button>
          </div>

          <p className="text-center mt-10 text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-indigo-500 font-bold hover:underline selection:bg-indigo-100">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
