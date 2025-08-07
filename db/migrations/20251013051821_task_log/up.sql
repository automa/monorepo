ALTER TABLE public.tasks
ADD COLUMN log JSONB NOT NULL DEFAULT '[]',
ADD CONSTRAINT task_log_array CHECK (jsonb_typeof(log) = 'array');
