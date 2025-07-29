ALTER TABLE public.bots
ADD COLUMN self_hostable_repo citext,
ADD COLUMN is_self_hostable BOOLEAN GENERATED ALWAYS AS (self_hostable_repo IS NOT NULL) STORED;

UPDATE public.bots
SET self_hostable_repo = 'https://github.com/automa/' || name
WHERE name IN ('package-badges', 'codex', 'claude-code', 'aider', 'gemini');
