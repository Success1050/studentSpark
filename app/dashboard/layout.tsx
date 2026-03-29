"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Bell, 
  Flame, 
  Sparkles, 
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Student");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(" ")[0] || "Student");
      }
    };
    fetchUser();
  }, []);

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "My Notes", icon: BookOpen, href: "/dashboard/notes" },
    { label: "Quizzes", icon: HelpCircle, href: "/dashboard/quizzes" },
    { label: "Study Plan", icon: Calendar, href: "/dashboard/plan" },
    { label: "Tracker", icon: BarChart3, href: "/dashboard/tracker" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans selection:bg-indigo-100 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-zinc-900 z-[70] lg:hidden flex flex-col border-r border-zinc-100 dark:border-zinc-800 shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 transition-transform hover:rotate-12">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">StudySpark</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <nav className="flex-1 px-4 mt-4 space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.label} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                      pathname === item.href 
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shadow-sm border border-indigo-100 dark:border-indigo-500/20" 
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-bold">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all font-bold group"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside 
        className={`${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden lg:flex flex-col h-screen sticky top-0 z-[50] shadow-sm`}
      >
        <div className="p-6 flex items-center gap-3 h-20 overflow-hidden shrink-0">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 transition-transform hover:rotate-12 cursor-pointer" onClick={() => router.push("/dashboard")}>
            <Sparkles className="w-6 h-6" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis"
              >
                StudySpark
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all relative group ${
                pathname === item.href 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shadow-sm border border-indigo-100 dark:border-indigo-500/20" 
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform ${pathname === item.href ? "scale-110" : "group-hover:scale-110"}`} />
              {isSidebarOpen && (
                <span className="font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
              )}
              {pathname === item.href && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-3 mt-auto border-t border-zinc-100 dark:border-zinc-800">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all font-bold group overflow-hidden"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-[40] flex items-center justify-between px-6 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:flex hidden w-10 h-10 items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="w-4 h-4 text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-24 lg:w-48 placeholder:text-zinc-400 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 shadow-sm transition-transform hover:scale-105 cursor-pointer">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span className="text-sm font-black truncate max-w-[60px] sm:max-w-none">5 Days</span>
            </div>

            <button className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>
            
            <Link 
              href="/dashboard/profile"
              className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black border border-indigo-600 ring-4 ring-indigo-500/10 overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <span className="text-lg uppercase">{userName[0]}</span>
            </Link>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
