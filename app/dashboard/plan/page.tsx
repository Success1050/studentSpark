"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Calendar, 
  Sparkles, 
  Trash2, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  BarChart3, 
  Target,
  ArrowRight,
  Loader2,
  X,
  FileText,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

export default function StudyPlanPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Form State
  const [planName, setPlanName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [duration, setDuration] = useState("14");
  const [studyHours, setStudyHours] = useState("3-4");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [aiOptions, setAiOptions] = useState({
    includeRevision: true,
    avoidWeekends: false,
    includeBreaks: true
  });

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [plansRes, notesRes] = await Promise.all([
        supabase.from("student_studyplans").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      ]);

      if (plansRes.error) throw plansRes.error;
      if (notesRes.error) throw notesRes.error;

      setPlans(plansRes.data || []);
      setNotes(notesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePlan = async () => {
    if (!planName || !examDate || selectedNoteIds.length === 0) {
      alert("Please fill in all required fields and select at least one note.");
      return;
    }

    setIsGenerating(true);
    setShowGenerateModal(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const selectedNoteTitles = notes
        .filter(note => selectedNoteIds.includes(note.id))
        .map(note => note.title);

      const response = await fetch("https://studentspark-backend-n0vk.onrender.com/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          examDate,
          planName,
          duration,
          subjects: selectedNoteTitles,
          noteIds: selectedNoteIds,
          studyHours,
          aiOptions
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      await fetchData();
      alert("Study Plan generated successfully!");
      setPlanName("");
      setExamDate("");
      setSelectedNoteIds([]);
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(error.message || "Failed to generate study plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this study plan?")) return;

    try {
      const { error } = await supabase.from("student_studyplans").delete().eq("id", id);
      if (error) throw error;
      setPlans(plans.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan");
    }
  };

  const toggleNote = (id: string) => {
    setSelectedNoteIds(prev => 
      prev.includes(id) ? prev.filter(ni => ni !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">Smart Study Plans</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium text-lg">AI-optimized routes to academic excellence</p>
        </div>
        
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
        >
          <Sparkles className="w-5 h-5 stroke-[3]" />
          <span>Generate New Plan</span>
        </button>
      </section>

      {/* Hero Stats Card */}
      <div className="bg-zinc-900 dark:bg-zinc-800 rounded-[2.5rem] p-10 sm:p-12 relative overflow-hidden group shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-black text-xs uppercase tracking-[0.2em] shadow-inner">Active Roadmap</div>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">Master Your <span className="text-indigo-400">Timeline</span>.</h3>
            <p className="text-zinc-400 text-lg font-bold leading-relaxed max-w-lg">
              Our AI analyzes your exam dates and notes to create a personalized study schedule that balances intensity with retention.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 group-hover:bg-white/10 transition-colors">
              <Calendar className="w-10 h-10 text-emerald-400 mb-4" />
              <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-1 leading-none">Exam Readiness</p>
              <p className="text-3xl font-black text-white leading-tight tracking-tighter">84%</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 group-hover:bg-white/10 transition-colors">
              <Target className="w-10 h-10 text-indigo-400 mb-4" />
              <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-1 leading-none">Goals Met</p>
              <p className="text-3xl font-black text-white leading-tight tracking-tighter">12/15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Building your roadmap...</p>
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => router.push(`/dashboard/plan/${plan.id}`)}
              className="group bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/40 dark:shadow-none hover:shadow-2xl hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-inner">
                  <Calendar className="w-8 h-8" />
                </div>
                <button 
                  onClick={(e) => handleDeletePlan(plan.id, e)}
                  className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white line-clamp-2 leading-none group-hover:text-indigo-500 transition-colors mb-2 uppercase tracking-tight">{plan.plan_name}</h3>
                  <p className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    Target: {dayjs(plan.exam_date).format("DD MMM, YYYY")}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Duration</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white">{plan.duration_days} Days</p>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Study Intensity</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white">{plan.study_hours_range}h/day</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800">
                  <button className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-500 font-black rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/5">
                    View Schedule <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-8 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 shadow-inner">
            <Calendar className="w-16 h-16" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-none uppercase">Chart Your Path</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-lg leading-relaxed">No active study plans found. Let's build a timeline that ensures your success!</p>
          </div>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-4 px-10 py-5 bg-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all text-lg"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span>Generate First Plan</span>
          </button>
        </div>
      )}

      {/* Generate Plan Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGenerateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                    <Sparkles className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-none">Smart Plan Generator</h3>
                </div>
                <button onClick={() => setShowGenerateModal(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  <X className="w-8 h-8 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-zinc-400 uppercase tracking-widest px-1">Plan Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Finals Smash 2024" 
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black text-zinc-400 uppercase tracking-widest px-1">Exam Target Date</label>
                    <input 
                      type="date" 
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all"
                    />
                  </div>
                </div>

                {/* Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-black text-zinc-400 uppercase tracking-widest px-1">Plan Length</label>
                    <div className="flex items-center gap-3">
                      {["7", "14", "21", "30"].map(d => (
                        <button 
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`flex-1 py-4 px-3 rounded-2xl font-black text-sm uppercase tracking-tighter transition-all shadow-sm ${duration === d ? "bg-indigo-500 text-white shadow-indigo-500/25 scale-105" : "bg-zinc-50 dark:bg-zinc-800 font-bold text-zinc-500"}`}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-black text-zinc-400 uppercase tracking-widest px-1">Daily Grind</label>
                    <div className="flex items-center gap-3">
                      {["1-2", "3-4", "5-6", "7-8"].map(h => (
                        <button 
                          key={h}
                          onClick={() => setStudyHours(h)}
                          className={`flex-1 py-4 px-3 rounded-2xl font-black text-sm uppercase tracking-tighter transition-all shadow-sm ${studyHours === h ? "bg-indigo-500 text-white shadow-indigo-500/25 scale-105" : "bg-zinc-50 dark:bg-zinc-800 font-bold text-zinc-500"}`}
                        >
                          {h} hrs
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Note Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-black text-zinc-400 uppercase tracking-widest px-1 flex justify-between">
                    Primary Resources
                    <span className="text-indigo-500">{selectedNoteIds.length} Selected</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[240px] overflow-y-auto pr-3 custom-scrollbar">
                    {notes.map(note => (
                      <button 
                        key={note.id}
                        onClick={() => toggleNote(note.id)}
                        className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all text-left ${
                          selectedNoteIds.includes(note.id) 
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-4 ring-indigo-500/10" 
                            : "border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedNoteIds.includes(note.id) ? "bg-indigo-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-bold flex-1 truncate">{note.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Action */}
                <button 
                  onClick={handleGeneratePlan}
                  disabled={isGenerating || !planName || !examDate || selectedNoteIds.length === 0}
                  className="w-full py-7 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-3xl shadow-2xl shadow-indigo-500/30 transition-all text-xl active:scale-[0.98] uppercase tracking-[0.1em]"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-4">
                      <Loader2 className="w-7 h-7 animate-spin" />
                      <span>Forging Timeline...</span>
                    </div>
                  ) : (
                    "Launch Study Plan"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
