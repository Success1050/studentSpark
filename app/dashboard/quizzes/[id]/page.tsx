"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Brain,
  Timer,
  Award,
  Sparkles
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function QuizPlayPage() {
  const router = useRouter();
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quiz State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data, error } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        router.push("/dashboard/quizzes");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchQuiz();
  }, [id, router]);

  const questions = quiz?.quiz_data?.quiz_data || [];
  const currentQuestion = questions[currentIdx];

  const handleAnswer = (option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = option;
    setUserAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setTimeout(() => setCurrentIdx(currentIdx + 1), 300);
    }
  };

  const calculateResults = async () => {
    let finalScore = 0;
    questions.forEach((q: any, idx: number) => {
      if (userAnswers[idx] === q.correct_option) finalScore++;
    });

    const percentage = Math.round((finalScore / questions.length) * 100);
    setScore(percentage);
    setShowResult(true);

    // Update quiz in DB
    try {
      await supabase.from("quizzes").update({ percentage }).eq("id", id);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
        <p className="font-black text-zinc-400 uppercase tracking-widest text-sm animate-pulse">Summoning your challenges...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] p-12 border border-zinc-100 dark:border-zinc-800 shadow-2xl text-center space-y-10 group"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner group-hover:rotate-12 transition-transform duration-700">
              <Trophy className="w-16 h-16 text-amber-500 animate-bounce" />
            </div>
            <Sparkles className="absolute top-0 right-1/4 w-8 h-8 text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Mission Accomplished</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-lg leading-relaxed">You've successfully completed the challenges. Here's your performance breakdown.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-8xl font-black text-zinc-900 dark:text-white tracking-tighter">{score}%</span>
            <span className="text-amber-500 font-black uppercase tracking-[0.2em] text-sm">Mastery Index</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-[2rem] border border-emerald-100 dark:border-emerald-500/10 text-emerald-600 font-black uppercase text-xs tracking-widest text-center shadow-inner">
              Correct: {Math.round((score / 100) * questions.length)} / {questions.length}
            </div>
            <div className="p-6 bg-indigo-50 dark:bg-indigo-500/5 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/10 text-indigo-600 font-black uppercase text-xs tracking-widest text-center shadow-inner">
              Time: 02:45m
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => router.push("/dashboard/quizzes")}
              className="flex-1 py-5 bg-zinc-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-zinc-900/20 active:scale-95 text-lg uppercase tracking-tight"
            >
              Close Vault
            </button>
            <button 
              onClick={() => {
                setShowResult(false);
                setCurrentIdx(0);
                setUserAnswers([]);
              }}
              className="flex-1 py-5 bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 text-lg uppercase tracking-tight"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Quiz Progress */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm hover:scale-105 transition-all text-zinc-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Question Index</span>
          <div className="flex gap-2">
            <span className="text-xl font-black text-indigo-500">{currentIdx + 1}</span>
            <span className="text-xl font-black text-zinc-300">/</span>
            <span className="text-xl font-black text-zinc-400">{questions.length}</span>
          </div>
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-amber-500/10 text-amber-500 rounded-xl">
          <Timer className="w-6 h-6" />
        </div>
      </div>

      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          className="h-full bg-indigo-500 transition-all duration-500"
        />
      </div>

      {/* question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-zinc-900 rounded-[3rem] p-10 md:p-16 border-4 border-white/5 relative overflow-hidden shadow-2xl space-y-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-black uppercase tracking-widest border border-indigo-500/20">Analytical Thinking</div>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight uppercase">
              {currentQuestion?.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 relative">
            {currentQuestion?.options.map((option: string, idx: number) => {
              const char = String.fromCharCode(65 + idx);
              const isSelected = userAnswers[currentIdx] === option;

              return (
                <button 
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`group relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all text-left flex items-center gap-6 overflow-hidden ${
                    isSelected 
                      ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10" 
                      : "border-white/5 bg-white/5 hover:border-indigo-500/40 hover:bg-white/10"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${isSelected ? "bg-indigo-500 text-white" : "bg-white/10 text-zinc-400 group-hover:text-white"}`}>
                    {char}
                  </div>
                  <span className={`text-xl font-bold flex-1 ${isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>{option}</span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button 
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(currentIdx - 1)}
          className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 font-bold transition-all disabled:opacity-30 shadow-xl active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Topic</span>
        </button>

        {currentIdx === questions.length - 1 ? (
          <button 
            disabled={!userAnswers[currentIdx]}
            onClick={calculateResults}
            className="flex items-center gap-3 px-10 py-5 bg-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all text-lg uppercase tracking-tight"
          >
            Finalize Mission <Award className="w-6 h-6" />
          </button>
        ) : (
          <button 
            disabled={!userAnswers[currentIdx]}
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all disabled:opacity-30 active:scale-95"
          >
            <span>Advance</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="h-10"></div>
    </div>
  );
}
