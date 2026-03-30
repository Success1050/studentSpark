"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  Search, 
  Mail, 
  Phone, 
  CloudUpload, 
  FileText, 
  HelpCircle as HelpIcon, 
  CreditCard, 
  Calendar, 
  BarChart, 
  Lock, 
  Languages, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  XCircle,
  Bug,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FAQItem = ({ question, answer, icon: IconComponent }: { question: string, answer: string, icon: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden transition-all duration-300 shadow-sm hover:border-amber-500/30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-7 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
            <IconComponent className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white leading-tight text-left">{question}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
      </button>
      {isOpen && (
        <div className="px-7 pb-7 animate-in slide-in-from-top-2 duration-300">
          <p className="pt-2 border-t border-zinc-50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 leading-relaxed font-bold">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default function SupportPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const faqs = [
    {
      icon: CloudUpload,
      question: "How do I upload my notes?",
      answer: "Tap the '+' button on the home screen, select 'Upload Notes', then choose files from your device. We support PDF, DOC, DOCX, TXT, and image formats. Your notes will be processed within seconds."
    },
    {
      icon: FileText,
      question: "How are summaries generated?",
      answer: "Our AI analyzes your materials using advanced natural language processing. It identifies key concepts, main ideas, and important details, then creates a concise summary while maintaining the context of your original material."
    },
    {
      icon: HelpIcon,
      question: "What types of practice questions can I generate?",
      answer: "You can generate multiple-choice, true/false, short answer, and essay-style questions. The AI creates questions based on the content and difficulty level you select, ensuring they align with your study goals."
    },
    {
      icon: CreditCard,
      question: "How does the subscription work?",
      answer: "StudentSpark offers monthly and annual plans. You can cancel anytime, and your subscription will remain active until the end of the billing period. We accept all major credit cards and secure payment providers."
    },
    {
      icon: Calendar,
      question: "Can I customize my study plan?",
      answer: "Yes! Your study plan is fully customizable. You can adjust study duration, set specific goals, choose subjects to focus on, and modify the schedule to fit your availability. The AI will adapt recommendations based on your progress."
    },
    {
      icon: BarChart,
      question: "How is my progress tracked?",
      answer: "We track multiple metrics including study time, quiz scores, completed topics, and learning streaks. The dashboard provides visual analytics showing your improvement over time and areas that need more attention."
    },
    {
      icon: Lock,
      question: "Is my data secure?",
      answer: "Absolutely! We use bank-level encryption (AES-256) to protect your data. Your notes and personal information are stored securely on encrypted servers. We never share your data with third parties without your explicit consent."
    },
    {
      icon: Languages,
      question: "What languages are supported?",
      answer: "Currently, StudentSpark supports English, Spanish, French, German, Italian, Portuguese, and Chinese. We're continuously adding more languages. The AI can process notes in one language and generate summaries in another."
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-black p-4 sm:p-10 lg:p-20 transition-all">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-zinc-400 font-black uppercase text-xs tracking-widest hover:text-amber-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Help Center</span>
        </button>

        {/* Header */}
        <section className="text-center space-y-6">
          <div className="w-24 h-24 bg-amber-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-amber-500/30">
            <HelpCircle className="w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
            Help & Support
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-bold max-w-2xl mx-auto">
            We're here to help you succeed with <span className="text-indigo-500">StudentSpark</span>. Explore resources or reach out to our team.
          </p>
        </section>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search for help, topics, or FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-16 py-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] text-lg font-bold focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all shadow-xl"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200"
            >
              <XCircle className="w-5 h-5 text-zinc-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ List (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              Frequently Asked Questions
              <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800 ml-4"></div>
            </h2>
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
                <FAQItem key={i} {...faq} />
              )) : (
                <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-zinc-500 font-bold">No results found for "{search}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact (1/3) */}
          <aside className="space-y-8">
            <div className="bg-zinc-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 space-y-10">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white fill-current" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Need Direct Help?</h3>
                  <p className="text-zinc-400 font-bold leading-relaxed">Our support team is available 24/7 to assist you with any issues.</p>
                </div>
                <div className="space-y-6">
                  <a href="mailto:successtravel31@gmail.com" className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                      <Mail className="w-5 h-5 text-amber-500 group-hover:text-white" />
                    </div>
                    <span className="font-bold underline underline-offset-4 overflow-hidden truncate">successtravel31@gmail.com</span>
                  </a>
                  <a href="tel:+12348128032967" className="flex items-center gap-4 group cursor-pointer text-zinc-400 hover:text-white transition-colors">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-bold">+1 (234) 8128032967</span>
                  </a>
                </div>
                <button className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">
                  Email Support Team
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[2.5rem] space-y-6 shadow-xl">
              <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none">Other Resources</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl group transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <div className="flex items-center gap-3">
                    <Bug className="w-5 h-5 text-indigo-500" />
                    <span className="font-bold uppercase text-[10px] tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white">Report a Bug</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-300 -rotate-90" />
                </button>
                <p className="text-[10px] font-black text-center text-zinc-400 uppercase tracking-widest">StudentSpark v1.0.0 (Stable)</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
}
