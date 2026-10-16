alter table public.company_profile
  add column if not exists logo_url text not null default '';

alter table public.company_profile
  add column if not exists sales_departments jsonb not null default '[]'::jsonb;

drop policy if exists company_admin_all on public.company_profile;
create policy company_admin_all
on public.company_profile
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
