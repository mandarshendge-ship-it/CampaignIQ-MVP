import React from 'react';
import { AppRole, AppState } from '../types';
import { formatCountdown } from '../lib/calculations';
import { 
  Clock, Shield, Users, BarChart3, CheckSquare, Award, FileText, Settings, 
  ExternalLink, Sparkles, ChevronDown, CheckCircle2, AlertTriangle, Activity
} from 'lucide-react';

interface NavigationProps {
  state: AppState;
  nowMs: number;
  onUpdateState: (newState: AppState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ state, nowMs, onUpdateState }) => {
  const { event, currentRole, selectedTeamId, activeNavTab, teams } = state;
  const countdown = formatCountdown(event.submissionDeadlineAt, nowMs);

  const roleLabels: Record<AppRole, { title: string; badge: string; color: string; border: string }> = {
    STUDENT: { 
      title: "Student (Elena - Builder)", 
      badge: "Participant", 
      color: "bg-emerald-500/10 text-emerald-300", 
      border: "border-emerald-500/30" 
    },
    PROGRAMME_ADMIN: { 
      title: "Team Leader (Dev - G39)", 
      badge: "Team Lead", 
      color: "bg-blue-500/10 text-blue-300", 
      border: "border-blue-500/30" 
    },
    MENTOR: { 
      title: "Mentor (Dr. Sarah Chen)", 
      badge: "AI Faculty", 
      color: "bg-purple-500/10 text-purple-300", 
      border: "border-purple-500/30" 
    },
    JUDGE: { 
      title: "Judge (Alex Rivera)", 
      badge: "Evaluator", 
      color: "bg-amber-500/10 text-amber-300", 
      border: "border-amber-500/30" 
    },
    ORG_ADMIN: { 
      title: "Organiser (Outskill Academy)", 
      badge: "Exec Admin", 
      color: "bg-rose-500/10 text-rose-300", 
      border: "border-rose-500/30" 
    },
  };

  const navItems = [
    { id: 'team', label: 'Team Command Centre', icon: Users, badge: 'Hero View' },
    { id: 'challenges', label: 'Challenges & Ideation', icon: Sparkles, count: 8 },
    { id: 'organiser', label: 'Organiser Overview', icon: BarChart3, badge: 'Analytics' },
    { id: 'judging', label: 'Demo & Rubric Scoring', icon: Award },
    { id: 'reports', label: 'Reports & Audit Export', icon: FileText },
  ] as const;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl sticky top-0 z-40 transition-all">
      {/* Top Ambient Glow Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Organization Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CampaignIQ
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                AI HACKATHON MANAGER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md flex items-center gap-2 mt-0.5">
              <span>{event.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-mono text-[11px]">{event.timeZone}</span>
            </p>
          </div>
        </div>

        {/* Cinematic Midnight Countdown Card with Image Backdrop Integration */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 shadow-2xl group min-w-[280px]">
          {/* Subtle real-world hackathon image in background with high contrast gradient overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-500 scale-105 group-hover:scale-100"
            style={{ backgroundImage: "url('/assets/countdown-midnight-team.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-indigo-950/80" />

          {/* Interactive Countdown Content */}
          <div className="relative z-10 px-4 py-2 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shrink-0">
              <Clock className={`w-4 h-4 ${countdown.isExpired ? 'text-rose-400 animate-pulse' : 'text-indigo-300'}`} />
            </div>

            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5">
                <span>PORTAL DEADLINE</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="font-mono text-base font-extrabold text-white tracking-wider">
                {countdown.isExpired ? (
                  <span className="text-rose-400 font-bold">DEADLINE REACHED</span>
                ) : (
                  <span>
                    <span className="text-indigo-200">{String(countdown.days).padStart(2, '0')}d</span> :{' '}
                    <span className="text-indigo-200">{String(countdown.hours).padStart(2, '0')}h</span> :{' '}
                    <span className="text-indigo-200">{String(countdown.minutes).padStart(2, '0')}m</span> :{' '}
                    <span className="text-emerald-400 font-bold">{String(countdown.seconds).padStart(2, '0')}s</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Squad & Role Persona Controls */}
        <div className="flex items-center gap-3">
          
          {/* Team Selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
            <span className="text-xs text-slate-400 font-semibold">Squad:</span>
            <select
              value={selectedTeamId}
              onChange={(e) => onUpdateState({ ...state, selectedTeamId: e.target.value })}
              className="bg-transparent text-sm font-bold font-mono text-white focus:outline-none cursor-pointer"
            >
              {Object.keys(teams)
                .sort((a, b) => {
                  if (a === 'G39') return -1;
                  if (b === 'G39') return 1;
                  const numA = parseInt(a.replace(/\D/g, '')) || 0;
                  const numB = parseInt(b.replace(/\D/g, '')) || 0;
                  return numA - numB;
                })
                .map(id => (
                  <option key={id} value={id} className="bg-slate-900 text-white font-mono">
                    {id} - {teams[id]?.name || `Squad ${id}`}
                  </option>
                ))}
            </select>
          </div>

          {/* Persona Switcher (Accenture/Deloitte Executive Credential Style) */}
          <div className="flex items-center gap-1.5">
            <select
              value={currentRole}
              onChange={(e) => onUpdateState({ ...state, currentRole: e.target.value as AppRole })}
              className={`text-xs font-bold px-3 py-2 rounded-xl border cursor-pointer focus:outline-none transition-all shadow-md ${roleLabels[currentRole].color} ${roleLabels[currentRole].border}`}
            >
              <option value="STUDENT" className="bg-slate-900 text-slate-200">Persona: Student (Elena - Builder)</option>
              <option value="PROGRAMME_ADMIN" className="bg-slate-900 text-slate-200">Persona: Team Leader (Dev - G39)</option>
              <option value="MENTOR" className="bg-slate-900 text-slate-200">Persona: Mentor (Dr. Sarah Chen)</option>
              <option value="JUDGE" className="bg-slate-900 text-slate-200">Persona: Judge (Alex Rivera)</option>
              <option value="ORG_ADMIN" className="bg-slate-900 text-slate-200">Persona: Organiser / Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar border-t border-slate-800/80 gap-1.5 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onUpdateState({ ...state, activeNavTab: item.id })}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-mono font-extrabold ${
                  isActive ? 'bg-indigo-900/80 text-indigo-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
