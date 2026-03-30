import { BarChart3, BookOpen, Calendar, Fingerprint, HelpCircle, Info, LayoutDashboard, LifeBuoy, Shield, User } from "lucide-react";

  export const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "My Notes", icon: BookOpen, href: "/dashboard/notes" },
    { label: "Quizzes", icon: HelpCircle, href: "/dashboard/quizzes" },
    { label: "Study Plan", icon: Calendar, href: "/dashboard/plan" },
    { label: "Tracker", icon: BarChart3, href: "/dashboard/tracker" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
  ];

  export const legalItems = [
    { label: "About Us", icon: Info, href: "/legal/about" },
    { label: "Support", icon: LifeBuoy, href: "/legal/support" },
    { label: "Terms", icon: Shield, href: "/legal/terms" },
    { label: "Privacy", icon: Fingerprint, href: "/legal/privacy" },
  ];