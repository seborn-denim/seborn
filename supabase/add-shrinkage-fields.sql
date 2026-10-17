alter table public.products
  add column if not exists reference_length_shrinkage text not null default '';

alter table public.products
  add column if not exists reference_width_shrinkage text not null default '';
