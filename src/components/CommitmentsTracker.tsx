import React, { useState } from 'react';
import { TeamData, IndividualCommitment } from '../types';
import { 
  CheckCircle2, Clock, Calendar, PlusCircle, User, ShieldCheck, 
  ExternalLink, FileCheck, Send, Link2
} from 'lucide-react';

interface CommitmentsTrackerProps {
  team: TeamData;
  currentUserName: string;
  currentUserId: string;
  onUpdateTeam: (updatedTeam: TeamData) => void;
}

export const CommitmentsTracker: React.FC<CommitmentsTrackerProps> = ({
  team,
  currentUserName,
  currentUserId,
  onUpdateTeam
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [plannedHours, setPlannedHours] = useState(3);
  const [targetDueHours, setTargetDueHours] = useState(12);

  const handleCreateCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCommitment: IndividualCommitment = {
      id: `com-${Date.now()}`,
      participantId: currentUserId,
      participantName: currentUserName,
      title: title.trim(),
      deliverableDescription: description.trim() || 'Core module delivery and verification',
      plannedHours: Number(plannedHours || 3),
      targetDueAt: new Date(Date.now() + targetDueHours * 3600 * 1000).toISOString(),
      status: 'COMMITTED',
      createdAt: new Date().toISOString()
    };

    onUpdateTeam({
      ...team,
      commitments: [newCommitment, ...team.commitments]
    });

    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  const handleUpdateStatus = (id: string, status: IndividualCommitment['status']) => {
    const updated = team.commitments.map(c => c.id === id ? { ...c, status } : c);
    onUpdateTeam({ ...team, commitments: updated });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-400" /> Individual Member Commitments ({team.commitments.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicit deliverables promised by each team member (FR-012).
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Log Commitment
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateCommitment} className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Promise a Deliverable for {team.name}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Commitment Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Test Suite & Regression Fixes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Estimated Hours</label>
              <input
                type="number"
                min="1"
                max="24"
                value={plannedHours}
                onChange={(e) => setPlannedHours(parseFloat(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Deliverable Description</label>
            <textarea
              rows={2}
              placeholder="What tangible artifact will you deliver (repo, PR, deck, test results)?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
            >
              Save Commitment
            </button>
          </div>
        </form>
      )}

      {team.commitments.length === 0 ? (
        <p className="text-xs text-slate-500 italic p-3 bg-slate-950/40 rounded-xl border border-slate-800">
          No commitments recorded yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {team.commitments.map((com) => (
            <div key={com.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white">{com.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-slate-500" /> {com.participantName} • {com.plannedHours}h promised
                  </p>
                </div>

                <select
                  value={com.status}
                  onChange={(e) => handleUpdateStatus(com.id, e.target.value as IndividualCommitment['status'])}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border focus:outline-none cursor-pointer ${
                    com.status === 'DELIVERED' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : com.status === 'IN_PROGRESS'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <option value="COMMITTED">COMMITTED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>

              <p className="text-xs text-slate-300">{com.deliverableDescription}</p>

              {com.evidenceUrl && (
                <a
                  href={com.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-medium pt-1"
                >
                  <Link2 className="w-3 h-3" /> View Deliverable Artifact
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

