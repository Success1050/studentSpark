"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Flame,
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  BarChart3,
  ChevronRight,
  FileText,
  HelpCircle,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Mock data based on the mobile app's constants
const quickActions = [
  { id: 1, label: "Scan & Summarize", icon: FileText, color: "bg-indigo-500", lightColor: "bg-indigo-500/10", textColor: "text-indigo-500", route: "/dashboard/notes" },
  { id: 2, label: "Quiz Your Knowledge", icon: HelpCircle, color: "bg-amber-500", lightColor: "bg-amber-500/10", textColor: "text-amber-500", route: "/dashboard/quizzes" },
  { id: 3, label: "Smart Study Plan", icon: Calendar, color: "bg-emerald-500", lightColor: "bg-emerald-500/10", textColor: "text-emerald-500", route: "/dashboard/plan" },
  { id: 4, label: "Track Progress", icon: BarChart3, color: "bg-rose-500", lightColor: "bg-rose-500/10", textColor: "text-rose-500", route: "/dashboard/tracker" },
];

const stats = [
  { label: "Study Hours", value: "4.5h", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { label: "Avg. Quiz Score", value: "88%", icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Total Notes", value: "24", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Tasks Done", value: "12", icon: CheckCircle2, color: "text-rose-500", bg: "bg-rose-500/10" },
];

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Student");
  const [greeting, setGreeting] = useState("");
  const [motivation, setMotivation] = useState("The beautiful thing about learning is that no one can take it away from you.");
  const [userStats, setUserStats] = useState({
    hoursToday: 0,
    avgScore: 0,
    totalNotes: 0,
    completedTasks: 0
  });
  const [isGeneratingMotivation, setIsGeneratingMotivation] = useState(false);

  const generateMotivation = async (userId: string) => {
    setIsGeneratingMotivation(true);
    try {
      const response = await fetch("https://studentspark-backend-n0vk.onrender.com/api/motivation-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        cache: "no-store"
      });
      const data = await response.json();
      if (data.success) {
        setMotivation(data.data.motivationQuote);
      }
    } catch (error) {
      console.error("Error generating motivation:", error);
    } finally {
      setIsGeneratingMotivation(false);
    }
  };

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserName(user.user_metadata?.full_name?.split(" ")[0] || "Student");

      // Fetch profile for motivation
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profile?.motivation) {
        setMotivation(profile.motivation);
      } else {
        // Trigger motivation generation if not present
        generateMotivation(user.id);
      }

      // Fetch individual stats for the grid
        const [notesRes, quizzesRes, plansRes] = await Promise.all([
          supabase.from("notes").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("quizzes").select("percentage").eq("user_id", user.id),
          supabase.from("student_studyplans").select("*").eq("user_id", user.id)
        ]);

      // Calculate study stats locally
      const plans = plansRes.data || [];
      const today = new Date();
      const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

      const todayTasks = plans.flatMap((plan: any) =>
        (plan.plan_data?.days || [])
          .filter((day: any) => day.date === todayStr)
          .flatMap((day: any) => day.tasks || [])
      );

      const completedTasks = todayTasks.filter((task: any) => task.completed);
      const totalMinutes = completedTasks.reduce((acc: number, task: any) => acc + (task.duration_minutes || 0), 0);

      const quizData = quizzesRes.data || [];
      const avgScore = quizData.length > 0
        ? Math.round(quizData.reduce((acc, q) => acc + (q.percentage || 0), 0) / quizData.length)
        : 0;

      setUserStats({
        hoursToday: Number((totalMinutes / 60).toFixed(1)),
        avgScore,
        totalNotes: notesRes.count || 0,
        completedTasks: completedTasks.length
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchData();
  }, []);

  const statsDisplay = [
    { label: "Study Hours", value: `${userStats.hoursToday}h`, icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Avg. Quiz Score", value: `${userStats.avgScore}%`, icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Notes", value: userStats.totalNotes.toString(), icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Tasks Done", value: userStats.completedTasks.toString(), icon: CheckCircle2, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
            {greeting}, <span className="text-indigo-500">{userName}</span>! 👋
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium text-lg">Ready to crush your academic goals today?</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/notes")}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>New Note</span>
        </button>
      </section>

      {/* Motivation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-zinc-900 dark:bg-zinc-800 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden group shadow-2xl border border-white/5"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-all duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-inner overflow-hidden flex-shrink-0 cursor-pointer hover:rotate-12 transition-transform" onClick={() => userName && fetchData()}>
            <Sparkles className={`w-12 h-12 ${isGeneratingMotivation ? "animate-spin" : "animate-pulse"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
              <h3 className="text-indigo-400 font-extrabold uppercase tracking-[0.2em] text-xs">Daily Spark</h3>
            </div>
            <p className="text-2xl md:text-3xl text-white font-medium italic leading-tight tracking-tight">
              "{motivation}"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all group relative overflow-hidden ring-1 ring-zinc-50 dark:ring-zinc-800/50"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
              <stat.icon className="w-16 h-16" />
            </div>
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6 group-hover:scale-110 shadow-inner`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{stat.value}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 font-extrabold text-[13px] tracking-widest uppercase">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-16">
        {/* Quick Actions (2/3 width on desktop) */}
        <section className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            Quick Actions
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800 ml-4"></div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickActions.map((action, idx) => (
              <button
                key={action.id}
                onClick={() => router.push(action.route)}
                className="flex items-center gap-6 p-8 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/40 dark:shadow-none hover:shadow-2xl hover:border-indigo-500/30 transition-all group overflow-hidden relative active:scale-95"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${action.lightColor} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                <div className={`w-20 h-20 flex-shrink-0 ${action.lightColor} ${action.textColor} rounded-[2rem] flex items-center justify-center transition-all group-hover:scale-110 group-hover:-rotate-6 shadow-inner`}>
                  <action.icon className="w-10 h-10" />
                </div>
                <div className="text-left flex-1 min-w-0 z-10">
                  <h4 className="font-black text-zinc-900 dark:text-white text-xl truncate tracking-tight mb-1">{action.label}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold opacity-80 uppercase tracking-wider">Start Now</p>
                </div>
                <ChevronRight className="w-8 h-8 text-zinc-200 dark:text-zinc-700 lg:group-hover:translate-x-2 transition-all group-hover:text-indigo-500" />
              </button>
            ))}
          </div>
        </section>

        {/* AI Insights (1/3 width on desktop) */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            AI Insights
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800 ml-4"></div>
          </h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 lg:p-12 border border-indigo-500/10 shadow-2xl relative overflow-hidden group ring-1 ring-indigo-500/5 aspect-square flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-8 h-full bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
            <div className="space-y-10 relative z-10">
              <div className="flex items-center gap-5 text-indigo-500">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                  <BarChart3 className="w-9 h-9" />
                </div>
                <span className="font-black text-2xl tracking-tight uppercase">Activity</span>
              </div>

              <p className="text-[20px] text-zinc-600 dark:text-zinc-300 leading-relaxed font-bold tracking-tight">
                You're performing <span className="text-emerald-500 font-black px-2 py-1 bg-emerald-500/10 rounded-xl">23% better</span> than last week! Economics is your strongest subject.
              </p>

              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => router.push("/dashboard/tracker")}
                  className="text-indigo-500 font-black text-xl flex items-center justify-center gap-3 hover:gap-5 transition-all w-full py-5 bg-indigo-50 dark:bg-indigo-500/5 rounded-2xl hover:bg-indigo-500 hover:text-white active:scale-95 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/20"
                >
                  Full Analysis <ChevronRight className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
