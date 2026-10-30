-- ====================================================================
-- CampaignIQ — AI Hackathon Manager
-- Database Schema, Constraints, Triggers & Row-Level Security (RLS)
-- Version 1.0 (PostgreSQL / Supabase Migration)
-- ====================================================================

-- 1. Enable UUID Extension
create extension if not exists "pgcrypto";

-- 2. Tenant Root & Profiles
create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  time_zone text not null default 'UTC',
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists user_profiles (
  id uuid primary key, -- corresponds to auth.users.id
  display_name text not null,
  email text unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists organisation_memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references user_profiles(id) on delete cascade,
  role text not null check (role in ('ORG_OWNER', 'ORG_ADMIN', 'PROGRAMME_ADMIN', 'MENTOR', 'STUDENT', 'JUDGE')),
  status text not null default 'ACTIVE',
  unique (organisation_id, user_id)
);

-- 3. Programmes & Events
create table if not exists programmes (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'ACTIVE',
  created_by uuid references user_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  programme_id uuid references programmes(id),
  name text not null,
  event_code text,
  time_zone text not null default 'Asia/Kolkata',
  starts_at timestamptz not null,
  event_ends_at timestamptz not null,
  submission_deadline_at timestamptz not null,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  min_team_size int default 7,
  max_team_size int default 8,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  check (event_ends_at > starts_at),
  check (submission_deadline_at >= starts_at)
);

-- 4. Challenges Catalogue
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  title text not null,
  problem_statement text,
  intended_user text,
  expected_outcome text,
  ai_component text,
  complexity text check (complexity in ('Low', 'Medium', 'High', 'Low-Medium')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists event_challenges (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  challenge_id uuid not null references challenges(id) on delete cascade,
  sort_order int not null default 0,
  unique (event_id, challenge_id)
);

-- 5. Participants & Teams
create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid references user_profiles(id),
  full_name text not null,
  email text,
  skills text[],
  interests text[],
  experience_level text,
  status text not null default 'REGISTERED',
  unique (event_id, email)
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  team_code text not null, -- e.g. G1, G2, G39
  name text,
  leader_participant_id uuid references participants(id),
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  unique (event_id, team_code)
);

create table if not exists team_memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (team_id, participant_id)
);

-- 6. Event Roles & The 2-Role Limit Enforcement (Rule BR-03 / FR-009)
create table if not exists event_roles (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  role_name text not null,
  description text,
  sort_order int not null default 0,
  unique (event_id, role_name)
);

create table if not exists team_role_assignments (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  event_role_id uuid not null references event_roles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references user_profiles(id),
  unique (team_id, participant_id, event_role_id)
);

-- Server-side Trigger to strictly reject a 3rd role assignment (BR-03 / AC-05)
create or replace function check_max_two_roles_per_member()
returns trigger as $$
declare
  role_count int;
begin
  select count(*) into role_count
  from team_role_assignments
  where team_id = NEW.team_id
    and participant_id = NEW.participant_id;

  if role_count >= 2 then
    raise exception 'Rule BR-03 Violation: Participant % already holds 2 active roles in team %',
      NEW.participant_id, NEW.team_id;
  end if;

  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_enforce_max_roles on team_role_assignments;
create trigger trg_enforce_max_roles
before insert on team_role_assignments
for each row execute function check_max_two_roles_per_member();

-- 7. 7-Step Workflow Sequence
create table if not exists event_workflow_steps (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  step_number int not null check (step_number between 1 and 7),
  title text not null,
  description text,
  default_planned_hours numeric(6,2) not null default 3.0,
  default_role_id uuid references event_roles(id),
  sort_order int not null,
  unique (event_id, step_number)
);

-- 8. Ideas & Version Snapshots (Immutable Student Work - BR-08)
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  event_challenge_id uuid references event_challenges(id),
  title text not null,
  problem text,
  proposed_solution text,
  expected_contribution text,
  ai_assisted boolean not null default false,
  submitted_at timestamptz not null default now(),
  current_version int not null default 1
);

create table if not exists idea_versions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  idea_id uuid not null references ideas(id) on delete cascade,
  version_number int not null,
  snapshot jsonb not null,
  created_by uuid references user_profiles(id),
  created_at timestamptz not null default now(),
  unique (idea_id, version_number)
);

create table if not exists team_idea_selections (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  event_challenge_id uuid not null references event_challenges(id),
  selected_idea_id uuid references ideas(id),
  selected_by uuid references user_profiles(id),
  selected_at timestamptz not null default now(),
  unique (team_id)
);

-- 9. Commitments & Tasks
create table if not exists commitments (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  idea_id uuid references ideas(id),
  title text not null,
  deliverable_description text,
  planned_hours numeric(6,2) not null default 0,
  due_at timestamptz,
  status text not null default 'COMMITTED',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  workflow_step_id uuid references event_workflow_steps(id),
  event_role_id uuid references event_roles(id),
  title text not null,
  description text,
  primary_owner_participant_id uuid references participants(id),
  planned_start_at timestamptz,
  planned_end_at timestamptz,
  planned_hours numeric(6,2) not null default 3.0,
  actual_hours numeric(6,2) not null default 0.0,
  status text not null default 'NOT_STARTED' check (status in ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
  is_critical boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists task_assignees (
  task_id uuid not null references tasks(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  assignment_type text not null default 'COLLABORATOR',
  primary key (task_id, participant_id)
);

create table if not exists task_updates (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  task_id uuid not null references tasks(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  status text,
  hours_delta numeric(6,2) default 0,
  progress_note text,
  blocker text,
  evidence_url text,
  created_at timestamptz not null default now()
);

-- 10. Deliverables & Evidence
create table if not exists deliverables (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  task_id uuid references tasks(id),
  commitment_id uuid references commitments(id),
  participant_id uuid references participants(id),
  title text not null,
  description text,
  evidence_url text,
  submitted_at timestamptz not null default now()
);

-- 11. Mentor Reviews
create table if not exists mentor_assignments (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  mentor_user_id uuid not null references user_profiles(id),
  unique (team_id, mentor_user_id)
);

create table if not exists mentor_reviews (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  mentor_user_id uuid not null references user_profiles(id),
  checkpoint text not null,
  status text not null check (status in ('GREEN', 'AMBER', 'RED')),
  feedback text not null,
  reviewed_at timestamptz not null default now()
);

-- 12. Demo Submissions & Judging
create table if not exists demo_submissions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  product_name text not null,
  description text,
  live_url text not null,
  loom_url text not null,
  deck_url text not null,
  repository_url text,
  access_instructions text,
  submitted_by uuid references user_profiles(id),
  submitted_at timestamptz not null default now(),
  status text not null default 'SUBMITTED',
  unique (event_id, team_id) -- Enforces 1 active final demo per team per event (Rule BR-15)
);

create table if not exists judging_criteria (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  description text,
  max_score numeric(6,2) not null default 10,
  weight numeric(6,2) not null default 1.0,
  sort_order int not null default 0
);

create table if not exists judging_scores (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  demo_submission_id uuid not null references demo_submissions(id) on delete cascade,
  criterion_id uuid not null references judging_criteria(id) on delete cascade,
  judge_user_id uuid not null references user_profiles(id),
  score numeric(6,2) not null check (score between 0 and 10),
  feedback text,
  created_at timestamptz not null default now(),
  unique (demo_submission_id, criterion_id, judge_user_id)
);

-- 13. Audit Trail
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  actor_user_id uuid references user_profiles(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

-- 14. Performance Indexes
create index if not exists idx_events_org on events(organisation_id, status, submission_deadline_at);
create index if not exists idx_teams_event on teams(event_id, team_code);
create index if not exists idx_tasks_team on tasks(team_id, status);
create index if not exists idx_ideas_event on ideas(event_id, team_id, submitted_at);
create index if not exists idx_task_updates on task_updates(task_id, created_at);
create index if not exists idx_audit_logs on audit_logs(organisation_id, entity_type, entity_id, created_at);

-- 15. Tenant Isolation via Row-Level Security (RLS)
alter table organisations enable row level security;
alter table programmes enable row level security;
alter table events enable row level security;
alter table challenges enable row level security;
alter table teams enable row level security;
alter table tasks enable row level security;
alter table ideas enable row level security;
alter table demo_submissions enable row level security;

-- Base RLS Policy: Users may only access records within organisations they belong to
create policy tenant_isolation_policy on organisations
  for all using (
    id in (
      select organisation_id from organisation_memberships
      where user_id = auth.uid() and status = 'ACTIVE'
    )
  );

create policy tenant_teams_policy on teams
  for select using (
    organisation_id in (
      select organisation_id from organisation_memberships
      where user_id = auth.uid() and status = 'ACTIVE'
    )
  );

