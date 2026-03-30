"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Book, 
  BarChart, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Section = ({ icon: IconComponent, title, children }: { icon: any, title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden transition-all duration-300 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
            <IconComponent className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-6 h-6 text-zinc-400" /> : <ChevronDown className="w-6 h-6 text-zinc-400" />}
      </button>
      {isOpen && (
        <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
          <div className="pt-2 border-t border-zinc-50 dark:border-zinc-800 space-y-4 text-zinc-500 dark:text-zinc-400 leading-relaxed font-bold">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black p-4 sm:p-10 lg:p-20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-zinc-400 font-black uppercase text-xs tracking-widest hover:text-indigo-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Go Back</span>
        </button>

        {/* Header */}
        <section className="text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-500/30">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
            Terms & Conditions
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-bold max-w-xl mx-auto">
            Please review our terms before using StudentSpark. We're committed to your academic excellence.
          </p>
        </section>

        {/* Intro Card */}
        <div className="bg-indigo-500 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <p className="text-xl md:text-2xl font-black leading-tight tracking-tight relative z-10">
            Welcome to StudentSpark! By using our platform, you agree to these terms. We help you succeed with AI-powered study tools.
          </p>
          <p className="mt-6 text-indigo-100 font-bold uppercase text-xs tracking-[0.2em]">
            Last updated: November 16, 2025
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <Section icon={FileText} title="Service Description">
            <p>StudentSpark provides the following AI-powered services:</p>
            <ul className="space-y-3">
              {[
                "AI-generated summarized notes from your uploaded materials",
                "Interactive practice questions generated based on your content",
                "Personalized study plan and roadmap generation",
                "Academic performance tracking and analytics"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={CreditCard} title="Subscription & Payment">
            <p>We operate on a subscription-based model. By subscribing, you agree to:</p>
            <ul className="space-y-3">
              {[
                "Automatic recurring payments based on your chosen plan",
                "Secure processing through international payment providers",
                "Cancellation at any time, effective at end of period",
                "No refunds for partial months or unused time"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Book} title="User Content & Data">
            <p>Your materials remain yours. We respect your intellectual property:</p>
            <ul className="space-y-3">
              {[
                "You retain full ownership of all content you upload",
                "Permission granted only to process content for service delivery",
                "You ensure rights to all uploaded materials",
                "Industry-standard encryption for data protection",
                "Academic data kept private and secure"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={BarChart} title="AI-Generated Content">
            <p>Our AI enhances learning but requires human oversight:</p>
            <ul className="space-y-3">
              {[
                "Summaries are for study assistance only",
                "Accuracy is prioritized but content should be reviewed",
                "We are not responsible for specific exam results",
                "Follow your institution's academic integrity policies"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Footer info */}
        <div className="text-center pt-8 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-400 font-bold text-sm">
            Questions? Contact us at <span className="text-indigo-500">successtravel31@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
