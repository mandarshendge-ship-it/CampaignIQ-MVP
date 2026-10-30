import React, { useState } from 'react';
import { TeamData, DemoSubmission, JudgingScore, MentorReview } from '../types';
import { 
  Award, PlayCircle, Link2, CheckCircle2, ShieldCheck, Star, 
  Send, ExternalLink, FileText, User, AlertCircle, MessageSquare
} from 'lucide-react';

interface DemoSubmissionAndJudgingProps {
  team: TeamData;
  currentUserName: string;
  currentRole: string;
  onUpdateTeam: (updatedTeam: TeamData) => void;
}

export const DemoSubmissionAndJudging: React.FC<DemoSubmissionAndJudgingProps> = ({
  team,
  currentUserName,
  currentRole,
  onUpdateTeam
}) => {
  // Submission Form State
  const [productName, setProductName] = useState(team.submission.productName || '');
  const [tagline, setTagline] = useState(team.submission.tagline || '');
  const [liveUrl, setLiveUrl] = useState(team.submission.liveUrl || '');
  const [loomUrl, setLoomUrl] = useState(team.submission.loomUrl || '');
  const [deckUrl, setDeckUrl] = useState(team.submission.deckUrl || '');
  const [repoUrl, setRepoUrl] = useState(team.submission.repoUrl || 'https://github.com/mandarshendge-ship-it/CampaignIQ-MVP');
  const [accessInstructions, setAccessInstructions] = useState(team.submission.accessInstructions || '');
  const [subMsg, setSubMsg] = useState('');

  // Judging Form State (Screen 10)
  const [problemInnovation, setProblemInnovation] = useState(8.5);
  const [technicalExecution, setTechnicalExecution] = useState(9.0);
  const [aiIntegration, setAiIntegration] = useState(8.5);
  const [presentationDemo, setPresentationDemo] = useState(8.0);
  const [completeness, setCompleteness] = useState(9.0);
  const [judgeFeedback, setJudgeFeedback] = useState('');
  const [judgeMsg, setJudgeMsg] = useState('');

  // Mentor Review State (Screen 9)
  const [mentorCheckpoint, setMentorCheckpoint] = useState('Checkpoint 2: Core Architecture & Live API');
  const [mentorStatus, setMentorStatus] = useState<'GREEN' | 'AMBER' | 'RED'>('GREEN');
  const [mentorFeedback, setMentorFeedback] = useState('');

  const weightedTotalScore = (
    (problemInnovation * 0.25) +
    (technicalExecution * 0.25) +
    (aiIntegration * 0.20) +
    (presentationDemo * 0.15) +
    (completeness * 0.15)
  ).toFixed(2);

  const handleSubmitPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !liveUrl.trim() || !loomUrl.trim() || !deckUrl.trim()) {
      alert('Please complete all required submission package fields (Product Name, Live URL, Loom URL, Deck URL).');
      return;
    }

    const submission: DemoSubmission = {
      productName: productName.trim(),
      tagline: tagline.trim(),
      liveUrl: liveUrl.trim(),
      loomUrl: loomUrl.trim(),
      deckUrl: deckUrl.trim(),
      repoUrl: repoUrl.trim() || undefined,
      accessInstructions: accessInstructions.trim(),
      submittedBy: currentUserName,
      submittedAt: new Date().toISOString(),
      isSubmitted: true
    };

    onUpdateTeam({
      ...team,
      submission
    });

    setSubMsg('Official Demo Package locked and submitted to judging portal (BR-15)!');
    setTimeout(() => setSubMsg(''), 4500);
  };

  const handleScoreSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const newScore: JudgingScore = {
      judgeName: currentUserName,
      criteriaScores: {
        problemInnovation,
        technicalExecution,
        aiIntegration,
        presentationDemo,
        completeness
      },
      feedback: judgeFeedback.trim() || 'Strong MVP delivery meeting all core criteria.',
      scoredAt: new Date().toISOString()
    };

    onUpdateTeam({
      ...team,
      judgingScores: [newScore, ...team.judgingScores]
    });

    setJudgeMsg(`Official evaluation recorded for ${team.id} (Weighted Score: ${weightedTotalScore} / 10).`);
    setJudgeFeedback('');
    setTimeout(() => setJudgeMsg(''), 4500);
  };

  const handleAddMentorReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorFeedback.trim()) return;

    const review: MentorReview = {
      id: `rev-${Date.now()}`,
      mentorName: currentUserName,
      checkpoint: mentorCheckpoint,
      status: mentorStatus,
      feedback: mentorFeedback.trim(),
      reviewedAt: new Date().toISOString()
    };

    onUpdateTeam({
      ...team,
      mentorReviews: [review, ...team.mentorReviews]
    });

    setMentorFeedback('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Screen 9 & 10 • Submission & Rubric Judging
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Final Milestone Evaluation
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Official Demo Submission & Judging Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Team submitters deliver one canonical demo package (Loom, live URL, slide deck). 
            Accredited judges evaluate against the official Outskill 5-part rubric.
          </p>
        </div>

        {team.submission.isSubmitted && (
          <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-4 py-2 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-5 h-5" /> Submitted & Verified
          </div>
        )}
      </div>

      {subMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {subMsg}
        </div>
      )}

      {judgeMsg && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-400 flex items-center gap-2">
          <Award className="w-4 h-4" /> {judgeMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Team Demo Submission Package (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-400" /> Team Final Demo Package (FR-022)
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Team: {team.id}</span>
            </div>

            <form onSubmit={handleSubmitPackage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CoachIQ Accelerator"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">One-Line Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Turn resume into mock interview in 30s"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" /> Live Product URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <PlayCircle className="w-3.5 h-3.5 text-indigo-400" /> Loom / Video Walkthrough URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://loom.com/share/..."
                    value={loomUrl}
                    onChange={(e) => setLoomUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Slide Deck Presentation URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://pitch.com/..."
                    value={deckUrl}
                    onChange={(e) => setDeckUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-slate-400" /> GitHub Repository URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Judge Access Instructions / Test Credentials
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pre-seeded demo credentials or special testing notes..."
                  value={accessInstructions}
                  onChange={(e) => setAccessInstructions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {team.submission.isSubmitted 
                    ? `Submitted by ${team.submission.submittedBy} at ${new Date(team.submission.submittedAt).toLocaleTimeString()}`
                    : '1 official submission allowed per team (Rule BR-15)'}
                </span>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Lock & Submit Final Package
                </button>
              </div>
            </form>
          </div>

          {/* Section: Mentor Checkpoints & Feedback (Screen 9 - FR-021) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" /> Mentor Checkpoints & Review Notes ({team.mentorReviews.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Visible to team</span>
            </div>

            {/* Mentor Post Form */}
            <form onSubmit={handleAddMentorReview} className="p-3.5 bg-slate-950/70 border border-purple-500/30 rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Checkpoint</label>
                  <input
                    type="text"
                    value={mentorCheckpoint}
                    onChange={(e) => setMentorCheckpoint(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Status Flag</label>
                  <select
                    value={mentorStatus}
                    onChange={(e) => setMentorStatus(e.target.value as 'GREEN' | 'AMBER' | 'RED')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    <option value="GREEN">GREEN - Smooth Cadence</option>
                    <option value="AMBER">AMBER - Scope Warning</option>
                    <option value="RED">RED - Critical Blocker</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Mentor Feedback & Guidance</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Constructive feedback, technical hints, or unblocking suggestions..."
                  value={mentorFeedback}
                  onChange={(e) => setMentorFeedback(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
                >
                  Record Mentor Review
                </button>
              </div>
            </form>

            {/* Reviews list */}
            <div className="space-y-2.5">
              {team.mentorReviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rev.mentorName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rev.status === 'GREEN' ? 'bg-emerald-500/20 text-emerald-400' :
                      rev.status === 'AMBER' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {rev.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{rev.checkpoint}</p>
                  <p className="text-slate-300 pt-0.5">{rev.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Judge Evaluation & Rubric Form (5 Cols - FR-023) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Judge Scoring Rubric (FR-023)
              </h3>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Weighted Score</span>
                <p className="text-lg font-mono font-extrabold text-amber-400">{weightedTotalScore} / 10</p>
              </div>
            </div>

            <form onSubmit={handleScoreSubmission} className="space-y-3.5">
              {/* Criteria 1: Problem & Innovation (25%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Problem & Innovation (25%)</span>
                  <span className="font-mono text-amber-400 font-bold">{problemInnovation} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={problemInnovation}
                  onChange={(e) => setProblemInnovation(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Criteria 2: Technical Execution (25%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Technical Execution (25%)</span>
                  <span className="font-mono text-amber-400 font-bold">{technicalExecution} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={technicalExecution}
                  onChange={(e) => setTechnicalExecution(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Criteria 3: AI Component & Prompt Grounding (20%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">AI Integration & Grounding (20%)</span>
                  <span className="font-mono text-amber-400 font-bold">{aiIntegration} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={aiIntegration}
                  onChange={(e) => setAiIntegration(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Criteria 4: Presentation & Loom Demo (15%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Presentation & Loom Demo (15%)</span>
                  <span className="font-mono text-amber-400 font-bold">{presentationDemo} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={presentationDemo}
                  onChange={(e) => setPresentationDemo(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Criteria 5: Completeness & UX Polish (15%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Completeness & Polish (15%)</span>
                  <span className="font-mono text-amber-400 font-bold">{completeness} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={completeness}
                  onChange={(e) => setCompleteness(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Judge Feedback</label>
                <textarea
                  rows={2}
                  placeholder="Written feedback for the team..."
                  value={judgeFeedback}
                  onChange={(e) => setJudgeFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" /> Submit Official Judge Score
              </button>
            </form>
          </div>

          {/* Existing Scores for this team */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recorded Evaluations ({team.judgingScores.length})
            </h4>

            {team.judgingScores.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                Awaiting judge review.
              </p>
            ) : (
              <div className="space-y-2">
                {team.judgingScores.map((score, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{score.judgeName}</span>
                      <span className="font-mono font-bold text-amber-400">
                        {((score.criteriaScores.problemInnovation * 0.25) +
                          (score.criteriaScores.technicalExecution * 0.25) +
                          (score.criteriaScores.aiIntegration * 0.20) +
                          (score.criteriaScores.presentationDemo * 0.15) +
                          (score.criteriaScores.completeness * 0.15)).toFixed(2)} / 10
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{score.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

