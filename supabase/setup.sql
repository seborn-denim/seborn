create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  category_id uuid references public.categories(id),
  color text not null default '',
  weave text not null default '',
  composition text not null default '',
  width text not null default '',
  weight text not null default '',
  reference_length_shrinkage text not null default '',
  reference_width_shrinkage text not null default '',
  location text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  sort integer not null default 0,
  fabric_class text not null default 'fabric-indigo',
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists reference_length_shrinkage text not null default '';
alter table public.products
  add column if not exists reference_width_shrinkage text not null default '';

create table if not exists public.company_profile (
  id text primary key default 'company_profile',
  name text not null default '',
  address text not null default '',
  phone text not null default '',
  logo_url text not null default '',
  sales_departments jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.company_profile
  add column if not exists logo_url text not null default '';
alter table public.company_profile
  add column if not exists sales_departments jsonb not null default '[]'::jsonb;

create index if not exists products_status_sort_idx
  on public.products (status, sort, updated_at desc);

create index if not exists products_category_status_idx
  on public.products (category_id, status, sort);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    auth.uid() is not null
    and coalesce(auth.jwt() ->> 'email', '') = '3034642030@qq.com';
$$;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.company_profile enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.company_profile
  to anon, authenticated;
grant insert, update, delete
  on public.categories, public.products, public.company_profile
  to authenticated;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read
on public.categories
for select
to anon, authenticated
using (enabled = true or public.is_admin());

drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists products_public_read on public.products;
create policy products_public_read
on public.products
for select
to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists products_admin_all on public.products;
create policy products_admin_all
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists company_public_read on public.company_profile;
create policy company_public_read
on public.company_profile
for select
to anon, authenticated
using (true);

drop policy if exists company_admin_all on public.company_profile;
create policy company_admin_all
on public.company_profile
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit)
values ('product-images', 'product-images', true, 8388608)
on conflict (id) do update
set public = true,
    file_size_limit = 8388608;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists product_images_admin_insert on storage.objects;
create policy product_images_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

drop policy if exists product_images_admin_update on storage.objects;
create policy product_images_admin_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
)
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

drop policy if exists product_images_admin_delete on storage.objects;
create policy product_images_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
);

insert into public.categories (name, sort, enabled)
values
  ('经典靛蓝', 1, true),
  ('原色牛仔', 2, true),
  ('弹力牛仔', 3, true),
  ('黑色牛仔', 4, true),
  ('彩色牛仔', 5, true)
on conflict (name) do update
set sort = excluded.sort,
    enabled = excluded.enabled;

insert into public.products (
  name,
  code,
  category_id,
  color,
  weave,
  composition,
  width,
  weight,
  location,
  status,
  sort,
  fabric_class,
  images
)
select
  seed.name,
  seed.code,
  categories.id,
  seed.color,
  seed.weave,
  seed.composition,
  seed.width,
  seed.weight,
  seed.location,
  'published',
  seed.sort,
  seed.fabric_class,
  '{}'::text[]
from (
  values
    ('12盎司右斜靛蓝牛仔', 'DN-1201', '经典靛蓝', '深靛蓝', '3/1 右斜', '98% 棉 2% 氨纶', '148 cm', '12 oz', 'A-01', 1, 'fabric-indigo'),
    ('轻磅浅蓝牛仔', 'DN-0826', '经典靛蓝', '浅蓝', '2/1 右斜', '100% 棉', '145 cm', '8 oz', 'A-02', 2, 'fabric-light'),
    ('无弹原色牛仔', 'DN-1403', '原色牛仔', '原色', '3/1 左斜', '100% 棉', '152 cm', '14 oz', 'B-01', 3, 'fabric-ecru'),
    ('高弹深色牛仔', 'DN-1008', '弹力牛仔', '藏青', '斜纹', '92% 棉 6% 涤纶 2% 氨纶', '150 cm', '10 oz', 'C-03', 4, 'fabric-deep'),
    ('黑经黑纬牛仔', 'DN-1105', '黑色牛仔', '黑色', '3/1 右斜', '99% 棉 1% 氨纶', '147 cm', '11 oz', 'D-01', 5, 'fabric-black'),
    ('复古棕斜纹牛仔', 'DN-0912', '彩色牛仔', '焦糖棕', '2/1 右斜', '100% 棉', '146 cm', '9 oz', 'D-02', 6, 'fabric-copper'),
    ('13盎司赤耳牛仔', 'DN-1305', '原色牛仔', '深原色', '3/1 右斜', '100% 棉', '150 cm', '13 oz', 'B-02', 7, 'fabric-indigo'),
    ('冰蓝弹力牛仔', 'DN-1016', '弹力牛仔', '冰蓝', '2/1 斜纹', '91% 棉 7% 涤纶 2% 氨纶', '149 cm', '10 oz', 'C-04', 8, 'fabric-light'),
    ('灰黑斜纹牛仔', 'DN-1218', '黑色牛仔', '灰黑', '3/1 左斜', '98% 棉 2% 氨纶', '148 cm', '12 oz', 'E-01', 9, 'fabric-black')
) as seed (
  name,
  code,
  category_name,
  color,
  weave,
  composition,
  width,
  weight,
  location,
  sort,
  fabric_class
)
join public.categories
  on categories.name = seed.category_name
on conflict (code) do update
set name = excluded.name,
    category_id = excluded.category_id,
    color = excluded.color,
    weave = excluded.weave,
    composition = excluded.composition,
    width = excluded.width,
    weight = excluded.weight,
    location = excluded.location,
    sort = excluded.sort,
    fabric_class = excluded.fabric_class;

insert into public.company_profile (
  id,
  name,
  address,
  phone,
  logo_url,
  sales_departments
)
values (
  'company_profile',
  '示例纺织有限公司',
  '广东省佛山市顺德区示例工业园区 8 号',
  '0757-88888888',
  '',
  '[]'::jsonb
)
on conflict (id) do nothing;

do $$
begin
  alter publication supabase_realtime add table public.products;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.categories;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.company_profile;
exception
  when duplicate_object then null;
end;
$$;
