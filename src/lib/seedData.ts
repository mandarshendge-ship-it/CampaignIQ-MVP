import { AppState, TeamData, Participant, TaskItem, OUTSKILL_CHALLENGES, SWIMLANE_ROLES, DEFAULT_WORKFLOW_STEPS } from "../types";
import generatedDummyTeams from "../data/hackathon_dummy_data.json";

export function getInitialSeedState(nowMs: number = Date.now()): AppState {
  // Submission deadline set 28 hours from now
  const submissionDeadline = new Date(nowMs + 28 * 3600 * 1000).toISOString();
  // 48-hour event window started 20 hours ago
  const startsAt = new Date(nowMs - 20 * 3600 * 1000).toISOString();
  // Event officially ends 2 hours before the portal submission buffer closes
  const eventEndsAt = new Date(nowMs + 26 * 3600 * 1000).toISOString();

  // Cast imported JSON into typed TeamData dictionary
  const teams: Record<string, TeamData> = (generatedDummyTeams as unknown) as Record<string, TeamData>;

  return {
    event: {
      id: "event-outskill-39",
      name: "Outskill AI Hackathon #39 (G39 IST Challenge)",
      organisationName: "Outskill AI Academy",
      timeZone: "Asia/Kolkata (IST, UTC+5:30)",
      startsAt,
      eventEndsAt,
      submissionDeadlineAt: submissionDeadline,
      minTeamSize: 7,
      maxTeamSize: 8,
      status: "ACTIVE"
    },
    currentRole: "STUDENT",
    currentUserId: "p-G39-2", // Elena Rostova (Builder)
    selectedTeamId: "G39",
    activeNavTab: "team",
    teams,
    auditTrail: [
      {
        id: "aud-1",
        action: "EVENT_CREATED",
        actor: "Admin (Outskill Academy)",
        timestamp: startsAt,
        details: "Created Outskill AI Hackathon #39 with 48h active duration and 2h submission buffer."
      },
      {
        id: "aud-2",
        action: "CHALLENGE_SELECTED",
        actor: "Dev Patel (G39 Leader)",
        timestamp: new Date(nowMs - 19 * 3600 * 1000).toISOString(),
        details: "Team G39 selected 'Resume-to-Interview Coach'."
      },
      {
        id: "aud-3",
        action: "TASK_OVERRUN_LOGGED",
        actor: "Elena Rostova (G39 Builder)",
        timestamp: new Date(nowMs - 6 * 3600 * 1000).toISOString(),
        details: "Logged 4.5h actual on Task 4 (planned 3.0h) due to PDF edge cases (+1.5h overrun)."
      },
      {
        id: "aud-4",
        action: "DEMO_SUBMITTED",
        actor: "Leader G1 (Aegis Health)",
        timestamp: new Date(nowMs - 2 * 3600 * 1000).toISOString(),
        details: "Team G1 locked and submitted official demo package for judging."
      }
    ]
  };
}
