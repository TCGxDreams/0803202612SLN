-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create specific tables
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  bio text,
  avatar_url text, -- We will store the Google Drive link here
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  url text not null,
  icon_name text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.links enable row level security;

-- Policies for public reading
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Public links are viewable by everyone."
  on links for select
  using ( true );

-- Policies for logged-in users modifying their own profile
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Policies for logged-in users modifying their own links
create policy "Users can insert their own links."
  on links for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own links."
  on links for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own links."
  on links for delete
  using ( auth.uid() = user_id );

-- Function to handle new user signup and create a profile automatically
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, bio, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', 'My new Linktree clone!', '');
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
