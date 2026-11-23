create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 100),
  birth_date date not null,
  lucky_number integer not null check (lucky_number between 1 and 99),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_name text;
  profile_birth_date date;
begin
  profile_name := left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 100);

  if profile_name = '' then
    raise exception 'A name is required to create a profile';
  end if;

  profile_birth_date := (new.raw_user_meta_data ->> 'birth_date')::date;
  if profile_birth_date is null or profile_birth_date > current_date then
    raise exception 'A valid birth date is required to create a profile';
  end if;

  insert into public.profiles (user_id, full_name, birth_date, lucky_number)
  values (new.id, profile_name, profile_birth_date, floor(random() * 99)::integer + 1);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;

create or replace function public.get_or_create_my_profile()
returns setof public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  auth_user auth.users%rowtype;
  profile public.profiles%rowtype;
  profile_name text;
  profile_birth_date date;
begin
  if current_user_id is null then
    raise exception 'Sign in is required to load a profile';
  end if;

  select p.* into profile
  from public.profiles as p
  where p.user_id = current_user_id;

  if found then
    return next profile;
    return;
  end if;

  select u.* into auth_user
  from auth.users as u
  where u.id = current_user_id;

  if not found then
    raise exception 'The signed-in account could not be found';
  end if;

  profile_name := left(trim(coalesce(
    auth_user.raw_user_meta_data ->> 'full_name',
    split_part(coalesce(auth_user.email, ''), '@', 1)
  )), 100);
  profile_birth_date := nullif(auth_user.raw_user_meta_data ->> 'birth_date', '')::date;

  if profile_name = '' or profile_birth_date is null or profile_birth_date > current_date then
    raise exception 'Profile details are missing; register with a name and date of birth';
  end if;

  insert into public.profiles (user_id, full_name, birth_date, lucky_number)
  values (current_user_id, profile_name, profile_birth_date, floor(random() * 99)::integer + 1)
  on conflict (user_id) do nothing;

  select p.* into profile
  from public.profiles as p
  where p.user_id = current_user_id;

  return next profile;
end;
$$;

revoke all on function public.get_or_create_my_profile() from public, anon, authenticated;
grant execute on function public.get_or_create_my_profile() to authenticated;
