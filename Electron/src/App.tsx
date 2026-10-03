/**
 * RENDERER PROCESS — CareConnect Desktop
 *
 * Pure React/web code. No Node.js or direct Electron API access.
 * All communication with the Electron main process goes through
 * window.electronAPI, which was injected by electron/preload.cjs
 * via contextBridge.exposeInMainWorld().
 *
 * When running in a plain browser (Figma Make preview), window.electronAPI
 * is undefined — every call is guarded with optional chaining (?.) so the
 * UI still renders correctly.
 */

import { useState, useEffect, useCallback } from 'react';

import {
  Bell,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Edit,
  Home,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Pill,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  User,
} from 'lucide-react';

// ─── Electron bridge type ─────────────────────────────────────────────────────
// Mirrors the shape defined in electron/preload.cjs.

declare global {
  interface Window {
    electronAPI?: {
      // Pattern 1 — one-way
      notifyPageChanged: (page: string) => void;
      // Pattern 2 — two-way (Promise)
      confirmLogout: () => Promise<boolean>;
      notify: (title: string, body: string) => Promise<void>;
      getVersion: () => Promise<string>;
      // Pattern 3 — main → renderer
      onNavigate: (cb: (page: string) => void) => () => void;
      // Platform info
      platform: string;
    };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Page =
  | 'login'
  | 'reset-password'
  | 'home'
  | 'appointments'
  | 'messages'
  | 'message-detail'
  | 'new-message'
  | 'medications'
  | 'profile'
  | 'settings';



// ─── Shared layout ────────────────────────────────────────────────────────────

function AppHeader() {
  const isMac = window.electronAPI?.platform === 'darwin';

  return (
    // -webkit-app-region:drag makes the header a drag handle for the window.
    // Interactive children must be marked no-drag so clicks still work.
    <header
      className="bg-[#1565c0] border-b border-[#0d47a1] flex h-[56px] items-center px-5 shrink-0 w-full select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <div className="bg-white rounded-full size-8 flex items-center justify-center shrink-0">
          <ShieldCheck
            className="size-[19px] text-[#1565c0]"
            aria-hidden="true"
          />
        </div>

        <span className="font-['Arimo:Bold'] text-[15px] text-white tracking-[0.3px] whitespace-nowrap">
          CareConnect
        </span>
      </div>

      {/* Right controls */}
      <div
        className="ml-auto flex items-center gap-3"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Search */}
        <div className="relative flex items-center gap-2 border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.14)] h-[33px] px-2.5 rounded w-60">
          <Search
            className="size-4 shrink-0 text-white"
            aria-hidden="true"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full font-['Arimo:Regular'] text-[13px] text-white placeholder:text-[rgba(255,255,255,0.6)]"
          />
        </div>

        {/* Bell */}
        <div className="relative size-4 shrink-0 cursor-pointer">
          <Bell
            className="size-full text-white"
            aria-hidden="true"
          />

          <div className="absolute -top-2 left-1.5 bg-[#b3261e] rounded-full size-[17px] flex items-center justify-center">
            <span className="font-['Arimo:Regular'] text-[9px] text-white">
              3
            </span>
          </div>
        </div>

        {/* Calendar */}
        <Calendar
          className="size-4 shrink-0 cursor-pointer text-white"
          aria-hidden="true"
        />

        {/* User avatar */}
        <div className="bg-[#009688] rounded-full size-7 flex items-center justify-center shrink-0">
          <span className="font-['Arimo:Bold'] text-[11px] text-white">
            JD
          </span>
        </div>

        <span className="font-['Arimo:Regular'] text-[13px] text-white whitespace-nowrap">
          Jane Doe
        </span>

        <ChevronDown
          className="size-[12px] shrink-0 text-white"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
  current: Page;
  onNavigate: (p: Page) => void;
}

function Sidebar({ current, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'home' as Page, label: 'Home', icon: Home },
    { id: 'appointments' as Page, label: 'Appointments', icon: Calendar },
    { id: 'messages' as Page, label: 'Messages', icon: MessageSquare, badge: '2' },
    { id: 'medications' as Page, label: 'Medications', icon: Pill },
    { id: 'profile' as Page, label: 'Profile', icon: User },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  // Messages, message-detail, and new-message all highlight the Messages item
  const msgGroup: Page[] = ['messages', 'message-detail', 'new-message'];
  const isActive = (id: Page) =>
    id === 'messages' ? msgGroup.includes(current) : current === id;

  return (
    <aside className="bg-[#202b80] flex flex-col h-full w-[176px] shrink-0">
      <nav className="flex flex-col gap-[3px] px-3 py-[18px]">
        {navItems.map(({ id, label, icon, badge }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex gap-[14px] h-10 items-center px-[13px] rounded-[5px] w-full text-left transition-colors ${isActive(id)
                ? 'bg-[#4b56a1]'
                : 'hover:bg-[rgba(255,255,255,0.07)]'
              }`}
          >
            {(() => {
              const Icon = icon;
              return (
                <Icon
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />
              );
            })()}
            <span
              className={`font-['Arimo:Regular'] text-[13px] whitespace-nowrap ${isActive(id) ? 'text-white' : 'text-[rgba(255,255,255,0.68)]'
                }`}
            >
              {label}
            </span>
            {badge && (
              <div className="ml-auto bg-[#009688] rounded-full h-[17px] px-[6px] flex items-center shrink-0">
                <span className="font-['Arimo:Regular'] text-[10px] text-white">{badge}</span>
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* User card at bottom of sidebar */}
      <div className="border-t border-[rgba(255,255,255,0.12)] flex gap-[9px] items-center px-5 py-[18px]">
        <div className="bg-[#009688] rounded-full size-8 flex items-center justify-center shrink-0">
          <span className="font-['Arimo:Bold'] text-[11px] text-white">JD</span>
        </div>
        <div>
          <p className="font-['Arimo:Bold'] text-[11px] text-white">Jane Doe</p>
          <p className="font-['Arimo:Regular'] text-[10px] text-[rgba(255,255,255,0.45)]">Patient</p>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Footer({ version }: { version: string }) {
  return (
    <footer className="bg-[#f5f5f5] border-t border-[#d9d9d9] flex h-6 items-center justify-between px-4 shrink-0 select-none">
      <div className="flex gap-4 items-center">
        <div className="bg-[#1b5e20] rounded-[3px] size-[6px]" />
        <span className="font-['Arimo:Regular'] text-[10px] text-[#9e9e9e]">Connected</span>
        <span className="font-['Arimo:Regular'] text-[10px] text-[#9e9e9e]">Last synced: just now</span>
      </div>
      <div className="flex gap-4 items-center">
        <span className="font-['Arimo:Regular'] text-[10px] text-[#9e9e9e]">CareConnect v{version}</span>
        <span className="font-['Arimo:Regular'] text-[10px] text-[#9e9e9e]">HIPAA Compliant</span>
        <span className="font-['Arimo:Regular'] text-[10px] text-[#9e9e9e]">© 2026 CareConnect Health</span>
      </div>
    </footer>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

// ── Login ────────────────────────────────────────────────────────────────────

function LoginPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    onNavigate('home');
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-6">
      <div className="bg-white border border-[#d9dee7] rounded-lg shadow-sm w-full max-w-[420px] p-8">

        <div className="flex flex-col items-center mb-7">
          <div className="bg-[#1565c0] rounded-full size-12 flex items-center justify-center mb-3">
            <ShieldCheck className="size-7 text-white" aria-hidden="true" />
          </div>

          <h1 className="font-['Arimo:Bold'] text-[24px] text-[#212121]">
            CareConnect
          </h1>

          <p className="font-['Arimo:Regular'] text-[14px] text-[#616161] mt-1">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            htmlFor="login-email"
            className="block font-['Arimo:Bold'] text-[13px] text-[#212121] mb-2"
          >
            Email
          </label>

          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full h-11 border border-[#bdbdbd] rounded px-3 mb-5 outline-none focus:ring-2 focus:ring-[#1565c0]"
          />

          <label
            htmlFor="login-password"
            className="block font-['Arimo:Bold'] text-[13px] text-[#212121] mb-2"
          >
            Password
          </label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full h-11 border border-[#bdbdbd] rounded px-3 outline-none focus:ring-2 focus:ring-[#1565c0]"
          />

          <div className="flex justify-end mt-3 mb-6">
            <button
              type="button"
              onClick={() => onNavigate('reset-password')}
              className="text-[#1565c0] text-[13px] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#1565c0] hover:bg-[#0d47a1] text-white rounded font-['Arimo:Bold'] text-[14px]"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-[12px] text-[#757575] mt-6">
          Secure access to your CareConnect account
        </p>
      </div>
    </div>
  );
}

// ── Reset Password ────────────────────────────────────────────────────────────

function ResetPasswordPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-6">
      <div className="bg-white border border-[#d9dee7] rounded-lg shadow-sm w-full max-w-[420px] p-8">

        <div className="flex flex-col items-center mb-7">
          <div className="bg-[#1565c0] rounded-full size-12 flex items-center justify-center mb-3">
            <Lock className="size-6 text-white" aria-hidden="true" />
          </div>

          <h1 className="font-['Arimo:Bold'] text-[24px] text-[#212121]">
            Reset Password
          </h1>

          <p className="font-['Arimo:Regular'] text-[14px] text-[#616161] mt-2 text-center">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleReset}>
            <label
              htmlFor="reset-email"
              className="block font-['Arimo:Bold'] text-[13px] text-[#212121] mb-2"
            >
              Email
            </label>

            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full h-11 border border-[#bdbdbd] rounded px-3 mb-5 outline-none focus:ring-2 focus:ring-[#1565c0]"
            />

            <button
              type="submit"
              className="w-full h-11 bg-[#1565c0] hover:bg-[#0d47a1] text-white rounded font-['Arimo:Bold'] text-[14px]"
            >
              Send Reset Instructions
            </button>
          </form>
        ) : (
          <div
            role="status"
            className="bg-[#e8f5e9] border border-[#c8e6c9] rounded p-4 text-center"
          >
            <p className="font-['Arimo:Bold'] text-[14px] text-[#1b5e20]">
              Check your email
            </p>

            <p className="font-['Arimo:Regular'] text-[13px] text-[#424242] mt-1">
              Reset instructions have been sent to {email}.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full mt-5 text-[#1565c0] text-[13px] hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}



// ── Home ─────────────────────────────────────────────────────────────────────

function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [items, setItems] = useState([
    { id: 1, label: 'Morning medication', sub: 'Completed at 8:05 AM', done: true },
    { id: 2, label: 'Log blood pressure', sub: 'Due before 4:00 PM', done: true },
    { id: 3, label: 'Evening medication', sub: 'Scheduled for 6:00 PM', done: false },
    { id: 4, label: 'Daily movement', sub: '20 minute goal', done: false },
  ]);

  function toggleItem(id: number) {
    const item = items.find(i => i.id === id);
    if (item && !item.done) {
      // Pattern 2 — invoke: trigger a native OS notification
      window.electronAPI?.notify('CareConnect', `"${item.label}" marked complete.`);
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-[17px] pb-7 bg-[#f5f7fa]">
      {/* Page heading */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-['Arimo:Bold'] text-[23px] text-[#292929]">Good morning, Jane</h1>
          <p className="font-['Arimo:Regular'] text-[13px] text-[#686868] mt-1">Here's an overview of your care today.</p>
        </div>
        <div className="bg-[#e3f3e6] h-[25px] px-[11px] rounded-full flex items-center">
          <span className="font-['Arimo:Regular'] text-[11px] text-[#1b5e20] whitespace-nowrap">● All systems connected</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: 'NEXT APPOINTMENT', value: 'Today, 2:30 PM', sub: 'Dr. Sarah Chen · Cardiology' },
          { label: 'MEDICATIONS TODAY', value: '3 of 4 taken', sub: 'Next dose at 6:00 PM' },
          { label: 'CARE PLAN', value: '82% on track', sub: '2 tasks due this week' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] p-4">
            <p className="font-['Arimo:Regular'] text-[11px] text-[#686868] tracking-[0.35px]">{c.label}</p>
            <p className="font-['Arimo:Bold'] text-[20px] text-[#0d47a1] mt-[7px]">{c.value}</p>
            <p className="font-['Arimo:Regular'] text-[13px] text-[#686868] mt-[7px]">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Appointments + checklist */}
      <div className="grid grid-cols-[1fr_284px] gap-4 mb-4">
        {/* Upcoming appointments card */}
        <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="flex items-center justify-between px-4 h-[45px] border-b border-[#d9d9d9]">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" aria-hidden="true" />
              <span className="font-['Arimo:Bold'] text-[13px] text-[#292929]">UPCOMING APPOINTMENTS</span>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="border border-[#d9d9d9] h-[36px] px-[17px] rounded font-['Arimo:Regular'] text-[13px] text-[#1565c0]"
            >
              View all
            </button>
          </div>
          <div className="p-4">
            {/* Primary appointment */}
            <div className="flex gap-4 items-center pb-4">
              <div className="bg-[#e3f2fd] rounded-[6px] w-14 h-[61px] flex flex-col items-center justify-center shrink-0">
                <span className="font-['Arimo:Bold'] text-[22px] text-[#0d47a1]">14</span>
                <span className="font-['Arimo:Regular'] text-[10px] text-[#0d47a1]">MAR</span>
              </div>
              <div className="flex-1">
                <p className="font-['Arimo:Bold'] text-[13px] text-[#292929]">Cardiology follow-up</p>
                <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">Dr. Sarah Chen · Bay Medical Center</p>
                <div className="flex gap-3 items-center mt-[7px]">
                  <div className="bg-[#e3f2fd] h-[25px] px-[11px] rounded-full flex items-center">
                    <span className="font-['Arimo:Regular'] text-[11px] text-[#1565c0]">2:30 PM</span>
                  </div>
                  <span className="font-['Arimo:Regular'] text-[13px] text-[#292929]">In person</span>
                </div>
              </div>
              <button className="bg-[#1565c0] h-9 px-[17px] rounded font-['Arimo:Regular'] text-[13px] text-white whitespace-nowrap">
                View details
              </button>
            </div>
            {/* Secondary appointment */}
            <div className="flex gap-4 items-center border-t border-[#d9d9d9] pt-[14px]">
              <div className="bg-[#f5f7fa] rounded-full size-9 flex items-center justify-center shrink-0">
                <span className="font-['Arimo:Bold'] text-[13px] text-[#292929]">21</span>
              </div>
              <div className="flex-1">
                <p className="font-['Arimo:Bold'] text-[13px] text-[#292929]">Physical therapy</p>
                <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">10:00 AM · Virtual visit</p>
              </div>
              <span className="font-['Arimo:Regular'] text-[13px] text-[#686868]">Fri</span>
            </div>
          </div>
        </div>

        {/* Today's checklist */}
        <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 h-[45px] border-b border-[#d9d9d9]">
            <Shield className="size-4" aria-hidden="true" />
            <span className="font-['Arimo:Bold'] text-[13px] text-[#292929]">TODAY'S CHECKLIST</span>
          </div>
          <div className="p-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`flex gap-[11px] items-center py-[9px] ${idx > 0 ? 'border-t border-[#d9d9d9]' : ''}`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`size-[19px] rounded border flex items-center justify-center shrink-0 transition-colors ${item.done ? 'bg-[#009688] border-[#009688]' : 'border-[#d9d9d9]'
                    }`}
                >
                  {item.done && <span className="text-white text-[11px]">✓</span>}
                </button>
                <div>
                  <p className="font-['Arimo:Bold'] text-[13px] text-[#292929]">{item.label}</p>
                  <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health snapshot */}
      <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 h-[45px] border-b border-[#d9d9d9]">
          <Info className="size-4" aria-hidden="true" />
          <span className="font-['Arimo:Bold'] text-[13px] text-[#292929]">HEALTH SNAPSHOT</span>
        </div>
        <div className="p-4 grid grid-cols-4">
          {[
            { label: 'BLOOD PRESSURE', value: '118 / 76 mmHg' },
            { label: 'RESTING HEART RATE', value: '68 bpm' },
            { label: 'WEIGHT', value: '142.4 lbs' },
            { label: 'LAST UPDATED', value: 'Today, 9:15 AM' },
          ].map(({ label, value }, i) => (
            <div key={label} className={`flex flex-col gap-[7px] ${i > 0 ? 'border-l border-[#d9d9d9] pl-6' : ''}`}>
              <p className="font-['Arimo:Regular'] text-[11px] text-[#686868] tracking-[0.35px]">{label}</p>
              <p className="font-['Arimo:Regular'] text-[13px] text-[#292929]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Appointments ──────────────────────────────────────────────────────────────

function AppointmentsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  const appointments = [
    { date: 'MAR 14', title: 'Cardiology follow-up', doctor: 'Dr. Sarah Chen', time: 'Today · 2:30 PM', type: 'In person', status: 'Confirmed', statusCls: 'bg-[#e3f3e6] text-[#1b5e20]' },
    { date: 'MAR 21', title: 'Physical therapy', doctor: 'Michael Torres, PT', time: 'Friday · 10:00 AM', type: 'In person', status: 'Scheduled', statusCls: 'bg-[#f5f7fa] text-[#686868]' },
    { date: 'APR 03', title: 'Annual wellness visit', doctor: 'Dr. Robert Kim', time: 'Thursday · 9:00 AM', type: 'In person', status: 'Scheduled', statusCls: 'bg-[#f5f7fa] text-[#686868]' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-[17px] pb-7 bg-[#f5f7fa]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-['Arimo:Bold'] text-[23px] text-[#292929]">Appointments</h1>
          <p className="font-['Arimo:Regular'] text-[13px] text-[#686868] mt-1">View and manage your upcoming care visits.</p>
        </div>
        <button className="bg-[#1565c0] h-9 px-[17px] rounded font-['Arimo:Regular'] text-[13px] text-white whitespace-nowrap">
          + Schedule appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-[13px] items-center">
        {(['upcoming', 'past', 'cancelled'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}>
            {t === tab
              ? <div className="bg-[#e3f2fd] h-[25px] px-[11px] rounded-full flex items-center"><span className="font-['Arimo:Regular'] text-[11px] text-[#1565c0] capitalize">{t}</span></div>
              : <span className="font-['Arimo:Regular'] text-[13px] text-[#292929] capitalize">{t}</span>
            }
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] overflow-hidden mb-4">
        <div className="p-4">
          {appointments.map((a, i) => (
            <div key={a.date} className={`flex gap-4 items-center min-h-[78px] ${i > 0 ? 'border-t border-[#d9d9d9]' : ''}`}>
              <span className="font-['Arimo:Bold'] text-[12px] text-[#1565c0] w-[52px] shrink-0">{a.date}</span>
              <div className="flex-1">
                <p className="font-['Arimo:Bold'] text-[13px] text-[#292929]">{a.title}</p>
                <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">{a.doctor}</p>
              </div>
              <div>
                <p className="font-['Arimo:Bold'] text-[13px] text-[#292929]">{a.time}</p>
                <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">{a.type}</p>
              </div>
              <div className={`h-[25px] px-[11px] rounded-full flex items-center ${a.statusCls}`}>
                <span className="font-['Arimo:Regular'] text-[11px]">{a.status}</span>
              </div>
              <span className="text-[26px] text-[#9e9e9e]">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help card */}
      <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 h-[45px] border-b border-[#d9d9d9]">
          <Info className="size-4" aria-hidden="true" />
          <span className="font-['Arimo:Bold'] text-[13px] text-[#292929]">NEED HELP?</span>
        </div>
        <div className="p-4">
          <p className="font-['Arimo:Regular'] text-[13px] text-[#292929]">
            Call the scheduling team at <strong className="font-['Arimo:Bold']">(555) 018-2200</strong>.
          </p>
          <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">Monday–Friday, 8:00 AM–6:00 PM</p>
        </div>
      </div>
    </div>
  );
}

// ── Messages ──────────────────────────────────────────────────────────────────

function MessagesPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const threads = [
    { date: 'Today', time: '9:00 AM', title: 'Your test results are ready', from: 'Dr. Barrow · Gastroenterology' },
    { date: 'Yesterday', time: '3:00 PM', title: 'Please let us know if you have…', from: 'Dr. Smith · Neurology' },
    { date: 'Sept 25', time: '8:00 AM', title: 'Annual wellness visit reminder', from: 'Dr. Robert Kim' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-[17px] pb-7 bg-[#f5f7fa]">
      <div className="flex items-start justify-between mb-[13px]">
        <div>
          <h1 className="font-['Arimo:Bold'] text-[23px] text-[#292929]">Messages</h1>
          <p className="font-['Arimo:Regular'] text-[13px] text-[#686868] mt-1">View and manage your communication.</p>
        </div>
        <button
          onClick={() => onNavigate('new-message')}
          className="bg-[#1565c0] h-9 px-[17px] rounded font-['Arimo:Regular'] text-[13px] text-white whitespace-nowrap"
        >
          + New Message
        </button>
      </div>

      <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="p-4">
          {threads.map((m, i) => (
            <div key={i} className={`flex gap-4 items-center min-h-[78px] ${i > 0 ? 'border-t border-[#d9d9d9]' : ''}`}>
              <div className="w-[80px] shrink-0">
                <p className="font-['Arimo:Bold'] text-[12px] text-[#1565c0]">{m.date}</p>
                <p className="font-['Arimo:Bold'] text-[12px] text-[#1565c0]">{m.time}</p>
              </div>
              <div className="flex-1">
                <p className="font-['Arimo:Bold'] text-[13px] text-[#292929]">{m.title}</p>
                <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">{m.from}</p>
              </div>
              <button
                onClick={() => onNavigate('message-detail')}
                className="border border-[#d9d9d9] h-9 px-[17px] rounded font-['Arimo:Regular'] text-[13px] text-[#1565c0] whitespace-nowrap"
              >
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Message detail ────────────────────────────────────────────────────────────

function MessageDetailPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [draft, setDraft] = useState('');

  function sendMessage() {
    if (!draft.trim()) return;
    window.electronAPI?.notify('CareConnect', 'Message sent to Dr. Sarah Smith.');
    setDraft('');
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Doctor info rail */}
      <div className="bg-[#f0f4ff] border-r border-[#e2e8f0] w-[276px] shrink-0 flex flex-col justify-between p-6 overflow-y-auto">
        <div className="flex flex-col gap-8">
          {/* Back */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => onNavigate('messages')}
              className="bg-[#1565c0] p-2 rounded-full shrink-0"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <span className="font-['Inter:Semi_Bold'] font-semibold text-[14px] text-[#5f6368] whitespace-nowrap">Back to Messages</span>
          </div>

          {/* Avatar */}
          <div className="flex flex-col gap-4 items-center">
            <div className="bg-[#1565c0] rounded-full size-[88px] flex items-center justify-center">
              <span className="font-['Inter:Regular'] text-[30px] text-white">SS</span>
            </div>
            <div className="text-center">
              <p className="font-['Inter:Bold'] font-bold text-[16px] text-[#1565c0]">Dr. Sarah Smith</p>
              <p className="font-['Inter:Regular'] text-[14px] text-[#5f6368]">Neurology</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] flex gap-2 items-center px-3 py-2 rounded-full">
              <ShieldCheck className="size-4" aria-hidden="true" />
              <span className="font-['Inter:Semi_Bold'] font-semibold text-[12px] text-[#5f6368] whitespace-nowrap">Usually replies in 1–2 days</span>
            </div>
          </div>

          {/* Upcoming visit */}
          <div className="bg-[#eaf2ff] flex flex-col gap-2 p-4 rounded-[10px]">
            <div className="flex gap-2 items-center">
              <CalendarDays className="size-4" aria-hidden="true" />
              <span className="font-['Inter:Bold'] font-bold text-[14px] text-[#0d4f9a]">Upcoming visit</span>
            </div>
            <p className="font-['Inter:Regular'] text-[12px] text-[#5f6368] leading-[1.45]">
              September 5 · 10:00 AM<br />Neurology follow-up
            </p>
          </div>
        </div>

        {/* Security note */}
        <div className="flex gap-2 items-center">
          <ShieldCheck className="size-[18px] shrink-0" aria-hidden="true" />s
          <p className="font-['Inter:Regular'] text-[12px] text-[#5f6368] leading-[1.45]">
            This conversation is private and protected as part of your health record.
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 h-[86px] shrink-0">
          <div>
            <p className="font-['Inter:Bold'] font-bold text-[24px] text-[#1565c0]">Dr. Sarah Smith</p>
            <p className="font-['Inter:Regular'] text-[14px] text-[#5f6368]">Neurology</p>
          </div>
          <div className="bg-[#eaf2ff] flex gap-2 items-center px-3 py-2 rounded-full">
            <Lock className="size-[15px]" aria-hidden="true" />
            <span className="font-['Inter:Semi_Bold'] font-semibold text-[12px] text-[#0d4f9a] whitespace-nowrap">Secure message</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-[30px] py-6 flex flex-col gap-5">
          <div className="flex justify-center">
            <div className="bg-[#f1f3f4] px-3 py-1 rounded-full">
              <span className="font-['Inter:Semi_Bold'] font-semibold text-[12px] text-[#5f6368]">Today</span>
            </div>
          </div>
          {/* Received */}
          <div className="flex flex-col gap-1 items-start max-w-[492px]">
            <div className="bg-white border border-[#e2e8f0] rounded-bl-[16px] rounded-br-[16px] rounded-tl-[4px] rounded-tr-[16px] shadow-[0_2px_6px_rgba(15,23,42,0.06)] px-4 py-3">
              <p className="font-['Inter:Medium'] font-medium text-[16px] text-[#212121] leading-[1.5]">
                Your test results are ready, please let me know if you have any questions.
              </p>
            </div>
            <span className="font-['Inter:Regular'] text-[12px] text-[#9aa0a6]">10:42 AM</span>
          </div>
          {/* Sent */}
          <div className="flex flex-col gap-1 items-end">
            <div className="bg-[#1565c0] rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-[4px] shadow-[0_2px_6px_rgba(15,23,42,0.06)] px-4 py-3 max-w-[492px]">
              <p className="font-['Inter:Regular'] text-[16px] text-white leading-[1.5]">
                Thank you, Dr. Smith. I have a question but prefer to discuss it during the upcoming visit.
              </p>
            </div>
            <span className="font-['Inter:Regular'] text-[12px] text-[#9aa0a6]">10:45 AM</span>
          </div>
        </div>

        {/* Composer */}
        <div className="bg-white border-t border-[#e2e8f0] flex gap-3 items-center px-4 py-3 h-[78px] shrink-0">
          <button className="size-[42px] flex items-center justify-center rounded-full hover:bg-[#f5f5f5]">
            <Paperclip className="size-4" aria-hidden="true" />
          </button>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-[#f1f3f4] h-11 px-4 rounded-full font-['Inter:Regular'] text-[14px] text-[#212121] placeholder:text-[#5f6368] outline-none"
          />
          <button
            onClick={sendMessage}
            className={`size-[42px] rounded-full flex items-center justify-center bg-[#1565c0] transition-opacity ${draft ? 'opacity-100' : 'opacity-40'}`}
          >
            <Send className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Message ───────────────────────────────────────────────────────────────

function NewMessagePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [to, setTo] = useState('');
  const [body, setBody] = useState('');

  function handleSend() {
    if (!to.trim() || !body.trim()) return;
    window.electronAPI?.notify('CareConnect', `Message sent to ${to}.`);
    onNavigate('messages');
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-[17px] pb-7 bg-[#f5f7fa]">
      <div className="flex items-center justify-between mb-[13px]">
        <div>
          <h1 className="font-['Arimo:Bold'] text-[23px] text-[#292929]">New Message</h1>
          <p className="font-['Arimo:Regular'] text-[13px] text-[#686868] mt-1">Compose a secure message to your provider.</p>
        </div>
        <button onClick={() => onNavigate('messages')} className="bg-[#1565c0] p-2 rounded-full">
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] p-4 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-['Arimo:Bold'] text-[18px] text-[#292929]">To</label>
          <input
            type="text"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="Enter provider name"
            className="h-14 border border-[#ddd] rounded px-4 font-['Arimo:Regular'] text-[16px] text-[#292929] placeholder:text-[#9e9e9e] outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-['Arimo:Bold'] text-[18px] text-[#292929]">Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Type your message here"
            rows={9}
            className="border border-[#ddd] rounded px-[15px] py-[11px] font-['Arimo:Regular'] text-[16px] text-[#292929] placeholder:text-[#9e9e9e] outline-none resize-none"
          />
        </div>
        <button className="flex items-center gap-3">
          <Paperclip className="size-4" aria-hidden="true" />
          <span className="font-['Arimo:Bold'] text-[16px] text-[#292929]">Add an attachment</span>
        </button>
        <button
          onClick={handleSend}
          disabled={!to.trim() || !body.trim()}
          className="h-[54px] w-full flex items-center justify-center gap-2.5 rounded bg-[#1565c0] disabled:opacity-50 transition-opacity"
        >
          <Send className="size-4" aria-hidden="true" />
          <span className="font-['Arimo:Bold'] text-[16px] text-white">Send Message</span>
        </button>
      </div>
    </div>
  );
}

// ── Medications ───────────────────────────────────────────────────────────────

function MedicationsPage() {
  const meds = [
    { name: 'Lisinopril', dose: '10 mg tablet', schedule: 'Once daily · 8:00 AM', status: 'Taken today', sCls: 'bg-[#e3f3e6] text-[#1b5e20]' },
    { name: 'Metformin', dose: '500 mg tablet', schedule: 'Twice daily · With meals', status: 'Next at 6:00 PM', sCls: 'bg-[#e3f2fd] text-[#1565c0]' },
    { name: 'Atorvastatin', dose: '20 mg tablet', schedule: 'Once daily · 9:00 PM', status: 'Due tonight', sCls: 'bg-[#f5f7fa] text-[#686868]' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-[17px] pb-7 bg-[#f5f7fa]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-['Arimo:Bold'] text-[23px] text-[#292929]">Medications</h1>
          <p className="font-['Arimo:Regular'] text-[13px] text-[#686868] mt-1">Track your prescriptions and daily schedule.</p>
        </div>
        <button className="bg-[#1565c0] h-9 px-[17px] rounded font-['Arimo:Regular'] text-[13px] text-white whitespace-nowrap">
          + Add medication
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: 'ACTIVE MEDICATIONS', value: '3', sub: 'All prescriptions current' },
          { label: "TODAY'S PROGRESS", value: '3 of 4', sub: 'One dose remaining' },
          { label: 'NEXT REFILL', value: '12 days', sub: 'Lisinopril · Mar 26' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] p-4">
            <p className="font-['Arimo:Regular'] text-[11px] text-[#686868] tracking-[0.35px]">{c.label}</p>
            <p className="font-['Arimo:Bold'] text-[20px] text-[#0d47a1] mt-[7px]">{c.value}</p>
            <p className="font-['Arimo:Regular'] text-[13px] text-[#686868] mt-[7px]">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Meds list */}
      <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] overflow-hidden mb-4">
        <div className="flex items-center gap-2 px-4 h-[45px] border-b border-[#d9d9d9]">
          <Pill className="size-4" aria-hidden="true" />
          <span className="font-['Arimo:Bold'] text-[13px] text-[#292929]">MY MEDICATIONS</span>
        </div>
        <div className="p-4">
          {meds.map((m, i) => (
            <div key={m.name} className={`flex gap-4 items-center min-h-[76px] ${i > 0 ? 'border-t border-[#d9d9d9]' : ''}`}>
              <div className="bg-[#e3f2fd] rounded-full size-[42px] flex items-center justify-center shrink-0">
                <Pill className="size-4" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="font-['Arimo:Bold'] text-[13px] text-[#292929]">{m.name}</p>
                <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">{m.dose}</p>
              </div>
              <div className="w-[200px] shrink-0">
                <p className="font-['Arimo:Regular'] text-[11px] text-[#686868] tracking-[0.35px]">SCHEDULE</p>
                <p className="font-['Arimo:Regular'] text-[13px] text-[#292929]">{m.schedule}</p>
              </div>
              <div className={`h-[25px] px-[11px] rounded-full flex items-center whitespace-nowrap ${m.sCls}`}>
                <span className="font-['Arimo:Regular'] text-[11px]">{m.status}</span>
              </div>
              <button className="border border-[#d9d9d9] h-9 px-[17px] rounded font-['Arimo:Regular'] text-[13px] text-[#1565c0] shrink-0">
                Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-[#e3f2fd] flex gap-2.5 items-center h-[52px] px-[13px] rounded-[7px]">
        <Info className="size-4" aria-hidden="true" />
        <p className="font-['Arimo:Regular'] text-[13px] text-[#1565c0]">
          Never change or stop a medication without speaking to your care team.
        </p>
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────

function ProfilePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  // Pattern 2 — invoke: shows a native OS dialog, waits for user's choice
  async function handleLogout() {
    if (window.electronAPI?.confirmLogout) {
      const confirmed = await window.electronAPI.confirmLogout();

      if (confirmed) {
        window.electronAPI.notify('CareConnect', 'You have been signed out.');
        onNavigate('login');
      }
    } else {
      onNavigate('login');
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-4 bg-[#f5f7fa]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-['Arimo:Bold'] text-[22px] text-[#212121]">Profile</h1>
          <p className="font-['Arimo:Regular'] text-[13px] text-[#616161]">Manage your personal information and account settings</p>
        </div>
        <button className="bg-[#1565c0] flex gap-2 h-9 items-center px-5 rounded">
          <Edit className="size-4" aria-hidden="true" />
          <span className="font-['Arimo:Regular'] text-[13px] text-white">Edit Profile</span>
        </button>
      </div>

      {/* Avatar + personal info */}
      <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
        <div className="bg-white border border-[#e0e0e0] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] p-4 flex flex-col gap-3 items-center">
          <div className="bg-[#00897b] rounded-full size-20 flex items-center justify-center">
            <span className="font-['Arimo:Bold'] text-[24px] text-white">JD</span>
          </div>
          <div className="text-center">
            <p className="font-['Arimo:Bold'] text-[15px] text-[#212121]">Jane Marie Doe</p>
            <p className="font-['Arimo:Regular'] text-[12px] text-[#616161]">Patient</p>
          </div>
          <div className="border-t border-[#e0e0e0] pt-3 w-full flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Mail className="size-4" aria-hidden="true" />
              <div>
                <p className="font-['Arimo:Regular'] text-[10px] text-[#9e9e9e]">Email</p>
                <p className="font-['Arimo:Regular'] text-[11px] text-[#424242]">jane.doe@example.com</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Smartphone className="size-4" aria-hidden="true" />
              <div>
                <p className="font-['Arimo:Regular'] text-[10px] text-[#9e9e9e]">Phone</p>
                <p className="font-['Arimo:Regular'] text-[11px] text-[#424242]">(555) 867-5309</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-end w-full">
            <div className="bg-[#e0f2f1] flex gap-1.5 items-center justify-center px-2.5 py-1 rounded-full w-full">
              <div className="bg-[#00897b] rounded-full size-1.5" />
              <span className="font-['Arimo:Regular'] text-[11px] text-[#00897b]">Active Account</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e0e0e0] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e0e0e0] mb-3">
            <User className="size-4" aria-hidden="true" />
            <span className="font-['Arimo:Bold'] text-[13px] text-[#212121] tracking-[0.325px] uppercase">Personal Information</span>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            {[
              { label: 'FULL NAME', value: 'Jane Marie Doe' },
              { label: 'DATE OF BIRTH', value: 'March 14, 1985' },
              { label: 'EMAIL ADDRESS', value: 'jane.doe@example.com' },
              { label: 'PHONE NUMBER', value: '(555) 867-5309' },
            ].map(f => (
              <div key={f.label}>
                <p className="font-['Arimo:Regular'] text-[11px] text-[#616161] tracking-[0.55px] uppercase">{f.label}</p>
                <p className="font-['Arimo:Regular'] text-[13px] text-[#212121]">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Address + emergency contact */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-[#e0e0e0] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e0e0e0] mb-3">
            <MapPin className="size-4" aria-hidden="true" />
            <span className="font-['Arimo:Bold'] text-[13px] text-[#212121] tracking-[0.325px] uppercase">Address</span>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-['Arimo:Regular'] text-[11px] text-[#616161] tracking-[0.55px] uppercase">Street Address</p>
              <p className="font-['Arimo:Regular'] text-[13px] text-[#212121]">4821 Willowbrook Drive</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ l: 'CITY', v: 'San Francisco' }, { l: 'STATE', v: 'CA' }, { l: 'ZIP', v: '94102' }].map(f => (
                <div key={f.l}>
                  <p className="font-['Arimo:Regular'] text-[11px] text-[#616161] tracking-[0.55px] uppercase">{f.l}</p>
                  <p className="font-['Arimo:Regular'] text-[13px] text-[#212121]">{f.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e0e0e0] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e0e0e0] mb-3">
            <ShieldCheck className="size-[18px] shrink-0" aria-hidden="true" />
            <span className="font-['Arimo:Bold'] text-[13px] text-[#212121] tracking-[0.325px] uppercase">Emergency Contact</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {[{ l: 'CONTACT NAME', v: 'Robert Doe' }, { l: 'RELATIONSHIP', v: 'Spouse' }].map(f => (
                <div key={f.l}>
                  <p className="font-['Arimo:Regular'] text-[11px] text-[#616161] tracking-[0.55px] uppercase">{f.l}</p>
                  <p className="font-['Arimo:Regular'] text-[13px] text-[#212121]">{f.v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="font-['Arimo:Regular'] text-[11px] text-[#616161] tracking-[0.55px] uppercase">Phone Number</p>
              <p className="font-['Arimo:Regular'] text-[13px] text-[#212121]">(555) 234-5678</p>
            </div>
            <div className="bg-[#e3f2fd] flex gap-2.5 items-start p-3 rounded-[8px]">
              <Info className="size-4 shrink-0" aria-hidden="true" />
              <p className="font-['Arimo:Regular'] text-[11px] text-[#1565c0] leading-[15px]">
                This contact will be notified in case of a medical emergency. Please keep it up to date.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="bg-white border border-[#ffcdd2] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] flex items-center justify-between p-4">
        <div>
          <p className="font-['Arimo:Bold'] text-[13px] text-[#b3261e]">Sign Out</p>
          <p className="font-['Arimo:Regular'] text-[12px] text-[#616161]">
            You will be logged out of all active sessions on this device.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white border border-[#b3261e] flex gap-2 h-9 items-center px-5 rounded"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span className="font-['Arimo:Regular'] text-[13px] text-[#b3261e]">Logout</span>
        </button>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────

function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-[17px] pb-7 bg-[#f5f7fa]">
      <h1 className="font-['Arimo:Bold'] text-[23px] text-[#292929] mb-1">Settings</h1>
      <p className="font-['Arimo:Regular'] text-[13px] text-[#686868] mb-6">Manage your preferences and account settings.</p>
      <div className="bg-white border border-[#d9d9d9] rounded-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] p-6">
        <p className="font-['Arimo:Regular'] text-[13px] text-[#686868]">Settings content coming soon.</p>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [version, setVersion] = useState('2.4.1');

  const navigate = useCallback((p: Page) => setPage(p), []);

  // Fetch real app version from Electron on mount (Pattern 2 — invoke)
  useEffect(() => {
    window.electronAPI?.getVersion().then(v => setVersion(v));
  }, []);

  // Listen for native-menu navigation (Pattern 3 — main → renderer)
  useEffect(() => {
    const valid: Page[] = ['home', 'appointments', 'messages', 'medications', 'profile', 'settings'];
    const unsub = window.electronAPI?.onNavigate(p => {
      if (valid.includes(p as Page)) setPage(p as Page);
    });
    return () => unsub?.();
  }, []);

  // Tell main process which page is active so it can update the window title
  // (Pattern 1 — one-way send)
  useEffect(() => {
    window.electronAPI?.notifyPageChanged(page);
  }, [page]);

  function renderPage() {
    switch (page) {
      case 'login': return <LoginPage onNavigate={navigate} />;
      case 'reset-password': return <ResetPasswordPage onNavigate={navigate} />;
      case 'home': return <HomePage onNavigate={navigate} />;
      case 'appointments': return <AppointmentsPage />;
      case 'messages': return <MessagesPage onNavigate={navigate} />;
      case 'message-detail': return <MessageDetailPage onNavigate={navigate} />;
      case 'new-message': return <NewMessagePage onNavigate={navigate} />;
      case 'medications': return <MedicationsPage />;
      case 'profile': return <ProfilePage onNavigate={navigate} />;
      case 'settings': return <SettingsPage />;
    }
  }
  if (page === 'login' || page === 'reset-password') {
    return renderPage();
  }
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#f5f7fa]">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar current={page} onNavigate={navigate} />
        {renderPage()}
      </div>
      <Footer version={version} />
    </div>
  );
}
