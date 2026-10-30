import React, { useState, useEffect } from 'react';
import { AppState, TeamData } from './types';
import { getInitialSeedState } from './lib/seedData';
import { Navigation } from './components/Navigation';
import { TeamCommandCentre } from './components/TeamCommandCentre';
import { ChallengesHub } from './components/ChallengesHub';
import { CommitmentsTracker } from './components/CommitmentsTracker';
import { OrganiserOverview } from './components/OrganiserOverview';
import { DemoSubmissionAndJudging } from './components/DemoSubmissionAndJudging';
import { ReportsAndAudit } from './components/ReportsAndAudit';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sparkles, RotateCcw, ShieldCheck, Activity } from 'lucide-react';

const STORAGE_KEY = 'campaigniq-mvp-v3-state';

export function AppContent() {
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [state, setState] = useState<AppState | null>(null);

  // Live real-time clock ticker for countdown precision (FR-018)
  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load from localStorage or initialize with Outskill G39 Seed State
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.event && parsed.teams && parsed.teams['G39']) {
          setState(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('LocalStorage parse error, falling back to seed:', e);
    }
    const seed = getInitialSeedState(Date.now());
    setState(seed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
    }
  }, [state]);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-400 text-sm font-mono">
        <Sparkles className="w-5 h-5 text-indigo-400 animate-spin mr-2" /> Initializing CampaignIQ Command Centre...
      </div>
    );
  }

  const currentTeam = state.teams[state.selectedTeamId] || state.teams['G39']!;

  const handleUpdateTeam = (updatedTeam: TeamData) => {
    setState({
      ...state,
      teams: {
        ...state.teams,
        [updatedTeam.id]: updatedTeam
      }
    });
  };

  const handleResetSeedData = () => {
    if (window.confirm('Reset all teams, ideas, tasks and metrics back to Outskill G39 baseline seed data?')) {
      const freshState = getInitialSeedState(Date.now());
      setState(freshState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
    }
  };

  // Determine current active user persona display name
  const currentUserName = 
    state.currentRole === 'STUDENT' ? 'Elena Rostova (Builder)' :
    state.currentRole === 'PROGRAMME_ADMIN' ? 'Dev Patel (Team Leader)' :
    state.currentRole === 'MENTOR' ? 'Dr. Sarah Chen (Mentor)' :
    state.currentRole === 'JUDGE' ? 'Alex Rivera (Judge)' :
    'Outskill Academy Administrator';

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Graphic: Executive AI Neural Constellation & Mesh */}
      <div 
        className="fixed inset-0 bg-cover bg-top opacity-20 pointer-events-none z-0"
        style={{ backgroundImage: "url('/assets/executive-ai-mesh.jpg')" }}
      />

      {/* Enterprise Dot Grid Texture Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-60" />

      {/* Ambient Radial Spotlight Lighting */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -left-40 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-2/3 -right-40 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Global Navigation Header */}
      <div className="relative z-30">
        <Navigation
          state={state}
          nowMs={nowMs}
          onUpdateState={setState}
        />
      </div>

      {/* Main App Content View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        
        {state.activeNavTab === 'team' && (
          <TeamCommandCentre
            team={currentTeam}
            submissionDeadlineIso={state.event.submissionDeadlineAt}
            timeZone={state.event.timeZone}
            nowMs={nowMs}
            currentUserName={currentUserName}
            currentUserId={state.currentUserId}
            onUpdateTeam={handleUpdateTeam}
            onNavigateTab={(tab) => setState({ ...state, activeNavTab: tab })}
          />
        )}

        {state.activeNavTab === 'challenges' && (
          <div className="space-y-6">
            <ChallengesHub
              team={currentTeam}
              currentUserName={currentUserName}
              currentUserId={state.currentUserId}
              onUpdateTeam={handleUpdateTeam}
            />
            <CommitmentsTracker
              team={currentTeam}
              currentUserName={currentUserName}
              currentUserId={state.currentUserId}
              onUpdateTeam={handleUpdateTeam}
            />
          </div>
        )}

        {state.activeNavTab === 'organiser' && (
          <OrganiserOverview
            state={state}
            nowMs={nowMs}
            onSelectTeam={(teamId) => setState({ ...state, selectedTeamId: teamId, activeNavTab: 'team' })}
          />
        )}

        {state.activeNavTab === 'judging' && (
          <DemoSubmissionAndJudging
            team={currentTeam}
            currentUserName={currentUserName}
            currentRole={state.currentRole}
            onUpdateTeam={handleUpdateTeam}
          />
        )}

        {state.activeNavTab === 'reports' && (
          <ReportsAndAudit
            state={state}
          />
        )}
      </main>

      {/* Executive Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-xl text-slate-500 text-xs py-5 px-6 mt-16 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <p className="font-bold text-slate-300">CampaignIQ — AI Hackathon Manager</p>
              <p className="text-[11px] text-slate-500">Engineered to Outskill G39 Implementation Blueprint • Enterprise MVP</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry Synced
            </span>
            <span className="text-slate-800">|</span>
            <button
              onClick={handleResetSeedData}
              className="text-slate-400 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Sample Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
