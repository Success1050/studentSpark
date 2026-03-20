"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, GraduationCap, CalendarDays, ChevronRight, Check, ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const onboardingSteps = [
  {
    id: 1,
    title: "Scan & Summarize",
    description: "Upload your PDF notes and let StudySpark AI instantly extract key topics and create concise summaries for faster learning.",
    image: "/images/onboarding1.jpg",
    icon: FileText,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-500/10",
    textColor: "text-indigo-500",
  },
  {
    id: 2,
    title: "Quiz Your Knowledge",
    description: "Transform your study materials into interactive quizzes and exam-style past questions to boost your retention and confidence.",
    image: "/images/onboarding2.jpg",
    icon: GraduationCap,
    color: "bg-amber-500",
    lightColor: "bg-amber-500/10",
    textColor: "text-amber-500",
  },
  {
    id: 3,
    title: "Smart Study Plans",
    description: "Get personalized study schedules based on your exam dates. Track your progress and master your time like a pro.",
    image: "/images/onboarding3.jpg",
    icon: CalendarDays,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-500/10",
    textColor: "text-emerald-500",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [showEntry, setShowEntry] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleStart = () => {
    setShowEntry(false);
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Navigating to signup...");
      router.push("/auth/signup");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    console.log("Skipping to signup...");
    router.push("/auth/signup");
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 font-sans transition-colors duration-300 overflow-hidden">
      <AnimatePresence mode="wait">
        {showEntry ? (
          <motion.div
            key="entry"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-center text-center px-4"
          >
            {/* Animated Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mb-8 mx-auto transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <Sparkles className="w-12 h-12" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                Study<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">Spark</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto mb-12 font-medium leading-relaxed">
                Your AI-powered academic companion. Master your notes, ace your exams.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleStart}
                  className="group relative px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Start Your Journey
                    <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>

                <button
                  onClick={() => router.push("/auth/signin")}
                  className="px-10 py-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 w-full sm:w-auto"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center justify-center"
          >
            <main className="relative flex w-full max-w-5xl flex-col lg:flex-row items-center overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl xl:min-h-[700px]">
              {/* Rest of the onboarding layout */}
        {/* Left side: Images (or top side on mobile) */}
        <div className="relative w-full lg:w-1/2 h-[45vh] lg:h-full bg-slate-100 dark:bg-black/50 overflow-hidden flex items-center justify-center p-6 lg:p-12">
          {/* Decorative background blobs with glass effect */}
          <div className="absolute top-0 -left-10 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:mix-blend-overlay"></div>
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 dark:mix-blend-overlay"></div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 260, damping: 20 }, opacity: { duration: 0.3 } }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-sm aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/40 dark:border-white/10 glass">
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-400 font-bold">Step {step.id}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side: Content (or bottom side on mobile) */}
        <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 h-full min-h-[400px]">
          {/* Skip Button */}
          <div className="flex justify-between items-center h-8">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-indigo-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            {!isLastStep && (
              <button
                onClick={handleSkip}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                Skip
              </button>
            )}
          </div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 260, damping: 20 }, opacity: { duration: 0.3 } }}
              className="flex flex-col items-start mt-4 lg:mt-0"
            >
              <div className={`flex items-center justify-center w-20 h-20 rounded-3xl mb-8 shadow-inner ${step.lightColor}`}>
                <step.icon className={`w-10 h-10 ${step.textColor}`} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]">
                {step.title}
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="mt-12 flex items-center justify-between">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2.5">
              {onboardingSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentStep ? 1 : -1);
                    setCurrentStep(index);
                  }}
                  className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden cursor-pointer ${
                    index === currentStep 
                      ? `w-12 ${step.color} shadow-lg shadow-indigo-500/20` 
                      : "w-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            {/* Next / Start Button */}
            <button
              onClick={handleNext}
              className={`group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl ${
                isLastStep 
                  ? "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/25" 
                  : `${step.color} hover:brightness-110`
              }`}
            >
              {isLastStep ? (
                <>
                  <span>Get Started Now</span>
                  <Check className="w-5 h-5 ml-1" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
          </main>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
