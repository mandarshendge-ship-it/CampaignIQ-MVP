import React, { useState } from 'react';
import { AppState, OUTSKILL_CHALLENGES, TeamData } from '../types';
import { calculateTeamMetrics } from '../lib/calculations';
import { 
  BarChart3, Users, Filter, ArrowUpRight, AlertTriangle, ShieldCheck, 
  Sparkles, Award, Search, CheckCircle2, ChevronRight
} from 'lucide-react';

interface OrganiserOverviewProps {
  state: AppState;
  nowMs: number;
  onSelectTeam: (teamId: string) => void;
}

export const OrganiserOverview: React.FC<OrganiserOverviewProps> = ({
  state,
  nowMs,
  onSelectTeam
}) => {
  const { event, teams } = state;
  const [filterChallenge, setFilterChallenge] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Calculate 8 Outskill Challenge Selection Counts (FR-019 / BR-07)
  const challengePopularity = OUTSKILL_CHALLENGES.map(challenge => {
    const selectedCount = Object.values(teams).filter(t => t.selectedChallengeId === challenge.id).length;
    return {
      ...challenge,
      selectedCount,
      percentage: Math.round((selectedCount / Object.keys(teams).length) * 100)
    };
  }).sort((a, b) => b.selectedCount - a.selectedCount);

  // 2. Team Matrix with Calculations
  const teamRows = Object.values(teams).map(t => {
    const metrics = calculateTeamMetrics(t, event.submissionDeadlineAt, nowMs);
    const challenge = OUTSKILL_CHALLENGES.find(c => c.id === t.selectedChallengeId);
    return {
      team: t,
      metrics,
      challengeTitle: challenge?.title || 'Unselected'
    };
  });

  // Filtered rows
  const filteredTeams = teamRows.filter(({ team, metrics, challengeTitle }) => {
    if (filterChallenge !== 'ALL' && team.selectedChallengeId !== filterChallenge) return false;
    if (filterStatus === 'ON_TRACK' && metrics.scheduleStatus !== 'ON_TRACK') return false;
    if (filterStatus === 'BEHIND' && metrics.scheduleStatus !== 'BEHIND') return false;
    if (filterStatus === 'SUBMITTED' && !team.submission.isSubmitted) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        team.id.toLowerCase().includes(q) ||
        team.name.toLowerCase().includes(q) ||
        challengeTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalTeams = Object.keys(teams).length;
  const behindCount = teamRows.filter(r => r.metrics.scheduleStatus === 'BEHIND').length;
  const submittedCount = teamRows.filter(r => r.team.submission.isSubmitted).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Screen 8 • Organiser Overview
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Multi-Team Monitoring & Selection Analytics
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Hackathon Command & Team Progress Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time birds-eye view across all hackathon squads (G1–G50). Compare workflow pacing, 
            detect schedule overruns early, and inspect idea popularity distribution.
          </p>
        </div>

        {/* Global Summary Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Teams</span>
            <p className="text-lg font-extrabold text-white">{totalTeams}</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2 text-center">
            <span className="text-[10px] text-rose-400 uppercase font-semibold">Behind Schedule</span>
            <p className="text-lg font-extrabold text-rose-400">{behindCount}</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-2 text-center">
            <span className="text-[10px] text-indigo-400 uppercase font-semibold">Demo Submitted</span>
            <p className="text-lg font-extrabold text-indigo-400">{submittedCount}</p>
          </div>
        </div>
      </div>

      {/* Section 1: Idea Popularity Analytics (8 Outskill Challenges - FR-019) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Challenge Selection Popularity (Outskill 8 Topics)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Counts how many teams have locked in each primary challenge direction (BR-07).
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Sorted by selection count
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {challengePopularity.map((cp, idx) => (
            <div 
              key={cp.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 space-y-2 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  #{idx + 1}
                </span>
                <span className="text-xs font-extrabold text-indigo-400">
                  {cp.selectedCount} {cp.selectedCount === 1 ? 'Team' : 'Teams'}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate" title={cp.title}>
                  {cp.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">{cp.category}</p>
              </div>

              {/* Progress Bar of popularity */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${Math.max(8, (cp.selectedCount / totalTeams) * 100 * 3)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Team Progress Comparison Matrix (FR-020) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Team Progress & Schedule Comparison Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect workflow step completion, hour overruns, and schedule status for every team.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search team or challenge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ON_TRACK">On Track Only</option>
              <option value="BEHIND">Behind Schedule Only</option>
              <option value="SUBMITTED">Submitted Demos Only</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Selected Challenge</th>
                <th className="py-3 px-4">7-Step Workflow</th>
                <th className="py-3 px-4">Tasks Done</th>
                <th className="py-3 px-4">Effort Logged</th>
                <th className="py-3 px-4">Time Overrun</th>
                <th className="py-3 px-4">Schedule Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
              {filteredTeams.map(({ team, metrics, challengeTitle }) => (
                <tr 
                  key={team.id}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {team.id}
                      </span>
                      <div>
                        <p className="font-bold text-white">{team.name}</p>
                        <p className="text-[10px] text-slate-400">{team.members.length} members</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-300 max-w-[180px] truncate">
                    {challengeTitle}
                  </td>

                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">{metrics.completedWorkflowSteps} / 7</span>
                        <span className="text-slate-400">{metrics.workflowCompletionPercent}%</span>
                      </div>
                      <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full" 
                          style={{ width: `${metrics.workflowCompletionPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-300">
                    {metrics.completedTasks} / {metrics.totalTasks}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    {metrics.actualTotalHours.toFixed(1)}h / {metrics.plannedTotalHours}h
                  </td>

                  <td className="py-3 px-4">
                    {metrics.overrunHours > 0 ? (
                      <span className="text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded text-[11px]">
                        +{metrics.overrunHours.toFixed(1)}h
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">0.0h</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {metrics.scheduleStatus === 'BEHIND' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded text-[10px]">
                        <AlertTriangle className="w-3 h-3" /> BEHIND
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded text-[10px]">
                        <ShieldCheck className="w-3 h-3" /> ON TRACK
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectTeam(team.id)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 hover:underline text-xs"
                    >
                      Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

