import React, { useState } from 'react';
import { TeamData, TaskItem, SWIMLANE_ROLES, SwimlaneRole, OUTSKILL_CHALLENGES } from '../types';
import { calculateTeamMetrics, calculateTaskOverrun } from '../lib/calculations';
import { TaskDetailModal } from './TaskDetailModal';
import { 
  Users, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ChevronRight, 
  Sparkles, ExternalLink, PlayCircle, PlusCircle, ArrowUpRight, Flame, Layers,
  Activity, Shield, Check
} from 'lucide-react';

interface TeamCommandCentreProps {
  team: TeamData;
  submissionDeadlineIso: string;
  timeZone: string;
  nowMs: number;
  currentUserName: string;
  currentUserId: string;
  onUpdateTeam: (updatedTeam: TeamData) => void;
  onNavigateTab: (tab: 'challenges' | 'judging' | 'reports') => void;
}

export const TeamCommandCentre: React.FC<TeamCommandCentreProps> = ({
  team,
  submissionDeadlineIso,
  timeZone,
  nowMs,
  currentUserName,
  currentUserId,
  onUpdateTeam,
  onNavigateTab
}) => {
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const metrics = calculateTeamMetrics(team, submissionDeadlineIso, nowMs);

  const selectedChallenge = OUTSKILL_CHALLENGES.find(c => c.id === team.selectedChallengeId);

  const handleSaveTaskUpdate = (taskId: string, updatedTask: TaskItem) => {
    const updatedTasks = team.tasks.map(t => t.id === taskId ? updatedTask : t);
    onUpdateTeam({
      ...team,
      tasks: updatedTasks
    });
  };

  const getStatusBadge = (status: TaskItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 glow-success';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'BLOCKED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 glow-danger';
      default:
        return 'bg-slate-800/80 text-slate-400 border-slate-700/60';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Cinematic Hero Command Banner with Attached Arena Backdrop */}
      <div className="relative rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden group">
        
        {/* Real-world AI Hackathon Arena Image with High-End Consulting Gradient Mask */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700 scale-100 group-hover:scale-105"
          style={{ backgroundImage: "url('/assets/arena-ai-backdrop.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-indigo-950/70 backdrop-blur-[2px]" />
        
        {/* Subtle Ambient Glow Spots */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            
            <div className="space-y-3">
              {/* Squad Header Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-black tracking-widest px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 glow-indigo">
                  SQUAD {team.id}
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-slate-900/80 text-slate-300 border border-slate-800">
                  {team.members.length} AI Engineers
                </span>
                {team.sample && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <Activity className="w-3 h-3" /> Live Showcase
                  </span>
                )}
              </div>

              {/* Team Name */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {team.name}
              </h1>

              {/* Challenge Direction Pill */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pt-1">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-400">Challenge Direction:</span>
                {selectedChallenge ? (
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white bg-slate-900/90 px-3 py-1 rounded-xl border border-indigo-500/30 text-xs">
                      {selectedChallenge.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hidden sm:inline">
                      {selectedChallenge.category}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigateTab('challenges')}
                    className="font-bold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Select Challenge Direction →
                  </button>
                )}
              </div>
            </div>

            {/* Executive Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('challenges')}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Ideas Hub ({team.ideas.length})
              </button>
              
              <button
                onClick={() => onNavigateTab('judging')}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                Demo Package
              </button>
            </div>
          </div>

          {/* 5 Enterprise Telemetry Metric Cards (Deloitte / Accenture Executive Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-8 pt-6 border-t border-slate-800/80">
            
            {/* Card 1: 7-Step Workflow */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">
                <span>7-Step Workflow</span>
                <span className="text-indigo-400">{metrics.workflowCompletionPercent}%</span>
              </div>
              <p className="text-2xl font-mono font-extrabold text-white mt-1.5">
                {metrics.completedWorkflowSteps} <span className="text-slate-500 text-sm font-sans font-normal">/ 7 steps</span>
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.workflowCompletionPercent}%` }}
                />
              </div>
            </div>

            {/* Card 2: Tasks Delivered */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">
                <span>Milestones Done</span>
                <span className="text-slate-400">{metrics.completedTasks}/{metrics.totalTasks}</span>
              </div>
              <p className="text-2xl font-mono font-extrabold text-white mt-1.5">
                {metrics.taskCompletionPercent}<span className="text-indigo-400 text-base font-normal">%</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                {metrics.completedTasks} active deliverables verified
              </p>
            </div>

            {/* Card 3: Remaining Effort */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">
                <span>Remaining Plan</span>
                <span className="text-indigo-400 font-mono">21h Norm</span>
              </div>
              <p className="text-2xl font-mono font-extrabold text-indigo-300 mt-1.5">
                {metrics.remainingPlannedHours.toFixed(1)} <span className="text-slate-500 text-sm font-sans font-normal">hrs</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                Total plan: {metrics.plannedTotalHours}h baseline
              </p>
            </div>

            {/* Card 4: Time Overrun */}
            <div className={`rounded-2xl p-4 border transition-all ${
              metrics.overrunHours > 0
                ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                : 'bg-slate-950/70 border-slate-800/80'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">
                <span>Time Overrun</span>
                {metrics.overrunHours > 0 && <span className="text-amber-400 font-bold">!</span>}
              </div>
              <p className={`text-2xl font-mono font-extrabold mt-1.5 ${
                metrics.overrunHours > 0 ? 'text-amber-400' : 'text-slate-300'
              }`}>
                {metrics.overrunHours > 0 ? `+${metrics.overrunHours.toFixed(1)}h` : '0.0h'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                {metrics.overrunHours > 0 ? 'Actual effort over estimate' : 'Within planned budget'}
              </p>
            </div>

            {/* Card 5: Schedule Health Status */}
            <div className={`col-span-2 sm:col-span-1 rounded-2xl p-4 border transition-all ${
              metrics.scheduleStatus === 'BEHIND'
                ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10 glow-danger'
                : 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10 glow-success'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                Schedule Cadence
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                {metrics.scheduleStatus === 'BEHIND' ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span className="text-base font-extrabold font-mono text-rose-400 tracking-tight">BEHIND</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-base font-extrabold font-mono text-emerald-400 tracking-tight">ON TRACK</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate" title={metrics.scheduleReason}>
                {metrics.scheduleReason}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Role Swimlanes (Hero Timeline Axis) */}
      <section className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Background mesh glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                TIMELINE AXIS • 21 HOURS
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-400" /> Five Role Swimlanes & Task Allocations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict 1-owner accountability. Click any task block to log hours, update deliverables, or flag impediments.
            </p>
          </div>

          {/* Status Indicator Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/70 border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Not Started
            </span>
            <span className="flex items-center gap-1.5 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> In Progress
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
            </span>
            <span className="flex items-center gap-1.5 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Blocked
            </span>
          </div>
        </div>

        {/* Sequential Swimlane Rows */}
        <div className="space-y-3.5 relative z-10">
          {SWIMLANE_ROLES.map((role) => {
            const assignedParticipantIds = team.roleAssignments[role] || [];
            const assignedMembers = team.members.filter(m => assignedParticipantIds.includes(m.id));
            const roleTasks = team.tasks.filter(t => t.role === role);

            return (
              <div 
                key={role}
                className="grid grid-cols-12 gap-4 p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:bg-slate-950/90 transition-all duration-200"
              >
                {/* Swimlane Info Header (Col 1-3) */}
                <div className="col-span-12 sm:col-span-3 border-b sm:border-b-0 sm:border-r border-slate-800/80 pr-4 pb-3 sm:pb-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-white tracking-tight">{role}</span>
                      <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                        {assignedMembers.length} member{assignedMembers.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* Member Tags (Rule BR-03 verified) */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {assignedMembers.length === 0 ? (
                        <span className="text-[11px] text-amber-400/90 italic">No owner assigned</span>
                      ) : (
                        assignedMembers.map(m => (
                          <span 
                            key={m.id} 
                            className="text-[11px] font-semibold bg-slate-900 text-slate-200 px-2.5 py-0.5 rounded-lg border border-slate-700/80"
                          >
                            {m.fullName}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-slate-500 mt-2">
                    Max 2 roles / member enforced (BR-03)
                  </p>
                </div>

                {/* Interactive Task Blocks (Col 4-12) */}
                <div className="col-span-12 sm:col-span-9 flex flex-wrap items-center gap-2.5 min-h-[54px]">
                  {roleTasks.length === 0 ? (
                    <span className="text-xs text-slate-600 italic">No tasks assigned in this swimlane.</span>
                  ) : (
                    roleTasks.map(task => {
                      const taskOverrun = calculateTaskOverrun(task);
                      return (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={`group text-left px-3.5 py-2.5 rounded-xl border text-xs transition-all hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusBadge(task.status)}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-black/40">
                              Step {task.workflowStep}
                            </span>
                            <span className="font-bold text-white truncate max-w-[210px]">
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] opacity-90 font-mono">
                            <span>{task.primaryOwnerName}</span>
                            <span>•</span>
                            <span>{task.actualHours.toFixed(1)}h / {task.plannedHours}h</span>
                            {taskOverrun > 0 && (
                              <span className="font-bold text-amber-300 bg-amber-500/25 px-1.5 py-0.2 rounded">
                                +{taskOverrun.toFixed(1)}h overrun
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7-Step Workflow Matrix */}
      <section className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Default Seven-Step Build Sequence (Outskill Baseline)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard 3 hours per step = 21 hours total planned timeline.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
            {metrics.completedWorkflowSteps} / 7 Steps Complete
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {team.tasks.map((task) => {
            const isDone = task.status === 'COMPLETED';
            const isInProgress = task.status === 'IN_PROGRESS';
            const overrun = calculateTaskOverrun(task);

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:bg-slate-800/40 hover:scale-[1.01] ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-500/30' 
                    : isInProgress 
                    ? 'bg-blue-950/20 border-blue-500/30' 
                    : 'bg-slate-950/50 border-slate-800/90'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                      isDone 
                        ? 'bg-emerald-500 text-slate-950' 
                        : isInProgress 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {task.workflowStep}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white leading-snug">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Role: <span className="text-slate-300 font-semibold">{task.role}</span> • Owner: <span className="text-slate-300 font-semibold">{task.primaryOwnerName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md ${getStatusBadge(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                      {task.actualHours.toFixed(1)}h / {task.plannedHours}h
                      {overrun > 0 && <span className="text-amber-400 font-bold ml-1">+{overrun.toFixed(1)}h</span>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          currentUserName={currentUserName}
          currentUserId={currentUserId}
          onClose={() => setSelectedTask(null)}
          onSaveUpdate={handleSaveTaskUpdate}
        />
      )}
    </div>
  );
};
