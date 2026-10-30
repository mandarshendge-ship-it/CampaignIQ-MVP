// Comprehensive Multi-Table CSV Generator for CampaignIQ MVP
// Generates:
// 1. hackathon_members_complete_roster.csv (All 365 members across G1-G50)
// 2. hackathon_tasks_execution_matrix.csv (All 350 tasks across 7 steps and 50 squads)
// 3. hackathon_teams_scenarios_matrix.csv (All 50 squads tagged with exact realistic scenario types)

import fs from 'fs';
import path from 'path';

const OUTSKILL_CHALLENGES = [
  { id: "c-1", title: "Personal Health Manager", category: "HealthTech / AI Lifestyle" },
  { id: "c-2", title: "Personal Finance Manager", category: "FinTech / Agentic AI" },
  { id: "c-3", title: "Collaborative Notetaker", category: "Productivity / Knowledge Work" },
  { id: "c-4", title: "Task Management App", category: "Workplace / AI Kanban" },
  { id: "c-5", title: "AI Interior Makeover", category: "Design / Computer Vision" },
  { id: "c-6", title: "Resume-to-Interview Coach", category: "EdTech / Career AI" },
  { id: "c-7", title: "Pet Care Companion", category: "Consumer / PetTech" },
  { id: "c-8", title: "Campaign Planner", category: "Marketing / AI Growth" }
];

const DEFAULT_WORKFLOW_STEPS = [
  { stepNumber: 1, title: "Pick the idea; define target user, pain and value", role: "Prompt & PRD Writer", hours: 3 },
  { stepNumber: 2, title: "Choose one main flow and up to two extra features", role: "Prompt & PRD Writer", hours: 3 },
  { stepNumber: 3, title: "Create a short PRD and starting prompt", role: "Prompt & PRD Writer", hours: 3 },
  { stepNumber: 4, title: "Build initial app; confirm main flow runs", role: "Builder", hours: 3 },
  { stepNumber: 5, title: "Make main data operations work and add one AI feature", role: "Builder", hours: 3 },
  { stepNumber: 6, title: "Test a realistic scenario twice and fix bugs", role: "Tester", hours: 3 },
  { stepNumber: 7, title: "Record demo, finish deck and submit", role: "Deck & Loom", hours: 3 }
];

const FIRST_NAMES = [
  "Aiko", "Dev", "Elena", "Farah", "Ben", "Chloe", "Kenji", "Amina",
  "Liam", "Sophia", "Mateo", "Fatima", "Carlos", "Yuki", "Aisha", "Marcus",
  "Olga", "Ravi", "Hannah", "Gabriel", "Mei", "Tariq", "Siddharth", "Zoe",
  "Kaito", "Ingrid", "Dmitri", "Nour", "Lucas", "Priya", "Arjun", "Zara"
];

const LAST_NAMES = [
  "Patel", "Rostova", "Al-Mansoor", "Takahashi", "Dubois", "Sato", "Yusuf", "O'Connor",
  "Müller", "Rossi", "Al-Zahra", "Mendez", "Tanaka", "Diallo", "Zhang", "Ivanov",
  "Krishnan", "Lindholm", "Santos", "Chen", "Kowalski", "Borges", "Nakamura", "Morales"
];

const TEAM_NAMES = [
  "NeuralPulse AI", "Aegis Health", "FinPilot AI", "SyncScript Studio", "TaskFlow Dynamic",
  "RoomVision 3D", "CoachIQ Accelerator", "PawPal Health", "CampaignArchitect", "Vitalis Biosense",
  "LedgerSense AI", "Omnia Note", "Velocity Sprint", "DecorMorph AI", "CareerAscent Pro",
  "VetAssist Companion", "MarketPulse 360", "ChronoCare Health", "PocketCFO AI", "MeetingSynth Canvas",
  "BacklogOptimizer", "SpatialCraft 3D", "MockInterviewer", "CanineHealth AI", "ContentRocket Agent",
  "CardioPredict AI", "SmartSpend Co-pilot", "TranscriptMaster", "SprintPulse Kanban", "ArchiScan Interior",
  "JobMatch Pro", "PetGuardian Wellness", "FunnelMaster AI", "NutriTrack Assistant", "BudgetForge AI",
  "CollabCanvas", "AgileMind Squad", "LivingSpace 3D", "HiringEdge Coach", "TailWag Health",
  "GrowthEngine 360", "MindWell AI", "FiscalFlow AI", "SummaryBot Canvas", "JiraCoPilot Agent",
  "InteriorVisionary", "InterviewAce AI", "PurrfectCare AI", "Omnichannel LaunchPad", "Apex AI Innovators"
];

const SKILLS_POOL = [
  "React 19", "FastAPI", "Prompt Engineering", "OpenAI API", "Vector DBs", "Tailwind CSS",
  "TypeScript", "Python", "LangChain", "QA Testing", "Figma", "Loom Storytelling", "PostgreSQL"
];

const BLOCKER_REASONS = [
  "Rate limit exceeded on OpenAI text-embedding-3-small",
  "PDF parser regression on complex tabular resumes",
  "CORS error connecting local Vite client to FastAPI backend",
  "Awaiting mentor clarification on secondary feature scope",
  "Latency spike (>8s) in multi-agent LLM chain response",
  "Supabase foreign key constraint violation on member invite"
];

const nowMs = Date.now();

const teamsSummaryRows = [];
const membersRows = [];
const tasksRows = [];

// Header for Teams Matrix
teamsSummaryRows.push([
  "Team Code", "Team Name", "Selected Challenge", "Scenario Classification",
  "Members Count", "Team Leader", "7-Step Steps Done", "Workflow Progress %",
  "Tasks Completed / Total", "Planned Hours (Norm)", "Actual Hours Logged",
  "Time Overrun (Hours)", "Schedule Health Status", "Mentor Checkpoint Status",
  "Demo Submitted", "Demo Live URL", "Demo Loom URL", "Judge Weighted Score"
].join(','));

// Header for Members Roster
membersRows.push([
  "Participant ID", "Team Code", "Team Name", "Full Name", "Email",
  "Role In Team", "Assigned Swimlane Roles (Rule BR-03)", "Active Role Count",
  "Skills", "Ideas Authored", "Idea Title", "AI-Assisted Idea Flag",
  "Commitment Promised", "Commitment Status", "Tasks Owned Count",
  "Tasks Completed Count", "Planned Effort (Hours)", "Actual Effort Logged (Hours)",
  "Overrun (Hours)", "Evidence Links Verified", "Contribution Health"
].join(','));

// Header for Tasks Execution Matrix
tasksRows.push([
  "Team Code", "Task ID", "Workflow Step", "Step Title", "Role Swimlane",
  "Primary Owner Name", "Owner ID", "Status", "Is Critical Milestone",
  "Planned Hours", "Actual Hours", "Overrun (Hours)", "Blocker Reason",
  "Progress Note", "Evidence Proof URL", "Scenario Classification"
].join(','));

for (let i = 1; i <= 50; i++) {
  const teamId = `G${i}`;
  const teamName = TEAM_NAMES[i - 1] || `AI Squad ${teamId}`;
  
  // Scenario assignment
  let scenarioType = "";
  let completedStepsCount = 0;
  let hasOverrun = false;
  let isBlocked = false;
  let isUnselected = false;
  let isSubmitted = false;
  let mentorStatus = "GREEN";

  if (teamId === 'G39') {
    scenarioType = "HERO_IN_FLIGHT";
    completedStepsCount = 4;
    hasOverrun = true;
    mentorStatus = "GREEN";
  } else if (i === 1 || i === 3 || i === 5) {
    scenarioType = "ON_TIME_TOP_TIER";
    completedStepsCount = 7;
    isSubmitted = true;
    mentorStatus = "GREEN";
  } else if (i === 2 || i === 4 || i === 6 || i === 8) {
    scenarioType = "OVERRUN_BUT_DELIVERED";
    completedStepsCount = 7;
    hasOverrun = true;
    isSubmitted = true;
    mentorStatus = "GREEN";
  } else if (i === 7 || i === 14 || i === 21 || i === 35) {
    scenarioType = "CRITICAL_PATH_BLOCKER";
    completedStepsCount = (i % 3) + 2;
    isBlocked = true;
    hasOverrun = true;
    mentorStatus = "RED";
  } else if (i === 44 || i === 48) {
    scenarioType = "UNSELECTED_DIRECTION";
    completedStepsCount = 1;
    isUnselected = true;
    mentorStatus = "AMBER";
  } else if (i >= 46) {
    scenarioType = "EARLY_STAGE_IDEATION";
    completedStepsCount = 1;
    mentorStatus = "AMBER";
  } else if (i >= 26 && i <= 34) {
    scenarioType = "PACING_LAG_BEHIND";
    completedStepsCount = 2;
    mentorStatus = "AMBER";
  } else {
    scenarioType = "MID_FLIGHT_ON_TRACK";
    completedStepsCount = (i % 3) + 4;
    mentorStatus = "GREEN";
  }

  const challenge = isUnselected ? null : OUTSKILL_CHALLENGES[(i * 3) % OUTSKILL_CHALLENGES.length];
  const challengeTitle = challenge ? challenge.title : "Unselected (Under Deliberation)";

  // Generate 7 or 8 Members
  const memberCount = (i % 3 === 0) ? 8 : 7;
  const squadMembers = [];

  for (let m = 0; m < memberCount; m++) {
    const fName = FIRST_NAMES[(i * 5 + m * 3) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 7 + m * 2) % LAST_NAMES.length];
    const fullName = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@outskill.com`;
    const skills = `${SKILLS_POOL[(i + m) % SKILLS_POOL.length]}; ${SKILLS_POOL[(i + m + 3) % SKILLS_POOL.length]}`;
    const isLeader = m === 0;

    // Rule BR-03 Demonstration: Assigning roles (Max 2 per member)
    // Member 0: Prompt & PRD Writer
    // Member 1: Builder AND Submitter (Holds exactly 2 roles - Rule BR-03 verified!)
    // Member 2: Tester
    // Member 3: Deck & Loom
    // Member 4..7: Collaborators
    let assignedRoles = [];
    if (m === 0) assignedRoles.push("Prompt & PRD Writer");
    if (m === 1) {
      assignedRoles.push("Builder");
      assignedRoles.push("Submitter"); // 2 roles!
    }
    if (m === 2) assignedRoles.push("Tester");
    if (m === 3) assignedRoles.push("Deck & Loom");

    squadMembers.push({
      id: `p-${teamId}-${m + 1}`,
      fullName,
      email,
      skills,
      isLeader,
      assignedRoles
    });
  }

  // Generate 7 Workflow Tasks for this team
  let teamActualHours = 0;
  let teamOverrunHours = 0;
  const teamTasks = DEFAULT_WORKFLOW_STEPS.map((step, idx) => {
    const isDone = idx < completedStepsCount;
    const isInProgress = idx === completedStepsCount;
    const planned = step.hours;
    let actual = 0;
    let stepOverrun = 0;
    let status = "NOT_STARTED";
    let blockerText = "";

    if (isDone) {
      status = "COMPLETED";
      stepOverrun = (hasOverrun && (idx === 3 || idx === 4)) ? (idx === 3 ? 1.5 : 1.0) : 0;
      actual = planned + stepOverrun;
      teamOverrunHours += stepOverrun;
    } else if (isInProgress) {
      if (isBlocked && idx === completedStepsCount) {
        status = "BLOCKED";
        actual = 2.0;
        blockerText = BLOCKER_REASONS[(i + idx) % BLOCKER_REASONS.length];
      } else {
        status = "IN_PROGRESS";
        actual = 1.5;
      }
    }

    teamActualHours += actual;
    const owner = squadMembers[idx % squadMembers.length];
    const isCritical = idx === 0 || idx === 3 || idx === 6;
    const evidenceUrl = isDone ? `https://github.com/outskill-hackathon/${teamId.toLowerCase()}-step-${step.stepNumber}` : "";
    const progressNote = isDone 
      ? `Successfully executed milestone ${step.stepNumber}: ${step.title}.`
      : status === "BLOCKED"
      ? `Task impeded: ${blockerText}. Mentor review requested.`
      : status === "IN_PROGRESS"
      ? `Active engineering in progress. Planned duration ${planned}h.`
      : "Milestone queued on timeline.";

    // Append to Tasks CSV
    tasksRows.push([
      `"${teamId}"`,
      `"task-${teamId}-${step.stepNumber}"`,
      step.stepNumber,
      `"${step.title}"`,
      `"${step.role}"`,
      `"${owner.fullName}"`,
      `"${owner.id}"`,
      status,
      isCritical ? "YES" : "NO",
      planned,
      actual.toFixed(1),
      stepOverrun.toFixed(1),
      `"${blockerText}"`,
      `"${progressNote}"`,
      `"${evidenceUrl}"`,
      `"${scenarioType}"`
    ].join(','));

    return {
      stepNumber: step.stepNumber,
      title: step.title,
      role: step.role,
      owner,
      status,
      planned,
      actual,
      stepOverrun,
      isCritical,
      evidenceUrl
    };
  });

  const scheduleHealth = (completedStepsCount < 3 || isBlocked || teamOverrunHours > 3.0) ? "BEHIND" : "ON_TRACK";
  const judgeScore = isSubmitted ? (8.5 + ((i % 10) * 0.12)).toFixed(2) : "N/A";
  const demoLiveUrl = isSubmitted ? `https://${teamId.toLowerCase()}-mvp.lovable.app` : "";
  const demoLoomUrl = isSubmitted ? `https://loom.com/share/${teamId.toLowerCase()}-demo` : "";

  // Append to Teams Summary CSV
  teamsSummaryRows.push([
    `"${teamId}"`,
    `"${teamName}"`,
    `"${challengeTitle}"`,
    `"${scenarioType}"`,
    memberCount,
    `"${squadMembers[0].fullName}"`,
    `${completedStepsCount}/7`,
    `${Math.round((completedStepsCount / 7) * 100)}%`,
    `"${completedStepsCount}/7"`,
    21.0,
    teamActualHours.toFixed(1),
    teamOverrunHours.toFixed(1),
    scheduleHealth,
    mentorStatus,
    isSubmitted ? "YES" : "NO",
    `"${demoLiveUrl}"`,
    `"${demoLoomUrl}"`,
    judgeScore
  ].join(','));

  // Append each individual member to Members Roster CSV
  squadMembers.forEach((member, mIdx) => {
    const ownedTasks = teamTasks.filter(t => t.owner.id === member.id);
    const completedTasks = ownedTasks.filter(t => t.status === "COMPLETED");
    const memberPlannedHours = ownedTasks.reduce((s, t) => s + t.planned, 0);
    const memberActualHours = ownedTasks.reduce((s, t) => s + t.actual, 0);
    const memberOverrun = Math.max(0, memberActualHours - memberPlannedHours);
    const evidenceCount = ownedTasks.filter(t => !!t.evidenceUrl).length;

    // Idea details
    const authoredIdeaTitle = (mIdx === 0 || mIdx === 1) 
      ? `${teamName} Core Concept v1` 
      : (mIdx === 2 ? `${teamName} Alternative Flow v1` : "N/A");
    const aiAssistedFlag = (mIdx % 2 === 0);

    // Commitment details
    const commitmentPromised = mIdx === 0 
      ? "PRD & System Prompts" 
      : mIdx === 1 
      ? "React UI & AI Gateway" 
      : mIdx === 2 
      ? "E2E Test Matrix" 
      : "Loom Video & Presentation Deck";
    const commitmentStatus = completedTasks.length > 0 ? "DELIVERED" : (mIdx < 4 ? "IN_PROGRESS" : "COMMITTED");

    const contributionHealth = (memberOverrun > 2.0) ? "OVERRUN_OBSERVED" : (completedTasks.length > 0 ? "EXEMPLARY" : "ON_SCHEDULE");

    membersRows.push([
      `"${member.id}"`,
      `"${teamId}"`,
      `"${teamName}"`,
      `"${member.fullName}"`,
      `"${member.email}"`,
      member.isLeader ? "Team Leader" : "Member",
      `"${member.assignedRoles.length > 0 ? member.assignedRoles.join(' & ') : 'Collaborator'}"`,
      member.assignedRoles.length,
      `"${member.skills}"`,
      (authoredIdeaTitle !== "N/A") ? 1 : 0,
      `"${authoredIdeaTitle}"`,
      aiAssistedFlag ? "YES" : "NO",
      `"${commitmentPromised}"`,
      commitmentStatus,
      ownedTasks.length,
      completedTasks.length,
      memberPlannedHours,
      memberActualHours.toFixed(1),
      memberOverrun.toFixed(1),
      evidenceCount,
      contributionHealth
    ].join(','));
  });
}

// Write the 3 Comprehensive CSV Files
const baseDir = path.resolve('D:/007_OUTSKILL/CampaignIQ_MVP_SRS/src/data');

const teamsMatrixPath = path.join(baseDir, 'hackathon_teams_scenarios_matrix.csv');
fs.writeFileSync(teamsMatrixPath, teamsSummaryRows.join('\n'), 'utf-8');
console.log(`Saved 50-team scenario matrix to: ${teamsMatrixPath}`);

const membersRosterPath = path.join(baseDir, 'hackathon_members_complete_roster.csv');
fs.writeFileSync(membersRosterPath, membersRows.join('\n'), 'utf-8');
console.log(`Saved 365-member roster table to: ${membersRosterPath}`);

const tasksMatrixPath = path.join(baseDir, 'hackathon_tasks_execution_matrix.csv');
fs.writeFileSync(tasksMatrixPath, tasksRows.join('\n'), 'utf-8');
console.log(`Saved 350-task execution matrix to: ${tasksMatrixPath}`);

// Also update the original hackathon_teams_matrix.csv with this enhanced content
const origPath = path.join(baseDir, 'hackathon_teams_matrix.csv');
fs.writeFileSync(origPath, teamsSummaryRows.join('\n'), 'utf-8');
console.log(`Updated original hackathon_teams_matrix.csv`);

