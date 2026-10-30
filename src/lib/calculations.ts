import { TaskItem, TeamData, SWIMLANE_ROLES, SwimlaneRole } from "../types";

export interface TeamMetrics {
  completedTasks: number;
  totalTasks: number;
  taskCompletionPercent: number;
  completedWorkflowSteps: number;
  totalWorkflowSteps: number;
  workflowCompletionPercent: number;
  plannedTotalHours: number;
  remainingPlannedHours: number;
  actualTotalHours: number;
  overrunHours: number;
  scheduleStatus: 'ON_TRACK' | 'BEHIND';
  scheduleReason: string;
}

export function calculateTaskOverrun(task: TaskItem): number {
  return Math.max(0, task.actualHours - task.plannedHours);
}

export function calculateTeamMetrics(team: TeamData, submissionDeadlineIso: string, nowMs: number): TeamMetrics {
  const totalTasks = team.tasks.length;
  const completedTasks = team.tasks.filter(t => t.status === 'COMPLETED').length;
  const taskCompletionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Workflow steps (1 through 7) are completed if their associated tasks are completed
  const stepMap = new Map<number, boolean>();
  for (let s = 1; s <= 7; s++) {
    const tasksInStep = team.tasks.filter(t => t.workflowStep === s);
    const allDone = tasksInStep.length > 0 && tasksInStep.every(t => t.status === 'COMPLETED');
    stepMap.set(s, allDone);
  }
  const completedWorkflowSteps = Array.from(stepMap.values()).filter(Boolean).length;
  const totalWorkflowSteps = 7;
  const workflowCompletionPercent = Math.round((completedWorkflowSteps / totalWorkflowSteps) * 100);

  const plannedTotalHours = team.tasks.reduce((sum, t) => sum + t.plannedHours, 0);
  const remainingPlannedHours = team.tasks
    .filter(t => t.status !== 'COMPLETED')
    .reduce((sum, t) => sum + t.plannedHours, 0);
  const actualTotalHours = team.tasks.reduce((sum, t) => sum + t.actualHours, 0);
  const overrunHours = team.tasks.reduce((sum, t) => sum + calculateTaskOverrun(t), 0);

  // Schedule status evaluation per BR-13:
  // Expected progress fraction across the 48-hour event window
  const deadlineMs = new Date(submissionDeadlineIso).getTime();
  const eventStartMs = deadlineMs - (48 * 3600 * 1000);
  const elapsedRatio = Math.min(1, Math.max(0, (nowMs - eventStartMs) / (48 * 3600 * 1000)));
  const expectedPlannedHoursDone = elapsedRatio * plannedTotalHours;
  const actualPlannedHoursDone = plannedTotalHours - remainingPlannedHours;

  let scheduleStatus: 'ON_TRACK' | 'BEHIND' = 'ON_TRACK';
  let scheduleReason = "Pace aligns with planned timeline.";

  const hasCriticalBlocker = team.tasks.some(t => t.status === 'BLOCKED' && t.isCritical);

  if (nowMs >= deadlineMs && completedWorkflowSteps < totalWorkflowSteps) {
    scheduleStatus = 'BEHIND';
    scheduleReason = "Submission deadline reached before all steps completed.";
  } else if (hasCriticalBlocker) {
    scheduleStatus = 'BEHIND';
    scheduleReason = "Critical milestone blocked by an active impediment.";
  } else if (actualPlannedHoursDone < expectedPlannedHoursDone - 3.0) {
    scheduleStatus = 'BEHIND';
    scheduleReason = `Completed effort (${actualPlannedHoursDone}h) trails expected pace (${expectedPlannedHoursDone.toFixed(1)}h) by > 3 hours.`;
  } else if (overrunHours > 4.0) {
    scheduleStatus = 'BEHIND';
    scheduleReason = `High cumulative task overrun (+${overrunHours.toFixed(1)}h over planned estimate).`;
  }

  return {
    completedTasks,
    totalTasks,
    taskCompletionPercent,
    completedWorkflowSteps,
    totalWorkflowSteps,
    workflowCompletionPercent,
    plannedTotalHours,
    remainingPlannedHours,
    actualTotalHours,
    overrunHours,
    scheduleStatus,
    scheduleReason
  };
}

/**
 * Validates the Outskill BR-03 rule: A member may hold a maximum of 2 active roles in the same team.
 */
export function canAssignRole(
  team: TeamData,
  participantId: string,
  targetRole: SwimlaneRole
): { allowed: boolean; reason?: string } {
  // Count how many roles this participant is currently assigned to
  let currentRoleCount = 0;
  for (const role of SWIMLANE_ROLES) {
    const assignees = team.roleAssignments[role] || [];
    if (assignees.includes(participantId)) {
      if (role === targetRole) {
        return { allowed: true }; // Already assigned to this role
      }
      currentRoleCount++;
    }
  }

  if (currentRoleCount >= 2) {
    return {
      allowed: false,
      reason: "Maximum role assignment limit reached. A team member may hold no more than 2 active roles (Outskill Rule BR-03)."
    };
  }

  return { allowed: true };
}

export function formatCountdown(targetIso: string, nowMs: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const diffMs = new Date(targetIso).getTime() - nowMs;
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isExpired: false };
}

