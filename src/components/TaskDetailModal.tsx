import React, { useState } from 'react';
import { TaskItem, TaskStatus, TaskUpdate, SwimlaneRole } from '../types';
import { calculateTaskOverrun } from '../lib/calculations';
import { 
  X, CheckCircle, Clock, AlertTriangle, AlertCircle, Link2, FileText, 
  Send, User, ShieldAlert, History
} from 'lucide-react';

interface TaskDetailModalProps {
  task: TaskItem;
  currentUserName: string;
  currentUserId: string;
  onClose: () => void;
  onSaveUpdate: (taskId: string, updatedTask: TaskItem, newUpdate?: TaskUpdate) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  currentUserName,
  currentUserId,
  onClose,
  onSaveUpdate
}) => {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [hoursDelta, setHoursDelta] = useState<number>(0);
  const [progressNote, setProgressNote] = useState<string>('');
  const [blocker, setBlocker] = useState<string>('');
  const [evidenceUrl, setEvidenceUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const currentOverrun = calculateTaskOverrun(task);
  const newEstimatedActual = task.actualHours + Number(hoursDelta || 0);
  const newOverrun = Math.max(0, newEstimatedActual - task.plannedHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressNote.trim() && hoursDelta === 0 && status === task.status && !evidenceUrl.trim()) {
      setErrorMsg('Please enter an hours delta, a note, a status update, or an evidence URL.');
      return;
    }

    const updatedTask: TaskItem = {
      ...task,
      status,
      actualHours: newEstimatedActual,
    };

    let newUpdate: TaskUpdate | undefined;
    if (progressNote.trim() || hoursDelta > 0 || blocker.trim() || evidenceUrl.trim()) {
      newUpdate = {
        id: `up-${Date.now()}`,
        taskId: task.id,
        participantId: currentUserId,
        participantName: currentUserName,
        status,
        hoursDelta: Number(hoursDelta || 0),
        progressNote: progressNote.trim() || `Status updated to ${status}`,
        blocker: blocker.trim() || undefined,
        evidenceUrl: evidenceUrl.trim() || undefined,
        createdAt: new Date().toISOString()
      };
      updatedTask.updates = [newUpdate, ...task.updates];
    }

    onSaveUpdate(task.id, updatedTask, newUpdate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Workflow Step {task.workflowStep} of 7
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                {task.role} Lane
              </span>
              {task.isCritical && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Critical Milestone
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
              {task.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Primary Owner: <strong className="text-slate-200">{task.primaryOwnerName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Overview & Hours Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400 font-medium">Planned Effort</p>
              <p className="text-lg font-bold text-white mt-0.5">{task.plannedHours.toFixed(1)} hrs</p>
              <p className="text-[10px] text-slate-500 mt-1">Default 3h step baseline</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400 font-medium">Actual Logged</p>
              <p className="text-lg font-bold text-indigo-400 mt-0.5">{task.actualHours.toFixed(1)} hrs</p>
              <p className="text-[10px] text-slate-500 mt-1">Direct student input</p>
            </div>

            <div className={`border rounded-xl p-3.5 ${
              currentOverrun > 0 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <p className="text-[11px] font-medium text-slate-300">Time Overrun</p>
              <p className={`text-lg font-bold mt-0.5 ${currentOverrun > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentOverrun > 0 ? `+${currentOverrun.toFixed(1)} hrs` : '0.0 hrs (On Plan)'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {currentOverrun > 0 ? 'Work exceeded initial scope' : 'Within planned duration'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Scope & Description</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{task.description}</p>
          </div>

          {/* Student Progress Update Form */}
          <form onSubmit={handleSubmit} className="bg-slate-950/50 border border-indigo-500/20 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Log Task Contribution & Progress
              </h4>
              <span className="text-[11px] text-indigo-400 font-medium">Logged by: {currentUserName}</span>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                {errorMsg}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Update Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="BLOCKED">Blocked (Impediment)</option>
                </select>
              </div>

              {/* Additional Hours Delta */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Add Effort Hours (Delta): <strong className="text-white">+{hoursDelta}h</strong>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={hoursDelta || ''}
                    placeholder="e.g. 1.5"
                    onChange={(e) => setHoursDelta(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="text-[11px] text-slate-400 whitespace-nowrap">
                    New total: <span className="font-bold text-indigo-300">{newEstimatedActual.toFixed(1)}h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Note */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Progress Note / What Did You Accomplish?
              </label>
              <textarea
                rows={2}
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                placeholder="Briefly state what was built, verified, or changed..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Blocker Note if Blocked */}
            {status === 'BLOCKED' && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
                <label className="block text-xs font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> What is blocking this task? (Visible to Mentors)
                </label>
                <input
                  type="text"
                  value={blocker}
                  onChange={(e) => setBlocker(e.target.value)}
                  placeholder="e.g., Waiting for API key approval, vector DB rate limit error..."
                  className="w-full bg-slate-900 border border-rose-500/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}

            {/* Evidence URL */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-400" /> Evidence Link (GitHub commit, Loom, Figma, or Docs)
              </label>
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://github.com/... or https://loom.com/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" /> Post Progress Update
              </button>
            </div>
          </form>

          {/* Chronological Append-Only History Log (BR-08 / FR-015) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" /> Activity & Contribution History ({task.updates.length})
            </h4>

            {task.updates.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-950/40 rounded-lg border border-slate-800">
                No activity logged yet. Submit the form above to record progress.
              </p>
            ) : (
              <div className="space-y-2.5">
                {task.updates.map((up) => (
                  <div key={up.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-200">{up.participantName}</span>
                      <span>{new Date(up.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300">{up.progressNote}</p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                      {up.hoursDelta > 0 && (
                        <span className="text-indigo-400 font-medium">+{up.hoursDelta} hrs logged</span>
                      )}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        up.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        up.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {up.status}
                      </span>
                      {up.evidenceUrl && (
                        <a
                          href={up.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Link2 className="w-3 h-3" /> View Evidence
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

