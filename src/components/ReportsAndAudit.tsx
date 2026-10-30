import React, { useState } from 'react';
import { AppState, TeamData } from '../types';
import { 
  FileText, Download, Shield, Users, CheckCircle2, Clock, 
  ExternalLink, Sparkles, Filter, Search, Table, Layers
} from 'lucide-react';

interface ReportsAndAuditProps {
  state: AppState;
}

export const ReportsAndAudit: React.FC<ReportsAndAuditProps> = ({ state }) => {
  const { event, teams, auditTrail } = state;
  const [activeTab, setActiveTab] = useState<'individual' | 'audit' | 'summary'>('individual');
  const [search, setSearch] = useState('');

  // Collect individual contributions across all teams
  const individualContributions = Object.values(teams).flatMap(team => {
    return team.members.map(member => {
      const authoredIdeas = team.ideas.filter(i => i.participantId === member.id);
      const commitments = team.commitments.filter(c => c.participantId === member.id);
      const ownedTasks = team.tasks.filter(t => t.primaryOwnerId === member.id);
      const completedTasks = ownedTasks.filter(t => t.status === 'COMPLETED');
      const plannedHours = ownedTasks.reduce((s, t) => s + t.plannedHours, 0);
      const actualHours = ownedTasks.reduce((s, t) => s + t.actualHours, 0);
      const evidenceCount = ownedTasks.flatMap(t => t.updates).filter(u => !!u.evidenceUrl).length;

      return {
        id: member.id,
        name: member.fullName,
        email: member.email,
        teamId: team.id,
        teamName: team.name,
        roleInTeam: member.isLeader ? 'Leader' : 'Member',
        ideasCount: authoredIdeas.length,
        commitmentsTotal: commitments.length,
        commitmentsDelivered: commitments.filter(c => c.status === 'DELIVERED').length,
        tasksTotal: ownedTasks.length,
        tasksCompleted: completedTasks.length,
        plannedHours,
        actualHours,
        evidenceCount
      };
    });
  });

  const filteredContributions = individualContributions.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.teamId.toLowerCase().includes(search.toLowerCase()) ||
    c.teamName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Screen 11 • Contribution & Audit Reports
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Traceability & Compliance (FR-024, FR-025)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Individual Contribution & Event Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Every idea snapshot, commitment, task completion, and evidence artifact is individually attributable. 
            Download complete CSV datasets covering all G1–G50 teams, all 365 members, and all 350 tasks.
          </p>
        </div>

        {/* 3 Explicit CSV Download Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/data/hackathon_teams_scenarios_matrix.csv"
            download="hackathon_teams_scenarios_matrix.csv"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" /> Squads Matrix (G1–G50)
          </a>

          <a
            href="/data/hackathon_members_complete_roster.csv"
            download="hackathon_members_complete_roster.csv"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Users className="w-3.5 h-3.5" /> All 365 Members Roster
          </a>

          <a
            href="/data/hackathon_tasks_execution_matrix.csv"
            download="hackathon_tasks_execution_matrix.csv"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition-all shadow-md"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> All 350 Tasks Matrix
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('individual')}
          className={`pb-3 transition-colors ${
            activeTab === 'individual' 
              ? 'text-indigo-400 border-b-2 border-indigo-500' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Individual Contributions ({individualContributions.length} Students across G1–G50)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition-colors ${
            activeTab === 'audit' 
              ? 'text-indigo-400 border-b-2 border-indigo-500' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          System Audit Trail ({auditTrail.length} Events)
        </button>
      </div>

      {activeTab === 'individual' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Student Deliverables & Time Logged (365 AI Engineers)
            </h3>
            <input
              type="text"
              placeholder="Filter by student or team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4 text-center">Ideas</th>
                  <th className="py-3 px-4 text-center">Commitments</th>
                  <th className="py-3 px-4 text-center">Tasks Done</th>
                  <th className="py-3 px-4">Effort (Act / Plan)</th>
                  <th className="py-3 px-4 text-center">Evidence Proofs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                {filteredContributions.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-white">{student.name}</p>
                        <p className="text-[10px] text-slate-400">{student.email}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded text-[11px]">
                        {student.teamId}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-300">
                      {student.ideasCount}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-white">{student.commitmentsDelivered}</span>
                      <span className="text-slate-500"> / {student.commitmentsTotal}</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-emerald-400">{student.tasksCompleted}</span>
                      <span className="text-slate-500"> / {student.tasksTotal}</span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-white">{student.actualHours.toFixed(1)}h</span>
                      <span className="text-slate-500"> / {student.plannedHours}h</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {student.evidenceCount > 0 ? (
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          {student.evidenceCount} verified
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px] italic">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> Immutable Event Audit Trail (FR-025)
          </h3>

          <div className="space-y-2.5">
            {auditTrail.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-bold text-indigo-400">{log.action}</span>
                  <span className="font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-200">{log.details}</p>
                <p className="text-[10px] text-slate-500">Actor: <span className="text-slate-400 font-medium">{log.actor}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
