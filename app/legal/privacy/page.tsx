"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  Users,
  Trash2,
  RefreshCcw,
  ArrowLeft,
  Mail,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PolicySection = ({ icon: IconComponent, title, content }: { icon: any, title: string, content: string[] }) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] p-10 space-y-6 shadow-xl transition-all duration-300 hover:border-emerald-500/30">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-none">{title}</h3>
    </div>
    <ul className="space-y-4">
      {content.map((item, i) => (
        <li key={i} className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400 font-bold leading-relaxed">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-black p-4 sm:p-10 lg:p-20 transition-all">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-zinc-400 font-black uppercase text-xs tracking-widest hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Security Hub</span>
        </button>

        {/* Header */}
        <section className="text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/30">
            <Lock className="w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-bold max-w-2xl mx-auto">
            Your privacy matters to us. Learn how StudentSpark protects your data with bank-level encryption.
          </p>
        </section>

        {/* Commitment Card */}
        <div className="bg-zinc-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-emerald-400">Our Commitment</h2>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-zinc-300">
                At <span className="text-emerald-400">StudentSpark</span>, we are committed to protecting your personal information and your right to privacy. Effective Date: November 16, 2025.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PolicySection
            icon={FileText}
            title="Data Collection"
            content={[
              "Account details (Name, Email, Password)",
              "Study materials and notes you upload",
              "Study progress, quiz results, and mastery",
              "Securely processed payment records",
              "Device information and performance logs"
            ]}
          />
          <PolicySection
            icon={RefreshCcw}
            title="How We Use Data"
            content={[
              "Generate personalized AI summaries",
              "Construct custom study plans",
              "Process subscription managing",
              "Improve AI algorithm precision",
              "Send critical updates and alerts"
            ]}
          />
          <PolicySection
            icon={Users}
            title="Safe Data Sharing"
            content={[
              "We NEVER sell your personal data",
              "Shared only with AI processing providers",
              "Transferred to secure payment systems",
              "Analytics for internal performance",
              "Legal compliance when required"
            ]}
          />
          <PolicySection
            icon={Trash2}
            title="Retention & Rights"
            content={[
              "Access and download your personal data",
              "Correct inaccurate or incomplete info",
              "Full deletion of account and materials",
              "Opt-out of promotional interactions",
              "Object to specific data processing"
            ]}
          />
        </div>

        {/* Contact info */}
        <div className="bg-emerald-500/5 dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 p-12 rounded-[3.5rem] text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black uppercase text-zinc-900 dark:text-white">Security Questions?</h3>
          <p className="text-zinc-500 font-bold max-w-xl mx-auto">
            If you have any questions or concerns about this privacy policy, please contact us at:
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">successtravel31@gmail.com</p>
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
}
