"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  HelpCircle, 
  Sparkles, 
  Trash2, 
  ChevronRight, 
  Play, 
  Loader2,
  Trophy,
  History,
  CheckCircle2,
  FileText,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [quizzesRes, notesRes] = await Promise.all([
        supabase.from("quizzes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      ]);

      if (quizzesRes.error) throw quizzesRes.error;
      if (notesRes.error) throw notesRes.error;

      setQuizzes(quizzesRes.data || []);
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

  const handleGenerateQuiz = async () => {
    if (!selectedNoteId) {
      alert("Please select a note to generate a quiz from.");
      return;
    }

    setIsGenerating(true);
    setShowGenerateModal(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const response = await fetch("https://studentspark-backend-n0vk.onrender.com/api/upload-notes-for-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          noteId: selectedNoteId
        }),
        cache: "no-store"
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      await fetchData();
      alert("Quiz generated successfully!");
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(error.message || "Failed to generate quiz");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const { error } = await supabase.from("quizzes").delete().eq("id", quizId);
      if (error) throw error;
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz");
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">Interactive Quizzes</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium text-lg">Test your knowledge and track your mastery</p>
        </div>
        
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
        >
          <Sparkles className="w-5 h-5 stroke-[3]" />
          <span>Generate New Quiz</span>
        </button>
      </section>

      {/* Hero / CTA Card */}
      <div className="bg-zinc-900 dark:bg-zinc-800 rounded-[2.5rem] p-10 sm:p-12 relative overflow-hidden group shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-amber-500 border border-white/10 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <Trophy className="w-10 h-10 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">AI Quiz Builder</h3>
            <p className="text-zinc-400 text-lg font-bold leading-relaxed max-w-2xl">
              Turn your notes into interactive quizzes in seconds. No more tedious manual creation—let StudySpark do the heavy lifting!
            </p>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Gathering your scores...</p>
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, idx) => {
            const percentage = quiz.percentage || 0;
            const scoreColor = percentage >= 80 ? "text-emerald-500" : percentage >= 50 ? "text-amber-500" : "text-rose-500";
            const scoreBg = percentage >= 80 ? "bg-emerald-50" : percentage >= 50 ? "bg-amber-50" : "bg-rose-50";

            return (
              <motion.div 
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
                className="group bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/40 dark:shadow-none hover:shadow-2xl hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div className={`w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <div className={`px-4 py-2 ${scoreBg} dark:bg-opacity-10 ${scoreColor} rounded-xl text-lg font-black shadow-inner`}>
                    {percentage}%
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{quiz.title}</h3>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm font-bold uppercase tracking-wider">{quiz.quiz_data?.quiz_metadata?.total_questions || 0} Qs</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <History className="w-4 h-4" />
                      <span className="text-sm font-bold uppercase tracking-wider">{dayjs(quiz.created_at).format("DD MMM")}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-indigo-500 font-bold hover:gap-3 transition-all">
                      Play Now <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                      className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-8 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 shadow-inner">
            <Trophy className="w-16 h-16" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">Start Your Quest</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-lg leading-relaxed">You haven't generated any quizzes yet. Turn your notes into knowledge challenges!</p>
          </div>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-3 px-10 py-5 bg-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all text-lg"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span>Generate First Quiz</span>
          </button>
        </div>
      )}

      {/* Generate Quiz Modal */}
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
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-10"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-none uppercase">Generate Quiz</h3>
                </div>
                <button onClick={() => setShowGenerateModal(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-black text-zinc-400 uppercase tracking-widest px-1">Select a note to use</label>
                  <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {notes.length > 0 ? notes.map(note => (
                      <button 
                        key={note.id}
                        onClick={() => setSelectedNoteId(note.id)}
                        className={`flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all text-left group ${
                          selectedNoteId === note.id 
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-4 ring-indigo-500/5" 
                            : "border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${selectedNoteId === note.id ? "bg-indigo-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-indigo-400"}`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className={`font-bold flex-1 truncate ${selectedNoteId === note.id ? "text-indigo-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"}`}>{note.title}</span>
                      </button>
                    )) : (
                      <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                        <p className="text-zinc-500 dark:text-zinc-400 font-bold">No notes available. Upload a note first!</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleGenerateQuiz}
                  disabled={!selectedNoteId || isGenerating}
                  className="w-full py-6 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-500/25 transition-all text-xl active:scale-[0.98] uppercase tracking-wider"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    "Create Challenges"
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
