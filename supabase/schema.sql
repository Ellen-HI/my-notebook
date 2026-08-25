-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.notes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  day date,
  line integer,
  text text DEFAULT ''::text,
  CONSTRAINT notes_pkey PRIMARY KEY (id)
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX notes_user_day_line_unique ON public.notes USING btree (user_id, day, line);
create policy "Users can create their own notes"
on "public"."notes"
as permissive
for insert
to authenticated
with check (
  (auth.uid() = user_id)
);

create policy "Users can delete their own notes"
on "public"."notes"
as permissive
for delete
to authenticated
using (
  (auth.uid() = user_id)
);

create policy "Users can read their own notes"
on "public"."notes"
as permissive
for select
to authenticated
using (
  (auth.uid() = user_id)
);

create policy "Users can update their own notes"
on "public"."notes"
as permissive
for update
to authenticated
using (
  (auth.uid() = user_id)
) with check (
  (auth.uid() = user_id)
);

create policy "Users can view their own notes"
on "public"."notes"
as permissive
for select
to authenticated
using (
  (auth.uid() = user_id)
);

