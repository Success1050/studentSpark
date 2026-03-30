"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  FileText,
  Sparkles,
  Trash2,
  ChevronRight,
  Upload,
  X,
  FileUp,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

// --- Components ---

interface PDFUploadProgressProps {
  fileName?: string;
  visible: boolean;
  title?: string;
  subtitle?: string;
  beginText: string;
  middleText: string;
  endingText: string;
}

const PDFUploadProgress = ({
  fileName,
  visible,
  title,
  subtitle,
  beginText,
  middleText,
  endingText,
}: PDFUploadProgressProps) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-x-0 top-0 z-[100] p-4 flex justify-center"
    >
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 md:p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 flex-shrink-0 relative overflow-hidden">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white truncate">{title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm tracking-wide uppercase">{subtitle}</p>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl mb-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm text-indigo-500">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-zinc-900 dark:text-white font-bold truncate flex-1">{fileName}</span>
        </div>

        <div className="space-y-3 mb-8">
          <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="h-full bg-indigo-500"
            />
          </div>
          <p className="text-center text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-[0.1em]">Analyzing content with AI...</p>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-500">{beginText}</span>
          </div>
          <div className="h-[2px] w-8 bg-emerald-200 dark:bg-emerald-900/50 mb-6"></div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-[10px] font-black uppercase text-indigo-500">{middleText}</span>
          </div>
          <div className="h-[2px] w-8 bg-zinc-100 dark:bg-zinc-800 mb-6"></div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            <span className="text-[10px] font-black uppercase text-zinc-400">{endingText}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Page Implementation ---

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    setUploadFileName(file.name);
    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64 = await base64Promise;

      const response = await fetch("https://studentspark-backend-n0vk.onrender.com/api/upload-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          userId: user.id,
          file: base64
        }),
        cache: "no-store"
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      await fetchNotes();
      alert("Note uploaded and summarized successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload note");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AnimatePresence>
        {isUploading && (
          <PDFUploadProgress
            visible={isUploading}
            fileName={uploadFileName}
            title="AI Summarizing..."
            subtitle="Processing Document"
            beginText="Uploading"
            middleText="Analyzing"
            endingText="Summarized"
          />
        )}
      </AnimatePresence>

      {/* Header Area */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">My Study Notes</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium text-lg">Manage your PDFs and AI-generated summaries</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Upload PDF</span>
          </button>
        </div>
      </section>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search notes by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 p-5 pl-14 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
          />
        </div>
        <div className="px-6 py-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-[1.5rem] border border-indigo-100 dark:border-indigo-500/20 text-indigo-500 font-black whitespace-nowrap shadow-sm">
          {notes.length} Total Notes
        </div>
      </div>

      {/* Main Feature Promo */}
      <div className="bg-amber-50 dark:bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-500/10 flex flex-col md:flex-row items-center gap-6 group hover:translate-y-[-4px] transition-all">
        <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm transition-transform group-hover:rotate-12 group-hover:scale-110">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-black text-zinc-900 dark:text-white text-xl">AI-Powered Summaries</h3>
          <p className="text-zinc-500 dark:text-zinc-600 font-bold">Upload any PDF and get instant, smart summaries of the most important concepts.</p>
        </div>
        <div className="px-5 py-2.5 bg-amber-500 text-white font-black rounded-xl text-sm shadow-lg shadow-amber-500/20">
          Supercharged
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Loading your vault...</p>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => router.push(`/dashboard/notes/${note.id}`)}
              className="group bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/40 dark:shadow-none hover:shadow-2xl hover:border-indigo-500/30 transition-all cursor-pointer relative"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>
                <button
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-500 transition-colors break-all">{note.title}</h3>

                {note.summary && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg w-fit">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">AI Summary Active</span>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Created On</p>
                    <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{dayjs(note.created_at).format("DD MMM, YYYY")}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
            <FileUp className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Empty Vault</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">You haven't uploaded any notes yet. Let's change that and get studying!</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Note</span>
          </button>
        </div>
      )}
    </div>
  );
}
