
-- 1. Create the submissions table (files if not exists)
-- Added user_id for persistent identity
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid not null,
  user_name text not null,
  user_team text not null,
  peer_name text not null,
  peer_college text not null,
  photo_url text not null,
  is_valid boolean default true
);

-- Safely add user_id column if it was missing from an earlier version of the table
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'submissions' and column_name = 'user_id') then
    alter table public.submissions add column user_id uuid default gen_random_uuid() not null;
  end if;
end $$;

-- Enable Row Level Security (RLS)
alter table public.submissions enable row level security;

-- 2. POLICIES FOR 'submissions' TABLE
-- Drop existing policies first to re-run safely
drop policy if exists "Enable read access for all users" on public.submissions;
create policy "Enable read access for all users"
on public.submissions for select
to public
using (true);

drop policy if exists "Enable insert access for all users" on public.submissions;
create policy "Enable insert access for all users"
on public.submissions for insert
to public
with check (true);

drop policy if exists "Enable delete access for all users" on public.submissions;
create policy "Enable delete access for all users"
on public.submissions for delete
to public
using (true);

-- 3. STORAGE SETUP
-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- 4. POLICIES FOR STORAGE (Fixes 400 RLS error)
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'photos' );

drop policy if exists "Public Upload" on storage.objects;
create policy "Public Upload"
on storage.objects for insert
to public
with check ( bucket_id = 'photos' );

drop policy if exists "Public Update" on storage.objects;
create policy "Public Update"
on storage.objects for update
to public
using ( bucket_id = 'photos' );

-- USEFUL COMMANDS (Run these manually when needed)
-- Clear all data:
-- TRUNCATE TABLE public.submissions;
