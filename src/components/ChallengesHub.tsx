import React, { useState } from 'react';
import { OUTSKILL_CHALLENGES, TeamData, StudentIdea } from '../types';
import { 
  Sparkles, CheckCircle2, AlertCircle, Bot, User, Clock, FilePlus2, 
  Send, Layers, ChevronRight, ShieldCheck, History
} from 'lucide-react';

interface ChallengesHubProps {
  team: TeamData;
  currentUserName: string;
  currentUserId: string;
  onUpdateTeam: (updatedTeam: TeamData) => void;
}

export const ChallengesHub: React.FC<ChallengesHubProps> = ({
  team,
  currentUserName,
  currentUserId,
  onUpdateTeam
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(team.selectedChallengeId || 'c-1');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // New Idea Submission State
  const [ideaTitle, setIdeaTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [expectedContribution, setExpectedContribution] = useState('');
  const [aiAssisted, setAiAssisted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const activeChallenge = OUTSKILL_CHALLENGES.find(c => c.id === selectedChallengeId) || OUTSKILL_CHALLENGES[0]!;

  const handleSelectTeamDirection = (challengeId: string) => {
    const challenge = OUTSKILL_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return;

    onUpdateTeam({
      ...team,
      selectedChallengeId: challengeId,
      selectedChallengeTimestamp: new Date().toISOString(),
      selectedBy: currentUserName
    });

    setFeedbackMsg(`Successfully locked in team primary direction: "${challenge.title}"`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !problem.trim() || !proposedSolution.trim()) {
      alert('Please fill out idea title, problem, and proposed solution.');
      return;
    }

    const newIdea: StudentIdea = {
      id: `idea-${Date.now()}`,
      participantId: currentUserId,
      participantName: currentUserName,
      challengeId: selectedChallengeId,
      title: ideaTitle.trim(),
      problem: problem.trim(),
      proposedSolution: proposedSolution.trim(),
      expectedContribution: expectedContribution.trim() || 'Core implementation & workflow validation',
      aiAssisted,
      submittedAt: new Date().toISOString(),
      version: 1
    };

    onUpdateTeam({
      ...team,
      ideas: [newIdea, ...team.ideas]
    });

    setIdeaTitle('');
    setProblem('');
    setProposedSolution('');
    setExpectedContribution('');
    setAiAssisted(false);
    setShowSubmitModal(false);
    setFeedbackMsg(`Your original idea "${newIdea.title}" has been safely snapshot and submitted!`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Screen 6 • Ideation & Direction
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Outskill G39 Catalogue (8 Challenges)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Challenge Catalogue & Student Idea Submissions
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Every team member submits an immutable original idea snapshot (attributed to author with timestamp). 
            The team selects one primary challenge direction for the 48-hour build.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
        >
          <FilePlus2 className="w-4 h-4" /> Submit Original Idea
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {feedbackMsg}
        </div>
      )}

      {/* Main Grid: 8 Outskill Challenge Cards on left, Details & Team Selection on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Challenge Selector List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Approved Challenge Topics ({OUTSKILL_CHALLENGES.length})
            </span>
            <span className="text-[11px] text-slate-500">Pick to explore</span>
          </div>

          <div className="space-y-2">
            {OUTSKILL_CHALLENGES.map((challenge, idx) => {
              const isSelected = selectedChallengeId === challenge.id;
              const isTeamPrimary = team.selectedChallengeId === challenge.id;

              return (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedChallengeId(challenge.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white leading-tight">
                        {challenge.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {challenge.category}
                    </p>
                  </div>

                  {isTeamPrimary && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                      ★ Team Pick
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Challenge Detail View & Team Selection Button (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {activeChallenge.category}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1.5">
                  {activeChallenge.title}
                </h2>
              </div>

              {team.selectedChallengeId === activeChallenge.id ? (
                <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> Primary Team Direction Locked
                </div>
              ) : (
                <button
                  onClick={() => handleSelectTeamDirection(activeChallenge.id)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Select as Team Direction
                </button>
              )}
            </div>

            {/* Problem Statement */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Problem Statement</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                {activeChallenge.problem}
              </p>
            </div>

            {/* Target User & Expected Outcome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target User</h4>
                <p className="text-xs text-slate-300 mt-1 font-medium">{activeChallenge.targetUser}</p>
              </div>

              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Complexity & Level</h4>
                <p className="text-xs text-indigo-400 mt-1 font-bold">{activeChallenge.complexity} Complexity</p>
              </div>
            </div>

            {/* AI Component */}
            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> Required AI Component Scaffolding
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activeChallenge.aiComponent}
              </p>
            </div>
          </div>

          {/* Student Submissions Under This Team */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" /> Team Member Idea Snapshots ({team.ideas.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Immutable attribution (BR-08)</span>
            </div>

            {team.ideas.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                No individual ideas submitted yet. Click "Submit Original Idea" above to record yours.
              </p>
            ) : (
              <div className="space-y-3">
                {team.ideas.map((idea) => (
                  <div key={idea.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{idea.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-semibold text-slate-300 flex items-center gap-1">
                            <User className="w-3 h-3" /> {idea.participantName}
                          </span>
                          <span>•</span>
                          <span>{new Date(idea.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span className="text-indigo-400 font-mono">v{idea.version} snapshot</span>
                        </div>
                      </div>

                      {idea.aiAssisted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                          <Bot className="w-3 h-3" /> AI-Assisted
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <strong>Solution:</strong> {idea.proposedSolution}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      <strong>Personal Contribution Promise:</strong> {idea.expectedContribution}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Idea Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Submit Original Idea
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Challenge</label>
                <select
                  value={selectedChallengeId}
                  onChange={(e) => setSelectedChallengeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {OUTSKILL_CHALLENGES.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Idea Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Adaptive Resume-to-Interview Coach"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Persona & Problem Identified</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Who is hurting and what is the exact friction?"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proposed AI Solution</label>
                <textarea
                  rows={2}
                  required
                  placeholder="How does your agentic workflow solve it?"
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">What will YOU personally build/deliver?</label>
                <input
                  type="text"
                  placeholder="e.g., Prompt tuning, frontend layout, E2E test runs"
                  value={expectedContribution}
                  onChange={(e) => setExpectedContribution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="aiCheck"
                  checked={aiAssisted}
                  onChange={(e) => setAiAssisted(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <label htmlFor="aiCheck" className="text-xs text-slate-300 cursor-pointer">
                  This concept used AI assistance (ChatGPT, Claude, etc.) — <span className="text-slate-400 italic">SRS Rule BR-08 requires explicit attribution.</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Snapshot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

