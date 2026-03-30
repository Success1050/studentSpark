"use client";

import { motion } from "framer-motion";
import { 
  Lightbulb, 
  Rocket, 
  Users, 
  Globe, 
  Heart, 
  ShieldCheck, 
  Star, 
  ArrowLeft,
  Mail,
  Zap,
  BookOpen,
  Award,
  Crown
} from "lucide-react";
import { useRouter } from "next/navigation";

const StatCard = ({ value, label, icon: IconComponent }: { value: string, label: string, icon: any }) => (
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 text-center space-y-3 shadow-xl transition-all duration-500 hover:-translate-y-2">
    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
      <IconComponent className="w-6 h-6" />
    </div>
    <div className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{value}</div>
    <div className="text-zinc-500 dark:text-zinc-400 font-extrabold uppercase text-[10px] tracking-widest">{label}</div>
  </div>
);

const FeatureItem = ({ title, description, icon: IconComponent, color }: { title: string, description: string, icon: any, color: string }) => (
  <div className="group bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 space-y-6 shadow-xl transition-all duration-500 hover:border-zinc-300 dark:hover:border-zinc-700">
    <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
      <IconComponent className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-none uppercase tracking-tight">{title}</h3>
    <p className="text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed">{description}</p>
  </div>
);

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black p-4 sm:p-10 lg:p-20 transition-all">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-zinc-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-indigo-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Mission Protocol</span>
        </button>

        {/* Hero Section */}
        <section className="relative text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
            <Zap className="w-4 h-4" />
            <span>Since 2024</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-[0.85]">
              Ignite Your <br />
              <span className="text-indigo-500">Learning.</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed">
              StudentSpark is dedicated to revolutionizing the way students retain information using cutting-edge AI.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-400">
            <span>Version 1.0.0 Stable</span>
            <span className="w-1 h-1 bg-zinc-300 rounded-full my-auto"></span>
            <span>Cloud Sync Active</span>
          </div>
        </section>

        {/* Mission Card */}
        <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-white shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center flex-shrink-0 animate-bounce group-hover:rotate-12 transition-transform duration-700 shadow-2xl border border-white/20">
              <Rocket className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">Our Mission</h2>
              <p className="text-xl md:text-3xl font-bold leading-tight text-indigo-50 opacity-90 max-w-3xl">
                We leverage hyper-intelligent AI to transform static notes into dynamic, personalized learning experiences that adapt to your unique academic pace.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard value="10K+" label="Global Students" icon={Users} />
          <StatCard value="50K+" label="Summaries Crafted" icon={BookOpen} />
          <StatCard value="100K+" label="Questions Solved" icon={Award} />
        </div>

        {/* Features Section */}
        <section className="space-y-12">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            What We Offer
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800 ml-4"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureItem 
              icon={Zap} 
              title="AI Summaries" 
              description="Upload your complex notes and get concise, intelligent summaries that capture the DNA of the subject."
              color="bg-violet-500"
            />
            <FeatureItem 
              icon={Crown} 
              title="Mastery Testing" 
              description="Generate unlimited practice questions based on your specific materials to ensure total topic mastery."
              color="bg-rose-500"
            />
            <FeatureItem 
              icon={Star} 
              title="Smart Roadmaps" 
              description="Personalized study schedules that optimize your learning based on your upcoming academic deadlines."
              color="bg-emerald-500"
            />
            <FeatureItem 
              icon={Globe} 
              title="Master Analytics" 
              description="Detailed visual insights into your learning journey, identifying strengths and growth opportunities."
              color="bg-amber-500"
            />
          </div>
        </section>

        {/* Contact info / Story */}
        <div className="bg-zinc-900 rounded-[4rem] p-12 md:p-20 text-center space-y-12 border border-white/5 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          <div className="space-y-6 max-w-3xl mx-auto">
            <Heart className="w-12 h-12 text-rose-500 mx-auto fill-current" />
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Powered by Purpose</h2>
            <p className="text-xl font-bold text-zinc-400 leading-relaxed">
              Founded by specialists in education and AI, we believe quality tools should be universally accessible. Made with ❤️ for students worldwide.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <a href="mailto:successtravel31@gmail.com" className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all uppercase text-xs tracking-widest shadow-xl">Contact Us</a>
            <a href="https://www.emmanuelsuccess.com" target="_blank" className="px-10 py-5 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all uppercase text-xs tracking-widest border border-white/5">Website</a>
          </div>
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
}
