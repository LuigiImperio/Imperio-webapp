create extension if not exists pgcrypto;

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  service_type text not null,
  status text not null default 'uj',
  admin_note text null,
  full_name text not null,
  phone text not null,
  email text not null,
  city text not null,
  property_type text not null,
  property_area text not null,
  current_boiler_type text not null,
  boiler_status text not null,
  replacement_reason text not null,
  message text null,
  form_data_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.service_requests
  add column if not exists status text;

alter table public.service_requests
  add column if not exists admin_note text;

update public.service_requests
set status = 'uj'
where status is null;

alter table public.service_requests
  alter column status set default 'uj';

alter table public.service_requests
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'service_requests_status_check'
      and conrelid = 'public.service_requests'::regclass
  ) then
    alter table public.service_requests
      add constraint service_requests_status_check
      check (status in ('uj', 'folyamatban', 'kapcsolat_felveve', 'lezarva'));
  end if;
end
$$;

create table if not exists public.service_request_attachments (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  bucket_name text not null,
  storage_path text not null,
  file_name text not null,
  content_type text not null,
  file_size_bytes bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists service_request_attachments_service_request_id_idx
  on public.service_request_attachments(service_request_id);

alter table public.service_requests enable row level security;
alter table public.service_request_attachments enable row level security;

revoke all on public.service_requests from anon;
drop policy if exists "Anon can insert service requests" on public.service_requests;

revoke all on public.service_request_attachments from anon;
grant insert on public.service_request_attachments to anon;

drop policy if exists "Anon can insert service request attachments" on public.service_request_attachments;

create policy "Anon can insert service request attachments"
on public.service_request_attachments
for insert
to anon
with check (bucket_name = 'service-request-images');

insert into storage.buckets (id, name, public)
values ('service-request-images', 'service-request-images', false)
on conflict (id) do nothing;

drop policy if exists "Anon can upload service request images" on storage.objects;

create policy "Anon can upload service request images"
on storage.objects
for insert
to anon
with check (bucket_id = 'service-request-images');
