"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  Star,
  ChevronRight,
  Loader2,
  Calendar,
  BarChart3,
  Target
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TrackerPage() {
  const [stats, setStats] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [plansRes, profileRes] = await Promise.all([
        supabase.from("student_studyplans").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("user_id", user.id).single()
      ]);

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

      setStats({
        totalHours: Number((totalMinutes / 60).toFixed(1)),
        completedTasks: completedTasks
      });
      setStreak(profileRes.data);
      setPlans(plans);
    } catch (error) {
      console.error("Error fetching tracker data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Analyzing your growth...</p>
      </div>
    );
  }

  const todayHours = stats?.totalHours || 0;
  const tasksCompleted = stats?.completedTasks?.length || 0;
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;

  // Mock weekly data based on mobile app logic
  const weeklyData = [
    { day: "Mon", hours: 4.5, active: true },
    { day: "Tue", hours: 6.2, active: true },
    { day: "Wed", hours: todayHours, active: true },
    { day: "Thu", hours: 0, active: false },
    { day: "Fri", hours: 0, active: false },
    { day: "Sat", hours: 0, active: false },
    { day: "Sun", hours: 0, active: false },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours), 8);

  const insights = [
    {
      id: 1,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      title: "Peak Performance",
      text: "You study best on Tuesdays with 6.2 hours. Try scheduling harder topics then."
    },
    {
      id: 2,
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      title: "Attention Needed",
      text: "Economics needs more focus. Consider adding 2.5 more hours this week."
    },
    {
      id: 3,
      icon: Star,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      title: "Great Consistency",
      text: `You've maintained a ${currentStreak}-day streak! Keep it up to reach your record.`
    }
  ];

  return (
    <div className="p-4 sm:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">Progress Tracker</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium text-lg">Visualizing your journey to the top</p>
      </section>

      {/* Streak Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-zinc-900 border-4 border-amber-500/20 rounded-[3rem] p-10 flex flex-col items-center text-center relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 group-hover:h-2 transition-all"></div>
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Flame className="w-10 h-10 text-amber-500 fill-current animate-pulse" />
          </div>
          <span className="text-6xl font-black text-white tracking-tighter mb-2">{currentStreak}</span>
          <span className="text-amber-500/60 font-black uppercase tracking-[0.2em] text-xs">Day Streak</span>
          <div className="mt-6 px-4 py-1.5 bg-amber-500/10 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">Active Now</div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-zinc-900 border-4 border-indigo-500/20 rounded-[3rem] p-10 flex flex-col items-center text-center relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 group-hover:h-2 transition-all"></div>
          <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Trophy className="w-10 h-10 text-indigo-500 animate-bounce" />
          </div>
          <span className="text-6xl font-black text-white tracking-tighter mb-2">{longestStreak}</span>
          <span className="text-indigo-500/60 font-black uppercase tracking-[0.2em] text-xs">Personal Best</span>
          <div className="mt-6 px-4 py-1.5 bg-indigo-500/10 rounded-full text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">All Time Record</div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Chart (2/3 width) */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Weekly Activity</h2>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <button className="px-4 py-1.5 bg-white dark:bg-zinc-900 rounded-lg text-xs font-black shadow-sm uppercase tracking-widest text-indigo-500">Week</button>
              <button className="px-4 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-400">Month</button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/40 relative overflow-hidden">
            <div className="flex items-end justify-between h-64 gap-2 sm:gap-4 relative z-10 px-2 lg:px-6">
              {weeklyData.map((data, idx) => {
                const height = (data.hours / maxHours) * 100;
                return (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full flex-1 flex items-end justify-center relative">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: idx * 0.1, duration: 1, ease: "easeOut" }}
                        className={`w-full max-w-[40px] rounded-t-2xl shadow-lg transition-all group-hover:brightness-110 ${data.active ? "bg-indigo-500 shadow-indigo-500/20" : "bg-zinc-100 dark:bg-zinc-800"}`}
                      />
                      {data.hours > 0 && (
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] font-black py-1 px-2 rounded-lg pointer-events-none">
                          {data.hours}h
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${data.active ? "text-indigo-500" : "text-zinc-400"}`}>{data.day}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Grid Lines */}
            <div className="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-zinc-900 dark:bg-white" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-indigo-50 dark:bg-indigo-500/5 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 text-center">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 leading-none">Total Hours</p>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">24.8h</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/5 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/10 text-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 leading-none">Avg. Daily</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">3.5h</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/10 text-center">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1 leading-none">Productivity</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">92%</p>
            </div>
          </div>
        </section>

        {/* SI Insights (1/3 width) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">AI Coach</h2>
            <div className="px-2 py-1 bg-amber-500/10 rounded-lg text-amber-500 text-[10px] font-black uppercase tracking-widest">Logic 4.0</div>
          </div>

          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <motion.div 
                key={insight.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/30 group hover:border-indigo-500/30 transition-all cursor-default"
              >
                <div className="flex gap-6">
                  <div className={`w-14 h-14 ${insight.bg} ${insight.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
                    <insight.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-zinc-900 dark:text-white text-lg tracking-tight uppercase">{insight.title}</h4>
                    <p className="text-zinc-500 dark:text-zinc-600 font-bold leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full p-8 bg-zinc-900 text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl active:scale-95 group">
            <Sparkles className="w-6 h-6 text-amber-500 group-hover:animate-spin" />
            <span>Generate Full Review</span>
          </button>
        </section>
      </div>

      {/* Today's Deep Dive */}
      <section className="pb-16 space-y-6">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Today's Deep Dive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8" />
            </div>
            <h4 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{todayHours}h</h4>
            <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">Time Studied</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{tasksCompleted}</h4>
            <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">Tasks Cleared</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h4 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">1.2x</h4>
            <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">Vs Yesterday</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Target className="w-8 h-8" />
            </div>
            <h4 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">75%</h4>
            <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">Daily Goal</p>
          </div>
        </div>
      </section>
    </div>
  );
}
