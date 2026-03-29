"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp,
  Layout,
  Brain
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

export default function StudyPlanDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data, error } = await supabase
          .from("student_studyplans")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPlan(data);
      } catch (error) {
        console.error("Error fetching study plan:", error);
        router.push("/dashboard/plan");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPlan();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
        <p className="font-black text-zinc-400 uppercase tracking-widest text-sm animate-pulse">Forging your timeline...</p>
      </div>
    );
  }

  if (!plan) return null;

  const planData = plan.plan_data || {};
  const days = planData.days || [];

  return (
    <div className="p-4 sm:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-zinc-400 font-black uppercase text-xs tracking-widest hover:text-indigo-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Master Registry</span>
          </button>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
            {plan.plan_name}
          </h1>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl font-black text-xs uppercase tracking-widest shadow-inner border border-indigo-500/20">
              <Calendar className="w-4 h-4" />
              Target: {dayjs(plan.exam_date).format("DD MMM, YYYY")}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl font-black text-xs uppercase tracking-widest shadow-inner border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
              Efficiency: High
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 p-8 bg-zinc-900 rounded-[2.5rem] shadow-2xl border-4 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 text-center space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none mb-1">Current Progress</p>
            <p className="text-4xl font-black text-white tracking-tighter">0%</p>
          </div>
          <div className="h-12 w-px bg-white/10 mx-2"></div>
          <div className="relative z-10 text-center space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none mb-1">Days Remaining</p>
            <p className="text-4xl font-black text-white tracking-tighter">{dayjs(plan.exam_date).diff(dayjs(), "day")}</p>
          </div>
        </div>
      </div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Timeline (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Layout className="w-7 h-7 text-indigo-500" />
            Execution Timeline
          </h2>

          <div className="space-y-6">
            {days.map((day: any, idx: number) => {
              const date = dayjs(day.date, "DD/MM/YYYY");
              const isToday = dayjs().isSame(date, "day");
              const isBreak = day.is_break_day;

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative p-8 rounded-[3rem] border transition-all overflow-hidden group ${
                    isToday 
                      ? "bg-indigo-500 border-indigo-600 shadow-2xl shadow-indigo-500/25 ring-8 ring-indigo-500/5 z-20" 
                      : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/40 hover:border-indigo-500/20"
                  }`}
                >
                  {isToday && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                  )}

                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    <div className="w-full md:w-32 flex flex-col items-center justify-center text-center">
                      <span className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? "text-indigo-200" : "text-zinc-400"}`}>{date.format("ddd")}</span>
                      <span className={`text-4xl font-black tracking-tighter ${isToday ? "text-white" : "text-zinc-900 dark:text-white"}`}>{date.format("DD")}</span>
                      <span className={`text-[11px] font-black uppercase tracking-widest mt-1 ${isToday ? "text-indigo-100/60" : "text-zinc-300"}`}>{date.format("MMM")}</span>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <h3 className={`text-2xl font-black uppercase tracking-tight ${isToday ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                            {isBreak ? "Maintenance Break" : `Focus Block ${idx + 1}`}
                          </h3>
                        </div>
                        {!isBreak && (
                          <div className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-inner ${isToday ? "bg-white/20 text-white" : "bg-indigo-500/10 text-indigo-500"}`}>
                            {day.estimated_hours}h Session
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {isBreak ? (
                          <div className="flex items-center gap-4 p-5 bg-black/5 rounded-2xl border border-dashed border-black/10">
                            <Sparkles className={`w-6 h-6 ${isToday ? "text-white" : "text-indigo-500"}`} />
                            <p className={`font-bold italic ${isToday ? "text-indigo-100" : "text-zinc-500"}`}>Rest, recover, and integrate what you've learned.</p>
                          </div>
                        ) : (
                          day.tasks.map((task: any, tIdx: number) => (
                            <div key={tIdx} className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${isToday ? "bg-white text-indigo-500 border-white/20 shadow-lg" : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-1"}`}>
                              <div className="flex items-center gap-5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${isToday ? "bg-indigo-100" : "bg-white dark:bg-zinc-800 text-indigo-500"}`}>
                                  <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-black uppercase tracking-tight text-sm truncate max-w-[200px]">{task.subject.split("+")[0]}</p>
                                  <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-60`}>{task.duration_minutes} Minutes</p>
                                </div>
                              </div>
                              <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isToday ? "bg-indigo-500 text-white" : "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-inner"}`}>
                                <CheckCircle2 className="w-6 h-6" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Intelligence (4/12) */}
        <aside className="lg:col-span-4 space-y-10">
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <Brain className="w-7 h-7 text-amber-500" />
              Strategic Intelligence
            </h3>
            <div className="bg-zinc-900 rounded-[3rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Crucial Note</span>
                  </div>
                  <p className="text-zinc-300 font-bold leading-relaxed text-lg italic">
                    "Your schedule emphasizes high-intensity sessions followed by active recall. Ensure you stick to the duration blocks for maximum retention."
                  </p>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Daily Burn Rate</span>
                    <span className="text-white font-black tracking-tighter text-xl">{plan.study_hours_range}h/Day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Roadmap Length</span>
                    <span className="text-white font-black tracking-tighter text-xl">{plan.duration_days} Days</span>
                  </div>
                </div>

                <button className="w-full py-5 bg-white text-zinc-900 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                  Optimize Roadmap <Sparkles className="w-5 h-5 text-amber-500" />
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] p-4 shadow-xl">
             <div className="p-8 space-y-6">
               <h4 className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">Session Breakdown</h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center py-4 border-b border-zinc-50 dark:border-zinc-800">
                   <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Total Topics</span>
                   <span className="font-black text-indigo-500 text-lg">12</span>
                 </div>
                 <div className="flex justify-between items-center py-4 border-b border-zinc-50 dark:border-zinc-800">
                   <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Revision Blocks</span>
                   <span className="font-black text-emerald-500 text-lg">4</span>
                 </div>
               </div>
             </div>
          </section>
        </aside>
      </div>
      <div className="h-10"></div>
    </div>
  );
}
