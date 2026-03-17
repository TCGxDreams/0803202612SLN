-- Add username column to profiles if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema='public' and table_name='profiles' and column_name='username') then
    alter table public.profiles add column username text unique;
  end if;
end $$;

-- Update the trigger function to automatically assign a username based on email prefix
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  email_prefix text;
begin
  -- extract everything before the @ symbol
  email_prefix := split_part(new.email, '@', 1);
  
  insert into public.profiles (id, name, username, bio, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', email_prefix), 
    email_prefix, -- assigned unique username
    'My new Linktree clone!', 
    ''
  );
  return new;
exception when unique_violation then
  -- If the username generated from email is taken, fallback to their UUID
  insert into public.profiles (id, name, username, bio, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', email_prefix), 
    new.id::text, -- fallback to uuid
    'My new Linktree clone!', 
    ''
  );
  return new;
end;
$$;
