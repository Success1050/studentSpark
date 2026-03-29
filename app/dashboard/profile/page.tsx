"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  LogOut, 
  Trash2, 
  Flame, 
  Trophy, 
  Sparkles, 
  Zap,
  ChevronRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    notes: 0,
    quizzes: 0,
    avgScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/signin");
        return;
      }
      setUser(user);

      // Fetch additional stats
      const [notesRes, quizzesRes, profileRes] = await Promise.all([
        supabase.from("notes").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("quizzes").select("id, percentage").eq("user_id", user.id),
        supabase.from("profiles").select("*").eq("user_id", user.id).single()
      ]);

      const quizData = quizzesRes.data || [];
      const avgScore = quizData.length > 0 
        ? quizData.reduce((acc, q) => acc + (q.percentage || 0), 0) / quizData.length 
        : 0;

      setStats({
        notes: notesRes.count || 0,
        quizzes: quizData.length,
        avgScore: Math.round(avgScore)
      });
      setProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Securing your profile...</p>
      </div>
    );
  }

  const userPlan = profile?.plan || "Free";
  const planColor = userPlan === "Pro" ? "text-indigo-500" : userPlan === "Premium" ? "text-amber-500" : "text-zinc-500";
  const planBg = userPlan === "Pro" ? "bg-indigo-500/10" : userPlan === "Premium" ? "bg-amber-500/10" : "bg-zinc-500/10";

  return (
    <div className="p-4 sm:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight uppercase">User Profile</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium text-lg">Managing your academic identity</p>
      </section>

      {/* Profile Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="h-32 bg-indigo-500 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-50"></div>
          <div className="absolute -bottom-16 left-10">
            <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-100 dark:bg-zinc-800 border-8 border-white dark:border-zinc-900 flex items-center justify-center text-5xl font-black text-indigo-500 shadow-xl">
              {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-10 px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{user.user_metadata?.full_name || "StudySpark User"}</h2>
              <p className="text-zinc-500 font-bold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-5 py-2.5 bg-amber-500/10 rounded-xl flex items-center gap-3 border border-amber-500/20">
                <Flame className="w-5 h-5 text-amber-500" />
                <span className="font-black text-amber-600">5 Day Streak</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-zinc-50 dark:border-zinc-800">
            <div className="text-center md:text-left space-y-1">
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Total Notes</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{stats.notes}</p>
            </div>
            <div className="text-center md:text-left space-y-1 border-x border-zinc-50 dark:border-zinc-800 px-6">
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Quizzes Taken</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{stats.quizzes}</p>
            </div>
            <div className="text-center md:text-left space-y-1">
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Mastery Level</p>
              <p className="text-3xl font-black text-emerald-500 tracking-tighter">{stats.avgScore}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscription */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Active Plan</h3>
          <div className="bg-zinc-900 rounded-[3rem] p-10 border-4 border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-48 h-48 ${planBg} rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2`}></div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${planBg} ${planColor} rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500`}>
                  <Zap className="w-9 h-9 fill-current" />
                </div>
                <div>
                  <h4 className={`text-3xl font-black ${planColor} tracking-tighter uppercase`}>{userPlan} Plan</h4>
                  <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Member since {dayjs(user.created_at).format("MMM YYYY")}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Unlimited AI Summaries",
                  "Personalized Study Roadmaps",
                  "Interactive Knowledge Quizzes",
                  "Cross-platform Sync"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-300 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-5 bg-white text-zinc-900 font-black rounded-2xl hover:bg-zinc-100 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                Manage Subscription <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">System Settings</h3>
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-4 border border-zinc-100 dark:border-zinc-800 shadow-xl">
            <div className="space-y-2">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-[2rem] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">Sign Out</p>
                    <p className="text-zinc-400 font-bold text-xs uppercase">Exit your current session</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-zinc-200" />
              </button>

              <button className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-[2rem] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">Security</p>
                    <p className="text-zinc-400 font-bold text-xs uppercase">Manage password and auth</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-zinc-200" />
              </button>

              <button className="w-full flex items-center justify-between p-6 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-[2rem] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-red-500 uppercase tracking-tight">Delete Account</p>
                    <p className="text-zinc-400 font-bold text-xs uppercase">Irreversibly remove all data</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-zinc-200" />
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-500/5 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-500/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm leading-relaxed">
              Using <span className="text-indigo-500">StudySpark Web v1.0.0</span>. Your data is synced with your mobile device.
            </p>
          </div>
        </section>
      </div>
      <div className="h-10"></div>
    </div>
  );
}
