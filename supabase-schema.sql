create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('entrepreneur', 'agency', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  business_name text not null,
  role public.user_role not null default 'agency',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_email text not null,
  business_name text not null,
  client_name text not null,
  client_industry text,
  service_offering text,
  budget text,
  currency text,
  timeline text,
  tone text,
  brief text,
  tagline text,
  phone text,
  website text,
  email text,
  logo text,
  client_website text,
  target_audience text,
  current_situation text,
  main_goal text,
  competitors text,
  urgency text default 'Consultative',
  language text default 'English',
  generated_content text not null,
  created_at timestamptz not null default now()
);

alter table public.proposals
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists tagline text,
  add column if not exists phone text,
  add column if not exists website text,
  add column if not exists email text,
  add column if not exists logo text,
  add column if not exists client_website text,
  add column if not exists target_audience text,
  add column if not exists current_situation text,
  add column if not exists main_goal text,
  add column if not exists competitors text,
  add column if not exists urgency text default 'Consultative',
  add column if not exists language text default 'English';

alter table public.profiles enable row level security;
alter table public.proposals enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role;
begin
  requested_role := case
    when new.raw_user_meta_data->>'role' in ('entrepreneur', 'agency')
      then (new.raw_user_meta_data->>'role')::public.user_role
    else 'agency'::public.user_role
  end;

  insert into public.profiles (id, email, name, business_name, role)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), 'Propel User'),
    coalesce(nullif(trim(new.raw_user_meta_data->>'business_name'), ''), 'New Business'),
    requested_role
  )
  on conflict (id) do update
    set email = excluded.email,
        name = excluded.name,
        business_name = excluded.business_name,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop policy if exists "Allow app user reads" on public.propel_users;
drop policy if exists "Allow app user inserts" on public.propel_users;
drop policy if exists "Allow app user updates" on public.propel_users;
drop policy if exists "Allow all" on public.proposals;
drop policy if exists "Profiles are self-readable" on public.profiles;
drop policy if exists "Profiles are self-editable" on public.profiles;
drop policy if exists "Admins can read profiles" on public.profiles;
drop policy if exists "Users can read their proposals" on public.proposals;
drop policy if exists "Users can create their proposals" on public.proposals;
drop policy if exists "Users can update their proposals" on public.proposals;
drop policy if exists "Users can delete their proposals" on public.proposals;
drop policy if exists "Admins can moderate proposals" on public.proposals;

create policy "Profiles are self-readable" on public.profiles
  for select
  using (id = auth.uid() or public.is_admin());

create policy "Profiles are self-editable" on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid() and role <> 'admin');

create policy "Admins can read profiles" on public.profiles
  for select
  using (public.is_admin());

create policy "Users can read their proposals" on public.proposals
  for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Users can create their proposals" on public.proposals
  for insert
  with check (user_id = auth.uid());

create policy "Users can update their proposals" on public.proposals
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their proposals" on public.proposals
  for delete
  using (user_id = auth.uid());

create policy "Admins can moderate proposals" on public.proposals
  for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

drop policy if exists "Admins can read activity logs" on public.activity_logs;
drop policy if exists "Users can create activity logs" on public.activity_logs;

create policy "Admins can read activity logs" on public.activity_logs
  for select
  using (public.is_admin());

create policy "Users can create activity logs" on public.activity_logs
  for insert
  with check (actor_id = auth.uid());

create index if not exists proposals_user_id_created_at_idx
  on public.proposals (user_id, created_at desc);

create index if not exists activity_logs_actor_id_created_at_idx
  on public.activity_logs (actor_id, created_at desc);

create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  owner uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  public boolean default false,
  avif_autodetection boolean default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('propel-public', 'propel-public', true, 2097152, array['image/png','image/jpeg','image/webp']),
  ('propel-private', 'propel-private', false, 10485760, array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
