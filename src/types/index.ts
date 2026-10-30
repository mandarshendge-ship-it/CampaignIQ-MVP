export type AppRole = 'ORG_ADMIN' | 'PROGRAMME_ADMIN' | 'MENTOR' | 'STUDENT' | 'JUDGE';

export const SWIMLANE_ROLES = [
  "Builder",
  "Prompt & PRD Writer",
  "Tester",
  "Deck & Loom",
  "Submitter"
] as const;

export type SwimlaneRole = (typeof SWIMLANE_ROLES)[number];

export const OUTSKILL_CHALLENGES = [
  {
    id: "c-1",
    title: "Personal Health Manager",
    category: "HealthTech / AI Lifestyle",
    problem: "Individuals with chronic lifestyle conditions or busy schedules struggle to consistently track biometrics, medications, dietary intake, and symptom progression in one proactive system.",
    targetUser: "Busy professionals, chronic health patients, and preventative wellness seekers.",
    outcome: "An intelligent, adaptive dashboard analyzing habits and suggesting actionable daily health interventions.",
    aiComponent: "LLM meal/symptom parser, predictive habit adherence engine, personalized wellness suggestions.",
    complexity: "Medium"
  },
  {
    id: "c-2",
    title: "Personal Finance Manager",
    category: "FinTech / Agentic AI",
    problem: "Users often overspend because banking apps only show retroactive expense graphs rather than forward-looking cashflow forecasting and conversational budgeting advice.",
    targetUser: "College students, first-time salary earners, and micro-freelancers.",
    outcome: "A proactive budget co-pilot that flags high-risk subscription renewals and runs 'What if I buy this?' scenarios.",
    aiComponent: "Transaction categorization agent, predictive monthly runway calculator, conversational finance assistant.",
    complexity: "Medium"
  },
  {
    id: "c-3",
    title: "Collaborative Notetaker",
    category: "Productivity / Knowledge Work",
    problem: "Real-time team meetings produce scattered audio, fragments of text, and lost action items that never make it into execution backlogs.",
    targetUser: "Remote distributed engineering, product, and design teams.",
    outcome: "A live canvas that transcribes, synthesizes consensus, extracts Jira-style action items, and organizes notes automatically.",
    aiComponent: "Multi-speaker transcript diarization, automatic semantic tagging, action item extraction with assignee matching.",
    complexity: "High"
  },
  {
    id: "c-4",
    title: "Task Management App",
    category: "Workplace / AI Kanban",
    problem: "Static Kanban boards fail because tasks grow stale without intelligent prioritization, effort estimation, and context-aware assignment.",
    targetUser: "Hackathon teams, agile product squads, and freelance collectives.",
    outcome: "A dynamic task board that calculates velocity, automatically recommends sprint scopes, and flags bottlenecks before they happen.",
    aiComponent: "Task duration estimator, blocker detection NLP model, automated PRD-to-subtask breakdown.",
    complexity: "Medium"
  },
  {
    id: "c-5",
    title: "AI Interior Makeover",
    category: "Design / Computer Vision",
    problem: "Homeowners and apartment renters cannot visualize furniture rearrangement, lighting, and paint redesigns in their actual spaces without hiring an interior designer.",
    targetUser: "Homeowners, renters, and independent interior staging consultants.",
    outcome: "An interactive room staging app where users upload a camera photo and generate photo-realistic redesigns with product shopping lists.",
    aiComponent: "Diffusion-based image inpainting, depth estimation, spatial room geometry analysis.",
    complexity: "High"
  },
  {
    id: "c-6",
    title: "Resume-to-Interview Coach",
    category: "EdTech / Career AI",
    problem: "Job applicants send resumes without knowing if their credentials align with job descriptions or how to structure answers for rigorous behavioral/technical interviews.",
    targetUser: "Graduating AI students, career switchers, and junior developers.",
    outcome: "A dual tool that audits resumes for ATS match and conducts realistic, audio/text mock interviews with targeted scoring.",
    aiComponent: "ATS match parser, dynamic interview question generation, response rubric scoring via LLM.",
    complexity: "Medium"
  },
  {
    id: "c-7",
    title: "Pet Care Companion",
    category: "Consumer / PetTech",
    problem: "Pet parents often miss vaccination schedules, struggle with interpreting pet symptom urgency, and lack dietary guidance tailored to breed and weight.",
    targetUser: "First-time dog and cat adopters, multi-pet households.",
    outcome: "A holistic pet health records and emergency triage companion that connects vet records with daily care logs.",
    aiComponent: "Symptom urgency classifier, breed-specific nutritional calculator, automated vet record digitization.",
    complexity: "Low-Medium"
  },
  {
    id: "c-8",
    title: "Campaign Planner",
    category: "Marketing / AI Growth",
    problem: "Bootstrapped founders and marketers lack the hours to brainstorm multi-channel content strategies, generate copy variations, and map UTM rollout schedules.",
    targetUser: "Early-stage founders, solo creators, and boutique marketing agencies.",
    outcome: "A 30-day cross-channel campaign generator that produces brand voice guidelines, launch copy, and asset delivery schedules.",
    aiComponent: "Multi-channel copy generator, campaign timeline synthesizer, persona voice calibration agent.",
    complexity: "Medium"
  }
] as const;

export const DEFAULT_WORKFLOW_STEPS = [
  {
    stepNumber: 1,
    title: "Pick the idea; define target user, pain and value",
    description: "Align the team on target user persona, core pain point, and clear value proposition.",
    defaultPlannedHours: 3,
    suggestedRole: "Prompt & PRD Writer" as SwimlaneRole
  },
  {
    stepNumber: 2,
    title: "Choose one main flow and up to two extra features",
    description: "Scope strictly: one primary killer user journey and at most two supporting features.",
    defaultPlannedHours: 3,
    suggestedRole: "Prompt & PRD Writer" as SwimlaneRole
  },
  {
    stepNumber: 3,
    title: "Create a short PRD and starting prompt",
    description: "Write the concise product specifications, data model schema, and initial prompt scaffolding.",
    defaultPlannedHours: 3,
    suggestedRole: "Prompt & PRD Writer" as SwimlaneRole
  },
  {
    stepNumber: 4,
    title: "Build initial app; confirm main flow runs",
    description: "Scaffold application layout, routes, and confirm the primary happy-path flow executes end-to-end.",
    defaultPlannedHours: 3,
    suggestedRole: "Builder" as SwimlaneRole
  },
  {
    stepNumber: 5,
    title: "Make main data operations work and add one AI feature",
    description: "Connect persistent data operations (Create, View, Update) and integrate the core AI model API call.",
    defaultPlannedHours: 3,
    suggestedRole: "Builder" as SwimlaneRole
  },
  {
    stepNumber: 6,
    title: "Test a realistic scenario twice and fix bugs",
    description: "Run two end-to-end realistic user test scenarios, log defect tickets, and resolve edge cases.",
    defaultPlannedHours: 3,
    suggestedRole: "Tester" as SwimlaneRole
  },
  {
    stepNumber: 7,
    title: "Record demo, finish deck and submit",
    description: "Record a crisp 3-minute Loom walkthrough, finalize presentation slides, and submit through portal.",
    defaultPlannedHours: 3,
    suggestedRole: "Deck & Loom" as SwimlaneRole
  }
] as const;

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  skills: string[];
  teamId?: string;
  isLeader?: boolean;
}

export interface StudentIdea {
  id: string;
  participantId: string;
  participantName: string;
  challengeId: string;
  title: string;
  problem: string;
  proposedSolution: string;
  expectedContribution: string;
  aiAssisted: boolean;
  submittedAt: string;
  version: number;
}

export interface IdeaVersion {
  ideaId: string;
  version: number;
  snapshot: Omit<StudentIdea, 'version'>;
  createdAt: string;
}

export interface IndividualCommitment {
  id: string;
  participantId: string;
  participantName: string;
  title: string;
  deliverableDescription: string;
  plannedHours: number;
  targetDueAt: string;
  status: 'COMMITTED' | 'IN_PROGRESS' | 'DELIVERED';
  evidenceUrl?: string;
  createdAt: string;
}

export interface TaskUpdate {
  id: string;
  taskId: string;
  participantId: string;
  participantName: string;
  status: TaskStatus;
  hoursDelta: number;
  progressNote: string;
  blocker?: string;
  evidenceUrl?: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  workflowStep: number;
  title: string;
  description: string;
  role: SwimlaneRole;
  primaryOwnerId: string;
  primaryOwnerName: string;
  plannedHours: number;
  actualHours: number;
  status: TaskStatus;
  isCritical: boolean;
  plannedStartHour: number; // 0..21
  plannedEndHour: number;
  updates: TaskUpdate[];
}

export interface MentorReview {
  id: string;
  mentorName: string;
  checkpoint: string;
  status: 'GREEN' | 'AMBER' | 'RED';
  feedback: string;
  reviewedAt: string;
}

export interface DemoSubmission {
  productName: string;
  tagline: string;
  liveUrl: string;
  loomUrl: string;
  deckUrl: string;
  repoUrl?: string;
  accessInstructions: string;
  submittedBy: string;
  submittedAt: string;
  isSubmitted: boolean;
}

export interface JudgingScore {
  judgeName: string;
  criteriaScores: {
    problemInnovation: number; // 0..10
    technicalExecution: number;
    aiIntegration: number;
    presentationDemo: number;
    completeness: number;
  };
  feedback: string;
  scoredAt: string;
}

export interface TeamData {
  id: string; // G1..G100
  name: string;
  leaderId: string;
  members: Participant[];
  roleAssignments: Record<SwimlaneRole, string[]>; // role -> participantIds
  selectedChallengeId: string | null;
  selectedChallengeTimestamp?: string;
  selectedBy?: string;
  ideas: StudentIdea[];
  commitments: IndividualCommitment[];
  tasks: TaskItem[];
  mentorReviews: MentorReview[];
  submission: DemoSubmission;
  judgingScores: JudgingScore[];
  sample: boolean;
}

export interface EventConfig {
  id: string;
  name: string;
  organisationName: string;
  timeZone: string;
  startsAt: string;
  eventEndsAt: string; // 48 hours mark
  submissionDeadlineAt: string; // portal deadline with buffer
  minTeamSize: number;
  maxTeamSize: number;
  status: 'UPCOMING' | 'ACTIVE' | 'CLOSED';
}

export interface AppState {
  event: EventConfig;
  currentRole: AppRole;
  currentUserId: string;
  selectedTeamId: string;
  activeNavTab: 'dashboard' | 'team' | 'challenges' | 'organiser' | 'judging' | 'reports' | 'settings';
  teams: Record<string, TeamData>;
  auditTrail: {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    details: string;
  }[];
}

