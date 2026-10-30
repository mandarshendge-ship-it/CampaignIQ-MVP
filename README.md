# CampaignIQ — AI Hackathon Manager (MVP v1.0)

> **Product Principle**: *Every idea. Every commitment. Every contribution. One clear view of progress against the deadline.*

Built strictly according to the **CampaignIQ Software Requirements Specification (SRS), Database Design, Permissions & UI/UX Blueprint** (`CampaignIQ_MVP_SRS_and_Implementation_Blueprint.docx`).

---

## 🚀 Overview of Implemented Modules (Phases 1–4)

### 1. Navigation, App Shell & Role Personas (Phase 1)
- **Multi-Role Persona Switcher**: Instantly preview the platform as:
  - **Student** (Elena Rostova - Builder)
  - **Team Leader** (Dev Patel - G39 Leader)
  - **Mentor** (Dr. Sarah Chen)
  - **Judge** (Alex Rivera)
  - **Organiser / Admin** (Outskill Academy)
- **Dual Event Timestamps & Countdown Header**:
  - Displays event time zone: `Asia/Kolkata (IST, UTC+5:30)`
  - Live ticking countdown strictly targeting `submission_deadline_at`, locking cleanly at zero (*"DEADLINE REACHED"*, Rule BR-14).
  - Separate 48-hour event window mark (`event_ends_at`).

### 2. Team Command Centre (Hero Screen 5)
- **5 KPI Metric Cards**:
  - 7-Step Workflow completion ratio & progress bar (21h baseline).
  - Tasks delivered count & completion percentage.
  - Remaining planned effort hours.
  - Cumulative actual time overrun (+X.Xh overrun, never labeled burnout per Section 5.1).
  - Objective Schedule Health (`ON TRACK` vs `BEHIND SCHEDULE` with exact causal explanation).
- **Five Role Swimlanes**:
  - `Builder`, `Prompt & PRD Writer`, `Tester`, `Deck & Loom`, `Submitter`
  - Shows assigned squad members and enforces **Rule BR-03** (Max 2 roles per member).
  - Interactive task blocks positioned along the 21-hour sequential time axis.
- **Interactive Task Detail & Contribution Drawer**:
  - Log incremental actual hours (`hoursDelta`, e.g., +1.5h).
  - Update status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `BLOCKED`).
  - Record progress notes, flag mentor impediments, and attach evidence URLs (GitHub, Loom, Figma).
  - Chronological append-only activity history log (Rule BR-08, FR-015).

### 3. Individual Accountability & Ideation (Phase 2 - Screen 6 & 7)
- **8 Outskill Challenge Topics Catalogue**:
  - Personal Health Manager, Personal Finance Manager, Collaborative Notetaker, Task Management App, AI Interior Makeover, Resume-to-Interview Coach, Pet Care Companion, Campaign Planner.
- **Team Primary Direction Selection**:
  - Allows team to formally lock in their primary challenge choice, recording selector and timestamp (Rule BR-07).
- **Student Original Idea Snapshots & Versions**:
  - Student idea submission form capturing persona pain point, proposed agentic solution, and personal contribution promise.
  - Explicit AI-assisted attribution flag (BR-08).
- **Individual Commitments Tracker**:
  - Explicit member promises with target completion times and deliverable descriptions.

### 4. Organiser Overview, Mentor Review & Judging (Phase 3 - Screen 8, 9, 10 & 11)
- **Organiser Overview & Analytics**:
  - Challenge popularity ranking showing the selection distribution of all 8 Outskill topics.
  - Real-time comparison matrix of squads G1 through G50 (completed steps, task count, logged effort, overruns, and schedule status).
  - One-click inspection jumping directly into any team's Command Centre.
- **Mentor Review Checkpoints**:
  - Checkpoint evaluations (`GREEN`, `AMBER`, `RED`) with actionable unblocking guidance.
- **Demo Submission Package**:
  - Canonical team package: Product name, tagline, live deployment URL, 3-minute Loom video, presentation deck URL, repository URL, access instructions (Rule BR-15: 1 submission per team).
- **Judge Rubric Scoring**:
  - 5-part weighted rubric: Problem & Innovation (25%), Technical Execution (25%), AI Integration (20%), Presentation & Loom (15%), Completeness (15%).
- **Contribution & Audit Reports**:
  - Student traceability matrix displaying ideas authored, commitments delivered, tasks completed, actual hours, and verified evidence links.
  - One-click browser CSV export utility (`CampaignIQ_Individual_Contributions.csv`).

### 5. PostgreSQL & Supabase Database Migration (Phase 4)
- Located at: `supabase/migrations/20261031_campaigniq_core.sql`
- Contains all 20+ tables specified in SRS Section 6.2.
- Server-side PostgreSQL trigger `check_max_two_roles_per_member()` preventing more than 2 active roles per participant under concurrent requests.
- Row-Level Security (RLS) policies enforcing multi-tenant isolation.

---

## 🛠️ Clone & Run Locally

```bash
# Clone the repository from GitHub
git clone https://github.com/mandarshendge-ship-it/CampaignIQ-MVP.git
cd CampaignIQ-MVP

# Install dependencies
npm install

# Start the development server (runs on port 3000)
npm run dev

# Or test the optimized production build
npm run build
npm run preview
```

---

## 📁 Repository Structure

```
CampaignIQ_MVP_SRS/
├── dist/                              # Compiled production assets
├── public/                            # Static assets
├── src/
│   ├── components/
│   │   ├── Navigation.tsx             # Header, Countdown, Role Switcher
│   │   ├── TeamCommandCentre.tsx      # Hero Screen 5 (KPIs, 5 Swimlanes, 7 Steps)
│   │   ├── TaskDetailModal.tsx        # Task updates, hours delta, evidence attachment
│   │   ├── ChallengesHub.tsx          # Screen 6: 8 Challenges, Selection & Ideas
│   │   ├── CommitmentsTracker.tsx     # Screen 7: Individual Promises & Deliverables
│   │   ├── OrganiserOverview.tsx      # Screen 8: Popularity Charts & G1-G50 Matrix
│   │   ├── DemoSubmissionAndJudging.tsx # Screen 9 & 10: Submission & Rubric Scoring
│   │   └── ReportsAndAudit.tsx        # Screen 11: Traceability Table & CSV Export
│   ├── lib/
│   │   ├── calculations.ts            # Mathematical rules (overrun, pace, BR-03)
│   │   └── seedData.ts                # Outskill G39 event, teams, and audit seed
│   ├── types/
│   │   └── index.ts                   # Complete TypeScript data model
│   ├── App.tsx                        # Global state, router, and localStorage sync
│   ├── index.css                      # Tailwind CSS v4 design system
│   └── main.tsx                       # React 19 root entrypoint
├── supabase/
│   └── migrations/
│       └── 20261031_campaigniq_core.sql # PostgreSQL schema, RLS, triggers
├── package.json
├── tsconfig.json
└── vite.config.ts
```

