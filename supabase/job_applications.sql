create extension if not exists pgcrypto;

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  motivation_text text not null,
  interest_area text null,
  note text null,
  cv_file_path text not null,
  cv_file_name text not null,
  cv_content_type text not null,
  cv_file_size_bytes bigint not null,
  status text not null default 'uj',
  created_at timestamptz not null default now()
);

alter table public.job_applications
  add column if not exists interest_area text;

alter table public.job_applications
  add column if not exists note text;

alter table public.job_applications
  add column if not exists cv_file_path text;

alter table public.job_applications
  add column if not exists cv_file_name text;

alter table public.job_applications
  add column if not exists cv_content_type text;

alter table public.job_applications
  add column if not exists cv_file_size_bytes bigint;

alter table public.job_applications
  add column if not exists status text;

update public.job_applications
set status = 'uj'
where status is null;

alter table public.job_applications
  alter column status set default 'uj';

alter table public.job_applications
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'job_applications_status_check'
      and conrelid = 'public.job_applications'::regclass
  ) then
    alter table public.job_applications
      add constraint job_applications_status_check
      check (status in ('uj', 'atnezve', 'kapcsolat_felveve', 'lezarva'));
  end if;
end
$$;

alter table public.job_applications enable row level security;

revoke all on public.job_applications from anon;
drop policy if exists "Anon can insert job applications" on public.job_applications;

insert into storage.buckets (id, name, public)
values ('job-application-files', 'job-application-files', false)
on conflict (id) do nothing;
