import { useState, useRef } from "react";
import {
  LayoutDashboard, Users, TrendingUp, FileText, Settings, Brain,
  Bell, Search, ChevronDown, ArrowRight, CheckCircle, Zap,
  Shield, BarChart3, LogOut, Menu, X, Download, Filter,
  AlertTriangle, TrendingDown, DollarSign, Activity, Star,
  ChevronRight, Upload, RefreshCw, Eye, Layers, Target,
  PieChart, Clock, Mail, Phone, Building2, Globe, Lock,
  User, Palette, BellRing, Cpu, ArrowUpRight, ArrowDownRight,
  Sparkles, BookOpen, Play, Github, Twitter, Linkedin,
  ChevronLeft
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend, BarChart, Bar,
  AreaChart, Area
} from "recharts";

// ─── Color tokens ──────────────────────────────────────────────────────────
const C = {
  primary: "#424658",
  secondary: "#6C739C",
  accent1: "#C56B62",
  accent2: "#DEA785",
  bg: "#F0DAD5",
  card: "#FFFFFF",
  neutral: "#BABBB1",
  sidebarAccent: "#D9A69F",
};

// ─── Mock data ──────────────────────────────────────────────────────────────
const churnTrendData = [
  { month: "Jan", churnRate: 8.2, retained: 91.8 },
  { month: "Feb", churnRate: 7.8, retained: 92.2 },
  { month: "Mar", churnRate: 9.1, retained: 90.9 },
  { month: "Apr", churnRate: 6.5, retained: 93.5 },
  { month: "May", churnRate: 7.2, retained: 92.8 },
  { month: "Jun", churnRate: 5.9, retained: 94.1 },
  { month: "Jul", churnRate: 6.3, retained: 93.7 },
  { month: "Aug", churnRate: 4.8, retained: 95.2 },
];

const segmentData = [
  { name: "Champions", value: 28, color: "#424658" },
  { name: "At Risk", value: 22, color: "#C56B62" },
  { name: "Loyal", value: 31, color: "#6C739C" },
  { name: "Lost", value: 19, color: "#DEA785" },
];

const predictions = [
  { id: "C-10421", name: "Sarah Mitchell", email: "s.mitchell@acme.com", risk: 87, segment: "At Risk", ltv: "$12,400", date: "2024-07-22" },
  { id: "C-10388", name: "James Okafor", email: "j.okafor@vertex.io", risk: 62, segment: "Needs Attention", ltv: "$8,750", date: "2024-07-21" },
  { id: "C-10355", name: "Priya Nair", email: "priya.n@synapse.co", risk: 34, segment: "Loyal", ltv: "$21,200", date: "2024-07-21" },
  { id: "C-10302", name: "Tom Becker", email: "t.becker@finterra.com", risk: 91, segment: "At Risk", ltv: "$5,300", date: "2024-07-20" },
  { id: "C-10289", name: "Aisha Kamara", email: "aisha@horizons.ai", risk: 18, segment: "Champion", ltv: "$34,600", date: "2024-07-20" },
];

const shapFeatures = [
  { feature: "Support Tickets (last 30d)", impact: 0.34, direction: "high" },
  { feature: "Login Frequency Drop", impact: 0.28, direction: "high" },
  { feature: "Contract End Proximity", impact: 0.21, direction: "high" },
  { feature: "Feature Adoption Rate", impact: -0.18, direction: "low" },
  { feature: "NPS Score", impact: -0.14, direction: "low" },
  { feature: "Billing Anomalies", impact: 0.09, direction: "high" },
];

const revenueData = [
  { month: "Jan", at_risk: 142000, retained: 890000, recovered: 38000 },
  { month: "Feb", at_risk: 128000, retained: 912000, recovered: 44000 },
  { month: "Mar", at_risk: 167000, retained: 875000, recovered: 29000 },
  { month: "Apr", at_risk: 98000, retained: 954000, recovered: 61000 },
  { month: "May", at_risk: 112000, retained: 932000, recovered: 53000 },
  { month: "Jun", at_risk: 89000, retained: 978000, recovered: 72000 },
];

const clusterData = [
  { cluster: "Champions", customers: 1284, avgLTV: "$28,400", churnProb: "4%", health: 94, color: C.primary },
  { cluster: "Loyal Customers", customers: 1891, avgLTV: "$14,200", churnProb: "12%", health: 78, color: C.secondary },
  { cluster: "Needs Attention", customers: 743, avgLTV: "$7,800", churnProb: "38%", health: 42, color: C.accent2 },
  { cluster: "At Risk", customers: 512, avgLTV: "$4,100", churnProb: "71%", health: 21, color: C.accent1 },
  { cluster: "Cannot Lose", customers: 198, avgLTV: "$52,000", churnProb: "29%", health: 58, color: C.sidebarAccent },
  { cluster: "Lost", customers: 389, avgLTV: "$2,900", churnProb: "94%", health: 8, color: C.neutral },
];

const predictionHistory = [
  { id: "P-2847", customer: "Sarah Mitchell", date: "Jul 22, 2024", risk: 87, action: "Email Sent", outcome: "Pending" },
  { id: "P-2831", customer: "Tom Becker", date: "Jul 20, 2024", risk: 91, action: "Call Scheduled", outcome: "Converted" },
  { id: "P-2819", customer: "Hana Yuki", date: "Jul 19, 2024", risk: 55, action: "Discount Offered", outcome: "Converted" },
  { id: "P-2804", customer: "Luca Romano", date: "Jul 18, 2024", risk: 72, action: "Email Sent", outcome: "Churned" },
  { id: "P-2791", customer: "Fatima Al-Amin", date: "Jul 17, 2024", risk: 29, action: "None", outcome: "Active" },
  { id: "P-2778", customer: "David Chen", date: "Jul 16, 2024", risk: 68, action: "Discount Offered", outcome: "Converted" },
];

// ─── Utility ────────────────────────────────────────────────────────────────
function riskColor(r: number) {
  if (r >= 75) return C.accent1;
  if (r >= 45) return C.accent2;
  return "#6dbb8a";
}

function riskLabel(r: number) {
  if (r >= 75) return "High Risk";
  if (r >= 45) return "Medium";
  return "Low Risk";
}

// ─── Shared Components ───────────────────────────────────────────────────────
function Badge({ children, color = C.accent1 }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: color + "22", color }}>
      {children}
    </span>
  );
}

function KPICard({ icon: Icon, label, value, change, changeDir, color = C.secondary }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: C.neutral + "40" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change && (
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: changeDir === "up" ? "#6dbb8a" : C.accent1 }}>
            {changeDir === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: C.primary }}>{value}</p>
      <p className="text-sm" style={{ color: C.neutral }}>{label}</p>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "predict", label: "Predict Customer", icon: Brain },
  { id: "result", label: "Prediction Result", icon: Target },
  { id: "segments", label: "Customer Segments", icon: Layers },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ active, onNav, collapsed, onToggle }: { active: string; onNav: (id: string) => void; collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-20"
      style={{ width: collapsed ? 72 : 240, background: C.primary, minWidth: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.accent1 }}>
          <Brain size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-none">RetainIQ</p>
            <p className="text-xs mt-0.5" style={{ color: C.sidebarAccent }}>AI Churn Platform</p>
          </div>
        )}
        <button onClick={onToggle} className="ml-auto text-white opacity-50 hover:opacity-100 transition-opacity">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 relative group"
              style={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
              }}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full" style={{ background: C.accent1 }} />
              )}
              <Icon size={18} style={{ color: isActive ? C.sidebarAccent : "rgba(255,255,255,0.55)", flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: C.sidebarAccent, color: C.primary }}>
            AK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">Amir Khan</p>
              <p className="text-xs truncate" style={{ color: C.sidebarAccent }}>Admin</p>
            </div>
          )}
          {!collapsed && <LogOut size={15} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0, cursor: "pointer" }} />}
        </div>
      </div>
    </aside>
  );
}

// ─── Top Navbar ───────────────────────────────────────────────────────────────
function Topbar({ title, onNav }: { title: string; onNav?: (id: string) => void }) {
  return (
    <header className="bg-white border-b flex items-center gap-4 px-6 py-3 sticky top-0 z-10" style={{ borderColor: C.neutral + "40" }}>
      <div>
        <h1 className="text-base font-semibold" style={{ color: C.primary }}>{title}</h1>
      </div>
      <div className="flex-1 max-w-xs ml-auto">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.neutral }} />
          <input
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none border"
            style={{ borderColor: C.neutral + "50", background: C.bg, color: C.primary, fontFamily: "Poppins, sans-serif" }}
          />
        </div>
      </div>
      <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
        <Bell size={18} style={{ color: C.neutral }} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: C.accent1 }} />
      </button>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer" style={{ background: C.sidebarAccent, color: C.primary }}>
        AK
      </div>
    </header>
  );
}

// ─── Screen: Landing Page ────────────────────────────────────────────────────
function LandingPage({ onNav }: { onNav: (id: string) => void }) {
  const features = [
    { icon: Brain, title: "Explainable AI Predictions", desc: "SHAP-powered explanations show exactly why a customer is at risk — no black boxes." },
    { icon: Target, title: "Precision Segmentation", desc: "Automatically cluster customers by behavior, LTV, and engagement for hyper-targeted interventions." },
    { icon: Zap, title: "Real-time Risk Scoring", desc: "Continuous scoring pipeline updates churn probabilities as new customer events stream in." },
    { icon: Shield, title: "Retention Playbooks", desc: "AI-generated action plans tailored to each customer segment and risk profile." },
    { icon: BarChart3, title: "Revenue Impact Analytics", desc: "Quantify retained revenue, measure intervention ROI, and track cohort health over time." },
    { icon: Cpu, title: "Seamless Integrations", desc: "Connect to Salesforce, HubSpot, Intercom, Stripe, and your data warehouse in minutes." },
  ];

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "Poppins, sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center gap-8 px-12 py-5 bg-white border-b" style={{ borderColor: C.neutral + "30" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.accent1 }}>
            <Brain size={16} color="#fff" />
          </div>
          <span className="font-bold text-base" style={{ color: C.primary }}>RetainIQ</span>
        </div>
        <div className="flex items-center gap-6 ml-6">
          {["Features", "Pricing", "Docs", "Blog"].map(l => (
            <a key={l} href="#" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: C.secondary }}>{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={() => onNav("login")} className="text-sm font-medium px-4 py-2 rounded-xl transition-colors hover:bg-gray-50" style={{ color: C.primary }}>
            Sign In
          </button>
          <button onClick={() => onNav("dashboard")} className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90" style={{ background: C.accent1 }}>
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-12 pt-20 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: C.accent1 + "18", color: C.accent1 }}>
              <Sparkles size={12} />
              Now with GPT-4 retention copilot
            </div>
            <h1 className="font-bold leading-tight mb-6" style={{ fontSize: 48, color: C.primary, lineHeight: 1.15 }}>
              Predict Churn.<br />
              <span style={{ color: C.accent1 }}>Retain Revenue.</span><br />
              Understand Why.
            </h1>
            <p className="text-base mb-8 leading-relaxed" style={{ color: C.secondary }}>
              RetainIQ uses explainable machine learning to identify at-risk customers before they leave — and gives your team the exact playbook to win them back.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => onNav("dashboard")} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-lg" style={{ background: C.accent1, boxShadow: `0 8px 24px ${C.accent1}40` }}>
                Get Started Free
                <ArrowRight size={16} />
              </button>
              <button onClick={() => onNav("dashboard")} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm border transition-all hover:bg-white" style={{ borderColor: C.neutral + "60", color: C.primary }}>
                <Play size={15} />
                Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10">
              {[["4,200+", "Companies"], ["98.1%", "Accuracy"], ["3.2×", "Avg ROI"]].map(([v, l]) => (
                <div key={l}>
                  <p className="font-bold text-xl" style={{ color: C.primary }}>{v}</p>
                  <p className="text-xs" style={{ color: C.neutral }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="rounded-3xl p-6 shadow-2xl" style={{ background: C.primary }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Mono, monospace" }}>retainiq.ai/dashboard</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-white">Sarah Mitchell</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: C.accent1 + "30", color: C.accent1 }}>87% Risk</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: "87%", background: C.accent1 }} />
                  </div>
                  <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>Top driver: 12 support tickets in 30 days</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[["1,284", "At Risk"], ["$2.4M", "Revenue at Stake"], ["89%", "Saved this month"]].map(([v, l]) => (
                    <div key={l} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <p className="text-sm font-bold text-white">{v}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>{l}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <p className="text-xs font-medium mb-2" style={{ color: C.sidebarAccent }}>AI Recommendation</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Offer a 15% loyalty discount + dedicated CSM outreach within 48h to reduce churn probability by ~34%.</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: C.accent2 }}>
              <div className="text-center">
                <p className="text-xl font-bold" style={{ color: C.primary }}>94%</p>
                <p className="text-xs" style={{ color: C.primary + "80" }}>Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-12 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3" style={{ color: C.primary }}>Everything you need to stop churn</h2>
          <p className="text-base" style={{ color: C.secondary }}>Built for CS teams, data teams, and executives who want results — not just dashboards.</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border hover:shadow-md transition-shadow" style={{ borderColor: C.neutral + "30" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: C.accent1 + "15" }}>
                <Icon size={20} style={{ color: C.accent1 }} />
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: C.primary }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.secondary }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-12 mb-20 rounded-3xl p-16 text-center" style={{ background: C.primary }}>
        <h2 className="text-3xl font-bold text-white mb-4">Ready to recover lost revenue?</h2>
        <p className="mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>Start predicting churn in under 5 minutes. No credit card required.</p>
        <button onClick={() => onNav("dashboard")} className="px-8 py-4 rounded-2xl font-semibold text-white transition-all hover:opacity-90 shadow-lg" style={{ background: C.accent1 }}>
          Start for Free — No CC Required
        </button>
      </section>

      {/* Footer */}
      <footer className="px-12 py-8 border-t flex items-center justify-between" style={{ borderColor: C.neutral + "40" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: C.accent1 }}>
            <Brain size={13} color="#fff" />
          </div>
          <span className="font-bold text-sm" style={{ color: C.primary }}>RetainIQ</span>
        </div>
        <p className="text-xs" style={{ color: C.neutral }}>© 2024 RetainIQ Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {[Github, Twitter, Linkedin].map((Icon, i) => (
            <Icon key={i} size={16} style={{ color: C.neutral, cursor: "pointer" }} />
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── Screen: Login ────────────────────────────────────────────────────────────
function LoginPage({ onNav }: { onNav: (id: string) => void }) {
  const [email, setEmail] = useState("amir@retainiq.ai");
  const [pass, setPass] = useState("••••••••");

  return (
    <div className="min-h-screen grid grid-cols-2" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Left – form */}
      <div className="flex flex-col justify-center px-16 py-12 bg-white">
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.accent1 }}>
            <Brain size={16} color="#fff" />
          </div>
          <span className="font-bold text-base" style={{ color: C.primary }}>RetainIQ</span>
        </div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: C.primary }}>Welcome back</h2>
        <p className="text-sm mb-10" style={{ color: C.secondary }}>Sign in to your account to continue</p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.primary }}>Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.neutral }} />
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2"
                style={{ borderColor: C.neutral + "60", fontFamily: "Poppins", color: C.primary, background: C.bg + "80" }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.primary }}>Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.neutral }} />
              <input
                type="password" value={pass} onChange={e => setPass(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: C.neutral + "60", fontFamily: "Poppins", color: C.primary, background: C.bg + "80" }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs" style={{ color: C.secondary }}>
              <input type="checkbox" className="rounded" defaultChecked />
              Remember me
            </label>
            <a href="#" className="text-xs font-medium" style={{ color: C.accent1 }}>Forgot password?</a>
          </div>
          <button onClick={() => onNav("dashboard")} className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90" style={{ background: C.accent1 }}>
            Sign In
          </button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: C.neutral + "40" }} />
          <span className="text-xs" style={{ color: C.neutral }}>or continue with</span>
          <div className="flex-1 h-px" style={{ background: C.neutral + "40" }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[["Google", "G"], ["Microsoft", "M"]].map(([name, letter]) => (
            <button key={name} className="flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium hover:bg-gray-50 transition-colors" style={{ borderColor: C.neutral + "50", color: C.primary }}>
              <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold" style={{ background: C.secondary + "20", color: C.secondary }}>{letter}</span>
              {name}
            </button>
          ))}
        </div>

        <p className="text-xs text-center mt-8" style={{ color: C.neutral }}>
          {"Don't have an account? "}
          <a href="#" className="font-semibold" style={{ color: C.accent1 }}>Start free trial</a>
        </p>
      </div>

      {/* Right – visual */}
      <div className="flex flex-col justify-center p-12" style={{ background: C.primary }}>
        <div className="max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8" style={{ background: C.accent1 }}>
            <Brain size={24} color="#fff" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Turn churn risk into retained revenue</h3>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Join 4,200+ companies using RetainIQ to predict, explain, and prevent customer churn with AI.
          </p>
          <div className="space-y-4">
            {[
              "Explainable predictions with SHAP feature importance",
              "AI-generated personalized retention playbooks",
              "Real-time churn scoring as events stream in",
              "One-click integrations with 40+ tools",
            ].map(t => (
              <div key={t} className="flex items-start gap-3">
                <CheckCircle size={16} style={{ color: C.sidebarAccent, flexShrink: 0, marginTop: 1 }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: C.sidebarAccent, color: C.primary }}>VL</div>
              <div>
                <p className="text-xs font-semibold text-white">Valentina López</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Head of CS, Nexus SaaS</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              "RetainIQ helped us reduce churn by 38% in Q1. The SHAP explanations are a game changer for our CS team."
            </p>
            <div className="flex items-center gap-0.5 mt-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={C.accent2} style={{ color: C.accent2 }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────
function Dashboard({ onNav }: { onNav: (id: string) => void }) {
  return (
    <div className="p-6 space-y-6" style={{ background: C.bg, fontFamily: "Poppins, sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Customers" value="5,017" change="4.2%" changeDir="up" color={C.secondary} />
        <KPICard icon={AlertTriangle} label="At-Risk Customers" value="1,284" change="8.1%" changeDir="down" color={C.accent1} />
        <KPICard icon={TrendingDown} label="Churn Rate (MTD)" value="4.8%" change="1.4%" changeDir="up" color={C.accent2} />
        <KPICard icon={DollarSign} label="Revenue at Risk" value="$2.4M" change="6.3%" changeDir="up" color="#6dbb8a" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Line chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: C.primary }}>Churn Rate Trend</h3>
              <p className="text-xs mt-0.5" style={{ color: C.neutral }}>Last 8 months</p>
            </div>
            <select className="text-xs border rounded-lg px-2 py-1.5" style={{ borderColor: C.neutral + "50", color: C.secondary, fontFamily: "Poppins" }}>
              <option>8 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={churnTrendData}>
              <defs>
                <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.accent1} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.accent1} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.neutral + "25"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.neutral, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.neutral, fontFamily: "Poppins" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="churnRate" stroke={C.accent1} fill="url(#churnGrad)" strokeWidth={2.5} dot={false} name="Churn Rate %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
          <h3 className="font-semibold text-sm mb-1" style={{ color: C.primary }}>Customer Segments</h3>
          <p className="text-xs mb-4" style={{ color: C.neutral }}>Distribution by health score</p>
          <ResponsiveContainer width="100%" height={160}>
            <RechartsPieChart>
              <Pie data={segmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {segmentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 11, borderRadius: 10 }} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {segmentData.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span style={{ color: C.secondary }}>{s.name}</span>
                </div>
                <span className="font-semibold" style={{ color: C.primary }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table + Insights */}
      <div className="grid grid-cols-3 gap-4">
        {/* Table */}
        <div className="col-span-2 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.neutral + "30" }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: C.neutral + "20" }}>
            <h3 className="font-semibold text-sm" style={{ color: C.primary }}>Recent Predictions</h3>
            <button onClick={() => onNav("reports")} className="text-xs font-medium" style={{ color: C.accent1 }}>View all →</button>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: C.bg + "60" }}>
                {["Customer", "Risk Score", "Segment", "LTV", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: C.neutral }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictions.map((p, i) => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: C.neutral + "20" }}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: C.primary }}>{p.name}</p>
                      <p className="text-xs" style={{ color: C.neutral }}>{p.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-16">
                        <div className="h-1.5 rounded-full" style={{ width: `${p.risk}%`, background: riskColor(p.risk) }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: riskColor(p.risk) }}>{p.risk}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge color={riskColor(p.risk)}>{p.segment}</Badge></td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: C.primary }}>{p.ltv}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.neutral }}>{p.date}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onNav("result")} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: C.accent1 + "15", color: C.accent1 }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.accent2 + "30" }}>
              <Sparkles size={14} style={{ color: C.accent2 }} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: C.primary }}>AI Insights</h3>
          </div>
          <div className="space-y-4">
            {[
              { tag: "Critical", text: "12 enterprise accounts show sudden login frequency drops — initiate immediate CSM outreach.", color: C.accent1 },
              { tag: "Opportunity", text: "Loyal segment NPS improved by 14pts — ideal moment to request upsell conversations.", color: "#6dbb8a" },
              { tag: "Pattern", text: "Customers on legacy plans churn 2.8× more than those on Growth tier. Consider migration push.", color: C.secondary },
              { tag: "Action", text: "Deploying a 20% discount to \"Needs Attention\" cluster is projected to recover $186K MRR.", color: C.accent2 },
            ].map(({ tag, text, color }) => (
              <div key={tag} className="rounded-xl p-3 border-l-2" style={{ background: color + "0D", borderColor: color }}>
                <span className="text-xs font-bold" style={{ color }}>{tag}</span>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: C.primary }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Predict Customer ─────────────────────────────────────────────────
function PredictCustomer({ onNav }: { onNav: (id: string) => void }) {
  return (
    <div className="p-6" style={{ background: C.bg, fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ color: C.primary }}>Predict Customer Churn</h2>
          <p className="text-sm mt-1" style={{ color: C.secondary }}>Enter customer data to generate an AI-powered churn prediction with SHAP explanations.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {[["Customer ID", "C-10422", "text"], ["Full Name", "e.g. Sarah Mitchell", "text"], ["Email", "s.mitchell@company.com", "email"]].map(([label, placeholder, type]) => (
            <FormField key={label as string} label={label as string} placeholder={placeholder as string} type={type as string} />
          ))}
        </div>

        <div className="space-y-4">
          <SectionCard title="Account Information" icon={Building2}>
            <div className="grid grid-cols-3 gap-4">
              {[
                ["Company", "Acme Corp", "text"],
                ["Plan Type", "Growth", "text"],
                ["Account Age (months)", "18", "number"],
                ["Contract Value ($)", "12400", "number"],
                ["Contract End (days)", "45", "number"],
                ["Industry", "SaaS", "text"],
              ].map(([l, p, t]) => <FormField key={l as string} label={l as string} placeholder={p as string} type={t as string} />)}
            </div>
          </SectionCard>

          <SectionCard title="Engagement Metrics" icon={Activity}>
            <div className="grid grid-cols-3 gap-4">
              {[
                ["Login Frequency (30d)", "3", "number"],
                ["Feature Adoption Rate (%)", "42", "number"],
                ["Session Duration (avg min)", "8", "number"],
                ["Active Users", "2", "number"],
                ["Last Login (days ago)", "12", "number"],
                ["Pages Visited (30d)", "18", "number"],
              ].map(([l, p, t]) => <FormField key={l as string} label={l as string} placeholder={p as string} type={t as string} />)}
            </div>
          </SectionCard>

          <SectionCard title="Support & Health" icon={Shield}>
            <div className="grid grid-cols-3 gap-4">
              {[
                ["Support Tickets (30d)", "12", "number"],
                ["Unresolved Tickets", "4", "number"],
                ["NPS Score", "5", "number"],
                ["CSAT Score", "3.2", "number"],
                ["Billing Anomalies", "2", "number"],
                ["Chargeback Count", "0", "number"],
              ].map(([l, p, t]) => <FormField key={l as string} label={l as string} placeholder={p as string} type={t as string} />)}
            </div>
          </SectionCard>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => onNav("result")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-sm transition-all hover:opacity-90 shadow-lg"
            style={{ background: C.accent1, boxShadow: `0 8px 24px ${C.accent1}30` }}
          >
            <Brain size={17} />
            Run Churn Prediction
          </button>
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl font-medium text-sm border transition-colors hover:bg-white" style={{ borderColor: C.neutral + "60", color: C.secondary }}>
            <RefreshCw size={15} />
            Clear Form
          </button>
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl font-medium text-sm border transition-colors hover:bg-white ml-auto" style={{ borderColor: C.neutral + "60", color: C.secondary }}>
            <Upload size={15} />
            Import CSV
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: C.primary }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-shadow"
        style={{ borderColor: C.neutral + "50", fontFamily: "Poppins", color: C.primary, background: "white" }}
      />
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.secondary + "18" }}>
          <Icon size={15} style={{ color: C.secondary }} />
        </div>
        <h3 className="font-semibold text-sm" style={{ color: C.primary }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Screen: Prediction Result ────────────────────────────────────────────────
function PredictionResult({ onNav }: { onNav: (id: string) => void }) {
  const probability = 87;

  return (
    <div className="p-6 space-y-4" style={{ background: C.bg, fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: C.primary }}>Prediction Result</h2>
          <p className="text-sm mt-0.5" style={{ color: C.secondary }}>Sarah Mitchell · C-10421 · Generated Jul 22, 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border hover:bg-white transition-colors" style={{ borderColor: C.neutral + "50", color: C.secondary }}>
            <Download size={14} />
            Export PDF
          </button>
          <button onClick={() => onNav("predict")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: C.accent1 }}>
            New Prediction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Gauge card */}
        <div className="bg-white rounded-2xl p-6 border text-center" style={{ borderColor: C.neutral + "30" }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.primary }}>Churn Probability</p>
          <div className="relative inline-flex items-center justify-center w-36 h-36 mx-auto">
            <svg width={144} height={144} viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="54" fill="none" stroke={C.neutral + "30"} strokeWidth="14" />
              <circle
                cx="72" cy="72" r="54" fill="none" stroke={C.accent1} strokeWidth="14"
                strokeDasharray={`${(probability / 100) * 339.3} 339.3`}
                strokeLinecap="round" transform="rotate(-90 72 72)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: C.accent1 }}>{probability}%</span>
              <span className="text-xs font-medium" style={{ color: C.neutral }}>High Risk</span>
            </div>
          </div>
          <div className="mt-4 rounded-xl p-3" style={{ background: C.accent1 + "0F" }}>
            <p className="text-xs font-semibold" style={{ color: C.accent1 }}>Likely to churn within 30 days</p>
          </div>
        </div>

        {/* Customer card */}
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.primary }}>Customer Profile</p>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: C.sidebarAccent, color: C.primary }}>SM</div>
            <div>
              <p className="font-semibold text-sm" style={{ color: C.primary }}>Sarah Mitchell</p>
              <p className="text-xs" style={{ color: C.neutral }}>Acme Corp · Growth Plan</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              ["Segment", "At Risk", C.accent1],
              ["Lifetime Value", "$12,400", C.primary],
              ["Account Age", "18 months", C.secondary],
              ["Contract End", "45 days", C.accent1],
              ["NPS Score", "5 / 10", C.neutral],
            ].map(([k, v, color]) => (
              <div key={k as string} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: C.neutral }}>{k}</span>
                <span className="text-xs font-semibold" style={{ color: color as string }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Model confidence */}
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.primary }}>Model Confidence</p>
          <div className="space-y-3">
            {[
              ["Prediction Confidence", 94, C.secondary],
              ["Data Completeness", 88, "#6dbb8a"],
              ["Model Accuracy (OOB)", 91, C.primary],
            ].map(([label, val, color]) => (
              <div key={label as string}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: C.neutral }}>{label}</span>
                  <span className="text-xs font-bold" style={{ color: color as string }}>{val}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${val}%`, background: color as string }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl p-3 border" style={{ borderColor: C.neutral + "30", background: C.bg }}>
            <p className="text-xs font-semibold mb-1" style={{ color: C.primary }}>Model Used</p>
            <p className="text-xs" style={{ color: C.secondary, fontFamily: "DM Mono, monospace" }}>XGBoost v2.1 + SHAP</p>
            <p className="text-xs mt-0.5" style={{ color: C.neutral }}>Trained on 248K customer events</p>
          </div>
        </div>
      </div>

      {/* SHAP chart */}
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.secondary + "18" }}>
            <BarChart3 size={14} style={{ color: C.secondary }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: C.primary }}>SHAP Feature Importance</h3>
            <p className="text-xs" style={{ color: C.neutral }}>Key drivers of this prediction</p>
          </div>
        </div>
        <div className="space-y-3">
          {shapFeatures.map(f => (
            <div key={f.feature} className="flex items-center gap-4">
              <div className="w-48 text-xs shrink-0" style={{ color: C.primary }}>{f.feature}</div>
              <div className="flex-1 flex items-center gap-2">
                {f.direction === "low" && (
                  <>
                    <div className="flex-1 h-2 rounded-full flex justify-end overflow-hidden" style={{ background: C.neutral + "20" }}>
                      <div className="h-2 rounded-full" style={{ width: `${Math.abs(f.impact) * 100}%`, background: "#6dbb8a" }} />
                    </div>
                    <div className="w-px h-4" style={{ background: C.neutral }} />
                    <div className="flex-1" />
                  </>
                )}
                {f.direction === "high" && (
                  <>
                    <div className="flex-1" />
                    <div className="w-px h-4" style={{ background: C.neutral }} />
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: C.neutral + "20" }}>
                      <div className="h-2 rounded-full" style={{ width: `${Math.abs(f.impact) * 100}%`, background: C.accent1 }} />
                    </div>
                  </>
                )}
              </div>
              <div className="w-12 text-xs font-semibold text-right" style={{ color: f.direction === "high" ? C.accent1 : "#6dbb8a" }}>
                {f.direction === "high" ? "+" : ""}{(f.impact * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t" style={{ borderColor: C.neutral + "20" }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: C.neutral }}>
            <span className="w-3 h-3 rounded-sm" style={{ background: C.accent1 }} />
            Increases churn risk
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: C.neutral }}>
            <span className="w-3 h-3 rounded-sm" style={{ background: "#6dbb8a" }} />
            Decreases churn risk
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.accent2 + "30" }}>
            <Sparkles size={14} style={{ color: C.accent2 }} />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: C.primary }}>AI Retention Recommendations</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { priority: "Immediate", icon: "🚨", action: "Personal CSM Outreach", detail: "Assign dedicated CSM. Call within 24h. Acknowledge the support experience and offer white-glove migration.", impact: "~34% risk reduction" },
            { priority: "This week", icon: "💡", action: "Offer Loyalty Incentive", detail: "Present a 15% annual plan discount with 2 bonus seats. Frame as a VIP customer appreciation gesture.", impact: "~21% risk reduction" },
            { priority: "Ongoing", icon: "📊", action: "Feature Adoption Campaign", detail: "Enroll in automated onboarding for Analytics module — 3-email nurture series + in-app tooltips.", impact: "~18% risk reduction" },
          ].map(({ priority, icon, action, detail, impact }) => (
            <div key={action} className="rounded-xl p-4 border" style={{ borderColor: C.neutral + "30", background: C.bg + "60" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{icon}</span>
                <Badge color={priority === "Immediate" ? C.accent1 : priority === "This week" ? C.accent2 : C.secondary}>{priority}</Badge>
              </div>
              <p className="font-semibold text-xs mb-2" style={{ color: C.primary }}>{action}</p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: C.secondary }}>{detail}</p>
              <p className="text-xs font-semibold" style={{ color: "#6dbb8a" }}>Impact: {impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Customer Segments ────────────────────────────────────────────────
function CustomerSegments() {
  return (
    <div className="p-6 space-y-5" style={{ background: C.bg, fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: C.primary }}>Customer Segments</h2>
          <p className="text-sm mt-0.5" style={{ color: C.secondary }}>AI-powered RFM clustering across 5,017 customers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: C.accent1 }}>
          <RefreshCw size={14} />
          Re-cluster
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {clusterData.map(c => (
          <div key={c.cluster} className="bg-white rounded-2xl p-5 border hover:shadow-md transition-shadow" style={{ borderColor: C.neutral + "30" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                <h3 className="font-semibold text-sm" style={{ color: C.primary }}>{c.cluster}</h3>
              </div>
              <Badge color={c.color}>{c.churnProb} churn</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[["Customers", c.customers.toLocaleString()], ["Avg LTV", c.avgLTV]].map(([l, v]) => (
                <div key={l as string}>
                  <p className="text-xs" style={{ color: C.neutral }}>{l}</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: C.primary }}>{v}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: C.neutral }}>Health Score</span>
                <span className="text-xs font-semibold" style={{ color: c.color }}>{c.health}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${c.health}%`, background: c.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distribution bar */}
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
        <h3 className="font-semibold text-sm mb-5" style={{ color: C.primary }}>Cluster Size Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={clusterData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.neutral + "25"} vertical={false} />
            <XAxis dataKey="cluster" tick={{ fontSize: 11, fill: C.neutral, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: C.neutral, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            <Bar dataKey="customers" radius={[6, 6, 0, 0]}>
              {clusterData.map((c, i) => <Cell key={i} fill={c.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Screen: Analytics ────────────────────────────────────────────────────────
function Analytics() {
  return (
    <div className="p-6 space-y-5" style={{ background: C.bg, fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: C.primary }}>Analytics</h2>
          <p className="text-sm mt-0.5" style={{ color: C.secondary }}>Revenue, retention, and churn intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-xs border rounded-xl px-3 py-2 outline-none" style={{ borderColor: C.neutral + "50", color: C.secondary, fontFamily: "Poppins", background: "white" }}>
            <option>Last 6 Months</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: C.secondary }}>
            <Filter size={14} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KPICard icon={DollarSign} label="MRR Retained" value="$978K" change="7.4%" changeDir="up" color={C.secondary} />
        <KPICard icon={TrendingUp} label="Revenue Recovered" value="$72K" change="15.2%" changeDir="up" color="#6dbb8a" />
        <KPICard icon={AlertTriangle} label="At-Risk MRR" value="$89K" change="9.1%" changeDir="up" color={C.accent1} />
        <KPICard icon={Activity} label="Intervention Rate" value="74%" change="3.6%" changeDir="up" color={C.accent2} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
          <h3 className="font-semibold text-sm mb-1" style={{ color: C.primary }}>Revenue Breakdown by Cohort</h3>
          <p className="text-xs mb-4" style={{ color: C.neutral }}>Retained vs. at-risk vs. recovered ($k)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.neutral + "25"} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.neutral, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.neutral, fontFamily: "Poppins" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} formatter={(v: any) => [`$${(v / 1000).toFixed(0)}k`]} />
              <Legend wrapperStyle={{ fontFamily: "Poppins", fontSize: 11 }} />
              <Bar dataKey="retained" fill={C.secondary} radius={[4, 4, 0, 0]} name="Retained" />
              <Bar dataKey="at_risk" fill={C.accent1} radius={[4, 4, 0, 0]} name="At Risk" />
              <Bar dataKey="recovered" fill="#6dbb8a" radius={[4, 4, 0, 0]} name="Recovered" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: C.neutral + "30" }}>
          <h3 className="font-semibold text-sm mb-1" style={{ color: C.primary }}>Monthly Churn Rate Trend</h3>
          <p className="text-xs mb-4" style={{ color: C.neutral }}>Churn % vs. retained %</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={churnTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.neutral + "25"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.neutral, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.neutral, fontFamily: "Poppins" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend wrapperStyle={{ fontFamily: "Poppins", fontSize: 11 }} />
              <Line type="monotone" dataKey="churnRate" stroke={C.accent1} strokeWidth={2.5} dot={{ r: 4, fill: C.accent1 }} name="Churn %" />
              <Line type="monotone" dataKey="retained" stroke={C.secondary} strokeWidth={2.5} dot={{ r: 4, fill: C.secondary }} name="Retained %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Reports ──────────────────────────────────────────────────────────
function Reports() {
  return (
    <div className="p-6 space-y-5" style={{ background: C.bg, fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: C.primary }}>Reports</h2>
          <p className="text-sm mt-0.5" style={{ color: C.secondary }}>Prediction history and export center</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border hover:bg-white transition-colors" style={{ borderColor: C.neutral + "50", color: C.secondary }}>
            <Download size={14} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: C.accent1 }}>
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard icon={Brain} label="Total Predictions" value="2,847" change="12%" changeDir="up" color={C.secondary} />
        <KPICard icon={CheckCircle} label="Interventions Sent" value="1,203" change="8%" changeDir="up" color="#6dbb8a" />
        <KPICard icon={TrendingUp} label="Churns Prevented" value="891" change="14%" changeDir="up" color={C.accent2} />
        <KPICard icon={DollarSign} label="Revenue Saved" value="$1.8M" change="22%" changeDir="up" color={C.accent1} />
      </div>

      {/* History table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.neutral + "30" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: C.neutral + "20" }}>
          <h3 className="font-semibold text-sm" style={{ color: C.primary }}>Prediction History</h3>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.neutral }} />
            <input placeholder="Search..." className="pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none" style={{ borderColor: C.neutral + "50", fontFamily: "Poppins", color: C.primary, background: C.bg }} />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: C.bg + "60" }}>
              {["Prediction ID", "Customer", "Date", "Risk Score", "Action Taken", "Outcome"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: C.neutral }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {predictionHistory.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: C.neutral + "20" }}>
                <td className="px-5 py-3 text-xs font-medium" style={{ color: C.secondary, fontFamily: "DM Mono, monospace" }}>{p.id}</td>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: C.primary }}>{p.customer}</td>
                <td className="px-5 py-3 text-xs" style={{ color: C.neutral }}>{p.date}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: riskColor(p.risk) + "18", color: riskColor(p.risk) }}>
                    {p.risk}% {riskLabel(p.risk)}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: C.secondary }}>{p.action}</td>
                <td className="px-5 py-3">
                  <Badge color={p.outcome === "Converted" ? "#6dbb8a" : p.outcome === "Churned" ? C.accent1 : p.outcome === "Pending" ? C.accent2 : C.secondary}>
                    {p.outcome}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Screen: Settings ─────────────────────────────────────────────────────────
function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: BellRing },
    { id: "api", label: "API Status", icon: Cpu },
    { id: "theme", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="p-6 space-y-5" style={{ background: C.bg, fontFamily: "Poppins, sans-serif" }}>
      <div>
        <h2 className="text-xl font-bold" style={{ color: C.primary }}>Settings</h2>
        <p className="text-sm mt-0.5" style={{ color: C.secondary }}>Manage your account, preferences, and API connections</p>
      </div>

      <div className="flex gap-5">
        {/* Tabs sidebar */}
        <div className="bg-white rounded-2xl p-3 border w-52 shrink-0 self-start" style={{ borderColor: C.neutral + "30" }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === id ? C.accent1 + "15" : "transparent",
                color: tab === id ? C.accent1 : C.secondary,
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === "profile" && (
            <div className="bg-white rounded-2xl p-6 border space-y-5" style={{ borderColor: C.neutral + "30" }}>
              <h3 className="font-semibold text-sm" style={{ color: C.primary }}>Profile Information</h3>
              <div className="flex items-center gap-4 pb-5 border-b" style={{ borderColor: C.neutral + "20" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold" style={{ background: C.sidebarAccent, color: C.primary }}>AK</div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: C.primary }}>Amir Khan</p>
                  <p className="text-xs" style={{ color: C.neutral }}>amir@retainiq.ai</p>
                  <button className="text-xs mt-1 font-medium" style={{ color: C.accent1 }}>Change avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[["First Name", "Amir"], ["Last Name", "Khan"], ["Email", "amir@retainiq.ai"], ["Role", "Admin"]].map(([l, v]) => (
                  <FormField key={l} label={l} placeholder={v} />
                ))}
              </div>
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: C.accent1 }}>Save Changes</button>
            </div>
          )}

          {tab === "notifications" && (
            <div className="bg-white rounded-2xl p-6 border space-y-5" style={{ borderColor: C.neutral + "30" }}>
              <h3 className="font-semibold text-sm" style={{ color: C.primary }}>Notification Preferences</h3>
              {[
                ["High-risk alerts", "Notify when a customer exceeds 75% churn probability", true],
                ["Weekly digest", "Receive a Sunday summary of churn metrics and actions", true],
                ["Intervention outcomes", "Alert when a saved customer churns despite outreach", false],
                ["Model updates", "Notify when prediction models are retrained", false],
                ["Billing alerts", "Receive billing and subscription notifications", true],
              ].map(([title, desc, defaultOn]) => (
                <div key={title as string} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0" style={{ borderColor: C.neutral + "15" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: C.primary }}>{title}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.neutral }}>{desc}</p>
                  </div>
                  <div className="w-10 h-5.5 rounded-full relative cursor-pointer ml-4 mt-0.5 shrink-0" style={{ background: defaultOn ? C.accent1 : C.neutral + "50", height: 22 }}>
                    <div className="absolute top-0.5 rounded-full bg-white w-4 h-4 shadow transition-all" style={{ left: defaultOn ? "calc(100% - 18px)" : 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "api" && (
            <div className="bg-white rounded-2xl p-6 border space-y-5" style={{ borderColor: C.neutral + "30" }}>
              <h3 className="font-semibold text-sm" style={{ color: C.primary }}>API & Integrations Status</h3>
              <div className="space-y-3">
                {[
                  ["RetainIQ Prediction API", "retainiq.ai/api/v2", "Operational", "#6dbb8a"],
                  ["Salesforce CRM", "Connected via OAuth2", "Syncing", C.secondary],
                  ["HubSpot", "Connected", "Operational", "#6dbb8a"],
                  ["Stripe Billing", "Connected via API key", "Operational", "#6dbb8a"],
                  ["Intercom", "Not configured", "Disconnected", C.neutral],
                  ["Snowflake", "JDBC connection active", "Operational", "#6dbb8a"],
                ].map(([name, detail, status, color]) => (
                  <div key={name as string} className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: C.neutral + "25", background: C.bg + "50" }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.primary }}>{name}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.neutral, fontFamily: "DM Mono, monospace" }}>{detail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color as string }} />
                      <span className="text-xs font-medium" style={{ color: color as string }}>{status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "theme" && (
            <div className="bg-white rounded-2xl p-6 border space-y-5" style={{ borderColor: C.neutral + "30" }}>
              <h3 className="font-semibold text-sm" style={{ color: C.primary }}>Appearance</h3>
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: C.primary }}>Color Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["Blush & Terracotta", [C.bg, C.accent1, C.primary], true],
                    ["Ocean & Navy", ["#E8F4FD", "#2563EB", "#1E3A5F"], false],
                    ["Forest & Sage", ["#F0F4EF", "#4A7C59", "#2D4A3E"], false],
                  ].map(([name, colors, active]) => (
                    <div key={name as string} className="rounded-xl p-3 border cursor-pointer transition-all" style={{ borderColor: active ? C.accent1 : C.neutral + "40", background: active ? C.accent1 + "08" : "white" }}>
                      <div className="flex gap-1.5 mb-2">
                        {(colors as string[]).map((c, i) => <div key={i} className="w-5 h-5 rounded-full" style={{ background: c }} />)}
                      </div>
                      <p className="text-xs font-medium" style={{ color: C.primary }}>{name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: C.primary }}>Density</p>
                <div className="flex gap-3">
                  {["Compact", "Default", "Comfortable"].map((d, i) => (
                    <button key={d} className="px-4 py-2 rounded-xl text-xs font-medium border transition-all" style={{ borderColor: i === 1 ? C.accent1 : C.neutral + "40", color: i === 1 ? C.accent1 : C.secondary, background: i === 1 ? C.accent1 + "10" : "white" }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const screenTitles: Record<string, string> = {
  dashboard: "Dashboard",
  predict: "Predict Customer",
  result: "Prediction Result",
  segments: "Customer Segments",
  analytics: "Analytics",
  reports: "Reports",
  settings: "Settings",
};

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isDashboard = !["landing", "login"].includes(screen);

  if (screen === "landing") {
    return (
      <div style={{ fontFamily: "Poppins, sans-serif" }}>
        <LandingPage onNav={setScreen} />
      </div>
    );
  }

  if (screen === "login") {
    return (
      <div style={{ fontFamily: "Poppins, sans-serif" }}>
        <LoginPage onNav={setScreen} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Poppins, sans-serif", background: C.bg }}>
      <Sidebar active={screen} onNav={setScreen} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={screenTitles[screen] || screen} onNav={setScreen} />
        <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {screen === "dashboard" && <Dashboard onNav={setScreen} />}
          {screen === "predict" && <PredictCustomer onNav={setScreen} />}
          {screen === "result" && <PredictionResult onNav={setScreen} />}
          {screen === "segments" && <CustomerSegments />}
          {screen === "analytics" && <Analytics />}
          {screen === "reports" && <Reports />}
          {screen === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
