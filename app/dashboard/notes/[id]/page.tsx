"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Calendar, 
  ChevronRight, 
  FileText,
  Loader2,
  Trash2
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

export default function NoteDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [note, setNote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setNote(data);
      } catch (error) {
        console.error("Error fetching note:", error);
        router.push("/dashboard/notes");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchNote();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      router.push("/dashboard/notes");
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Transcribing your data...</p>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Library</span>
        </button>
        <button 
          onClick={handleDelete}
          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight uppercase break-all line-clamp-3" style={{ overflowWrap: "anywhere" }}>{note.title}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-zinc-400 font-bold">
                <Calendar className="w-4 h-4" />
                <span>{dayjs(note.created_at).format("DD MMM, YYYY")}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 font-bold">
                <BookOpen className="w-4 h-4" />
                <span>{note.lists_of_topic?.length || 0} Core Topics</span>
              </div>
            </div>
          </section>

          {/* AI Summary Section */}
          <section className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-zinc-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner group-hover:rotate-12 transition-transform">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">AI Insights & Summary</h2>
              </div>

              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-bold tracking-tight">
                  {note.summary || "No summary available for this note yet."}
                </p>
              </div>

              {note.lists_of_topic && (
                <div className="space-y-4 pt-8 border-t border-zinc-50 dark:border-zinc-800">
                  <h3 className="font-black text-zinc-400 uppercase tracking-widest text-sm">Key Concepts to Master</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {note.lists_of_topic.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-inner group-hover:scale-[1.02] transition-transform">
                        <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0"></div>
                        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                          <span className="font-black text-zinc-900 dark:text-white uppercase tracking-tight text-sm">
                            {typeof item === 'object' ? item.topic : item}
                          </span>
                          {typeof item === 'object' && item.explanation && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed">{item.explanation}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info (1/3) */}
        <aside className="space-y-8">
          <div className="bg-indigo-500 text-white rounded-[3rem] p-10 shadow-2xl shadow-indigo-500/30 space-y-8 group">
            <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-9 h-9 fill-current" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">Quick Action</h3>
              <p className="text-indigo-100 font-bold leading-relaxed opacity-80">
                Ready to test your knowledge? Create a quiz from this note and dominate your next exam.
              </p>
            </div>
            <button 
              onClick={() => router.push(`/dashboard/quizzes?noteId=${note.id}`)}
              className="w-full py-5 bg-white text-indigo-500 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              Generate Quiz
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-xl space-y-6">
            <h3 className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">File Properties</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-zinc-50 dark:border-zinc-800">
                <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Type</span>
                <span className="font-black text-zinc-800 dark:text-white uppercase text-xs">PDF DOCUMENT</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-50 dark:border-zinc-800">
                <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Mastery</span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-black">HIGH</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-50 dark:border-zinc-800">
                <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">AI Status</span>
                <span className="flex items-center gap-1.5 text-indigo-500 font-black text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  OPTIMIZED
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div className="h-10"></div>
    </div>
  );
}
