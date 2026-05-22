-- Freedom & Wilkinson Memory Atlas
-- Run this in the Supabase SQL Editor for your project.

create extension if not exists "pgcrypto";

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  place_name text not null,
  street text not null,
  description text not null,
  memory_year integer,
  building_type text,
  lng double precision not null,
  lat double precision not null,
  height integer not null default 36,
  footprint jsonb not null,
  image_url text,
  creator_token text,
  status text not null default 'approved' check (status in ('approved', 'pending', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.memories enable row level security;

drop policy if exists "Public can read approved memories" on public.memories;
create policy "Public can read approved memories"
on public.memories
for select
to anon
using (status = 'approved');

drop policy if exists "Public can submit approved memories" on public.memories;
create policy "Public can submit approved memories"
on public.memories
for insert
to anon
with check (status = 'approved');

-- For moderation instead of immediate publishing, change the default status to 'pending'
-- and update the insert policy to `with check (status = 'pending')`.

insert into storage.buckets (id, name, public)
values ('memory-images', 'memory-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view memory images" on storage.objects;
create policy "Public can view memory images"
on storage.objects
for select
to anon
using (bucket_id = 'memory-images');

drop policy if exists "Public can upload memory images" on storage.objects;
create policy "Public can upload memory images"
on storage.objects
for insert
to anon
with check (bucket_id = 'memory-images');

create or replace function public.delete_memory(
  p_memory_id uuid,
  p_creator_token text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.memories
  where id = p_memory_id
    and creator_token = p_creator_token;

  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

revoke all on function public.delete_memory(uuid, text) from public;
grant execute on function public.delete_memory(uuid, text) to anon, authenticated;
