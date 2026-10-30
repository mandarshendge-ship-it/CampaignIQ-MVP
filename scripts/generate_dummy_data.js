// Realistic Dummy Data Generator for CampaignIQ AI Hackathon Manager
// Generates 50 complete teams with realistic students, ideas, tasks, progress notes, overruns, mentor reviews, and scores.

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

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const nowMs = Date.now();
const teams = {};
const csvRows = [];

// CSV Header
csvRows.push([
  "Team Code", "Team Name", "Selected Challenge", "Members Count", "Team Leader",
  "Workflow Steps Done (out of 7)", "Tasks Completed", "Planned Total Hours", "Actual Total Hours",
  "Time Overrun (Hours)", "Schedule Status", "Demo Submitted", "Demo Live URL", "Judge Weighted Score"
].join(','));

for (let i = 1; i <= 50; i++) {
  const teamId = `G${i}`;
  const teamName = TEAM_NAMES[i - 1] || `AI Squad ${teamId}`;
  const challenge = OUTSKILL_CHALLENGES[(i * 3) % OUTSKILL_CHALLENGES.length];

  // 7 to 8 Members
  const memberCount = (i % 3 === 0) ? 8 : 7;
  const members = [];
  for (let m = 0; m < memberCount; m++) {
    const fName = FIRST_NAMES[(i * 5 + m * 3) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 7 + m * 2) % LAST_NAMES.length];
    const fullName = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@outskill.com`;
    const skills = [randomChoice(SKILLS_POOL), randomChoice(SKILLS_POOL)];

    members.push({
      id: `p-${teamId}-${m + 1}`,
      fullName,
      email,
      skills,
      isLeader: m === 0
    });
  }

  // Realistic Progress distribution:
  // G39 is hero (Step 5 in progress, 4 done)
  let completedStepsCount;
  if (teamId === 'G39') {
    completedStepsCount = 4;
  } else if (i <= 8) {
    completedStepsCount = 7; // Finished and submitted
  } else if (i <= 25) {
    completedStepsCount = randomInt(4, 6); // On pace
  } else if (i <= 40) {
    completedStepsCount = randomInt(2, 3); // Behind pace
  } else {
    completedStepsCount = randomInt(0, 2); // Early stage
  }

  const isSubmitted = completedStepsCount === 7;
  let hasOverrun = (i % 2 === 0 || i === 39);
  let totalOverrunHours = 0;

  // 7 Workflow Tasks
  const tasks = DEFAULT_WORKFLOW_STEPS.map((step, idx) => {
    const isDone = idx < completedStepsCount;
    const isInProgress = idx === completedStepsCount;
    const planned = step.hours;
    let actual = 0;

    if (isDone) {
      const stepOverrun = (hasOverrun && (idx === 3 || idx === 4)) ? (idx === 3 ? 1.5 : 0.8) : 0;
      actual = planned + stepOverrun;
      totalOverrunHours += stepOverrun;
    } else if (isInProgress) {
      actual = 1.5;
    }

    const status = isDone ? 'COMPLETED' : isInProgress ? (i % 7 === 0 ? 'BLOCKED' : 'IN_PROGRESS') : 'NOT_STARTED';
    const owner = members[idx % members.length];

    const updates = [];
    if (isDone || isInProgress) {
      updates.push({
        id: `up-${teamId}-${step.stepNumber}`,
        taskId: `task-${teamId}-${step.stepNumber}`,
        participantId: owner.id,
        participantName: owner.fullName,
        status,
        hoursDelta: actual,
        progressNote: isDone ? `Completed ${step.title}` : `Currently validating edge cases on ${step.title}`,
        evidenceUrl: isDone ? `https://github.com/outskill-hackathon/${teamId.toLowerCase()}-repo` : undefined,
        createdAt: new Date(nowMs - (20 - idx * 3) * 3600 * 1000).toISOString()
      });
    }

    return {
      id: `task-${teamId}-${step.stepNumber}`,
      workflowStep: step.stepNumber,
      title: step.title,
      description: `Execute milestone ${step.stepNumber} under Outskill G39 48h hackathon standard.`,
      role: step.role,
      primaryOwnerId: owner.id,
      primaryOwnerName: owner.fullName,
      plannedHours: planned,
      actualHours: actual,
      status,
      isCritical: idx === 0 || idx === 3 || idx === 6,
      plannedStartHour: idx * 3,
      plannedEndHour: (idx + 1) * 3,
      updates
    };
  });

  const plannedTotalHours = 21;
  const actualTotalHours = tasks.reduce((sum, t) => sum + t.actualHours, 0);
  const scheduleStatus = (completedStepsCount < 3 || totalOverrunHours > 3.0 || (i % 7 === 0)) ? 'BEHIND' : 'ON_TRACK';

  // Ideas & Commitments
  const ideas = [
    {
      id: `idea-${teamId}-1`,
      participantId: members[0].id,
      participantName: members[0].fullName,
      challengeId: challenge.id,
      title: `${teamName} Core Architecture`,
      problem: `Target persona struggle identified under ${challenge.title}.`,
      proposedSolution: `Agentic autonomous workflow with structured JSON response schema.`,
      expectedContribution: "System design, PRD writing, and end-to-end integration.",
      aiAssisted: true,
      submittedAt: new Date(nowMs - 19 * 3600 * 1000).toISOString(),
      version: 1
    }
  ];

  const commitments = [
    {
      id: `com-${teamId}-1`,
      participantId: members[0].id,
      participantName: members[0].fullName,
      title: "PRD & System Prompts",
      deliverableDescription: "Full markdown specification and structured OpenAI API prompts.",
      plannedHours: 4,
      targetDueAt: new Date(nowMs - 10 * 3600 * 1000).toISOString(),
      status: "DELIVERED",
      evidenceUrl: `https://docs.google.com/document/d/${teamId.toLowerCase()}-prd`,
      createdAt: new Date(nowMs - 19 * 3600 * 1000).toISOString()
    },
    {
      id: `com-${teamId}-2`,
      participantId: members[1].id,
      participantName: members[1].fullName,
      title: "Vite + React UI Client & AI Endpoint",
      deliverableDescription: "Working interactive frontend interface.",
      plannedHours: 6,
      targetDueAt: new Date(nowMs + 4 * 3600 * 1000).toISOString(),
      status: isSubmitted ? "DELIVERED" : "IN_PROGRESS",
      createdAt: new Date(nowMs - 19 * 3600 * 1000).toISOString()
    }
  ];

  // Demo Submission
  const submission = {
    productName: `${teamName} MVP`,
    tagline: `Intelligent ${challenge.category} solution for Outskill G39 Hackathon`,
    liveUrl: `https://${teamId.toLowerCase()}-demo.lovable.app`,
    loomUrl: `https://loom.com/share/${teamId.toLowerCase()}-walkthrough`,
    deckUrl: `https://pitch.com/${teamId.toLowerCase()}-slides`,
    repoUrl: `https://github.com/outskill-hackathon/${teamId.toLowerCase()}-source`,
    accessInstructions: "Demo credentials pre-loaded on login screen.",
    submittedBy: members[1].fullName,
    submittedAt: isSubmitted ? new Date(nowMs - 2 * 3600 * 1000).toISOString() : "",
    isSubmitted
  };

  // Judging Scores
  const judgingScores = isSubmitted ? [
    {
      judgeName: (i % 2 === 0) ? "Alex Rivera (Senior AI Judge)" : "Dr. Marcus Vance",
      criteriaScores: {
        problemInnovation: randomInt(8, 10),
        technicalExecution: randomInt(8, 10),
        aiIntegration: randomInt(8, 10),
        presentationDemo: randomInt(8, 10),
        completeness: randomInt(8, 10)
      },
      feedback: "High execution velocity, verified prompts, and clear product market fit demonstration.",
      scoredAt: new Date(nowMs - 1 * 3600 * 1000).toISOString()
    }
  ] : [];

  const judgeScoreVal = judgingScores.length > 0 ? (
    (judgingScores[0].criteriaScores.problemInnovation * 0.25) +
    (judgingScores[0].criteriaScores.technicalExecution * 0.25) +
    (judgingScores[0].criteriaScores.aiIntegration * 0.20) +
    (judgingScores[0].criteriaScores.presentationDemo * 0.15) +
    (judgingScores[0].criteriaScores.completeness * 0.15)
  ).toFixed(2) : "N/A";

  teams[teamId] = {
    id: teamId,
    name: teamName,
    leaderId: members[0].id,
    members,
    roleAssignments: {
      "Builder": [members[1].id],
      "Prompt & PRD Writer": [members[0].id],
      "Tester": [members[2].id],
      "Deck & Loom": [members[3].id],
      "Submitter": [members[1].id] // Allowed: holds 2 roles under Rule BR-03
    },
    selectedChallengeId: challenge.id,
    selectedChallengeTimestamp: new Date(nowMs - 18 * 3600 * 1000).toISOString(),
    selectedBy: members[0].fullName,
    ideas,
    commitments,
    tasks,
    mentorReviews: (i % 3 === 0) ? [
      {
        id: `rev-${teamId}-1`,
        mentorName: "Dr. Sarah Chen (Lead Mentor)",
        checkpoint: "Checkpoint 1: Scoping & Architecture",
        status: scheduleStatus === 'BEHIND' ? "AMBER" : "GREEN",
        feedback: scheduleStatus === 'BEHIND' ? "Scope creep flagged on secondary features. Prune to 1 main flow." : "Clean PRD and realistic execution pacing.",
        reviewedAt: new Date(nowMs - 8 * 3600 * 1000).toISOString()
      }
    ] : [],
    submission,
    judgingScores,
    sample: true
  };

  // Add CSV Row
  csvRows.push([
    `"${teamId}"`,
    `"${teamName}"`,
    `"${challenge.title}"`,
    memberCount,
    `"${members[0].fullName}"`,
    completedStepsCount,
    `${completedStepsCount}/7`,
    plannedTotalHours,
    actualTotalHours.toFixed(1),
    totalOverrunHours.toFixed(1),
    scheduleStatus,
    isSubmitted ? "YES" : "NO",
    `"${submission.liveUrl}"`,
    judgeScoreVal
  ].join(','));
}

// Write JSON Dummy Data
const jsonPath = path.resolve('D:/007_OUTSKILL/CampaignIQ_MVP_SRS/src/data/hackathon_dummy_data.json');
fs.writeFileSync(jsonPath, JSON.stringify(teams, null, 2), 'utf-8');
console.log(`Saved JSON dummy table to: ${jsonPath}`);

// Write CSV Matrix
const csvPath = path.resolve('D:/007_OUTSKILL/CampaignIQ_MVP_SRS/src/data/hackathon_teams_matrix.csv');
fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf-8');
console.log(`Saved CSV dummy matrix table to: ${csvPath}`);

