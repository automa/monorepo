INSERT INTO public.users (name, email)
VALUES
  ('John', 'john@example.com');

INSERT INTO public.user_providers (user_id, provider_type, provider_id, provider_email, refresh_token)
VALUES
  (1, 'github', '583231', 'john@example.com', 'refresh_token');

INSERT INTO public.user_orgs (user_id, org_id)
VALUES
  (1, 1);

INSERT INTO public.bots (org_id, name, type, webhook_url, homepage, published_at)
VALUES
  (1, 'code', 'webhook', 'http://localhost:5000/hooks/automa', 'https://code.automa.app', NOW()),
  (1, 'copywriting', 'webhook', 'http://localhost:5001/hooks/automa', 'https://copywriting.bot', NOW());

INSERT INTO public.bot_installations (bot_id, org_id)
VALUES
  (4, 1),
  (5, 1);

INSERT INTO public.tasks (org_id, title, created_by)
VALUES
  (1, 'Provision the cli repo', 1),
  (1, 'Update the homepage headline', 1);
