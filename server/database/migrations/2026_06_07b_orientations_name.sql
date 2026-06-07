-- Migration: add a free-form `name` to orientations so a society can run
-- multiple rounds (e.g. "Auditions Round 1", "Recruitment Drive").
-- Nullable so previously seeded rows remain valid.

ALTER TABLE orientations
  ADD COLUMN IF NOT EXISTS name TEXT;
