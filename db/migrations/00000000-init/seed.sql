INSERT INTO public.bots (org_id, name, type, homepage, published_at)
VALUES
  (1, 'basic', 'webhook', 'https://basic.bot', NOW()),
  (1, 'copywriting', 'webhook', 'https://copywriting.bot', NOW());

INSERT INTO public.bot_installations (bot_id, org_id)
VALUES
  (4, 1),
  (5, 1);
