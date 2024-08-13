UPDATE public.orgs SET has_installation = TRUE;

INSERT INTO public.users (name, email)
VALUES
  ('John', 'john@example.com');

INSERT INTO public.user_providers (user_id, provider_type, provider_id, provider_email, refresh_token)
VALUES
  (1, 'github', '583231', 'john@example.com', 'refresh_token');

INSERT INTO public.user_orgs (user_id, org_id)
VALUES
  (1, 1);

INSERT INTO public.repos (org_id, name, provider_id, is_private, is_archived, has_installation)
VALUES
  (1, 'monorepo', '245484486', TRUE, FALSE, TRUE);

INSERT INTO public.bots (org_id, name, short_description, image_url, description, type, webhook_url, webhook_secret, homepage, published_at, is_deterministic)
VALUES
  (1, 'aider', 'Basic bot that codes', 'https://aider.chat/assets/icons/apple-touch-icon.png', '...', 'event', 'https://localhost:5000/hooks/automa', 'atma_whsec_aider', 'https://aider.chat', NOW(), FALSE),
  (1, 'github-runners', 'Changes GitHub CI configuration to use Depot runners', 'https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg', '...', 'scheduled', 'http://localhost:5001/hooks/automa', 'atma_whsec_github-runners', 'https://depot.dev', NOW(), TRUE),
  (1, 'posthog', 'Adds code to track a new analytics event using Posthog', 'https://posthog.com/brand/posthog-logomark.svg', '...', 'event', 'http://localhost:5002/hooks/automa', 'atma_whsec_posthog', 'https://posthog.com', NOW(), FALSE);

INSERT INTO public.bot_installations (bot_id, org_id)
VALUES
  (4, 1),
  (5, 1),
  (6, 1);

INSERT INTO public.tasks (org_id, title, is_scheduled, created_at, completed_at)
VALUES
  (1, 'Provision the cli repo', FALSE, NOW(), NOW()),
  (1, 'Update the homepage headline', FALSE,  NOW(), NULL),
  (1, 'Running automa/github-runners on monorepo', TRUE, NOW(), NOW()),
  (1, 'Running automa/github-runners on monorepo', TRUE, NOW(), NOW()),
  (1, 'Running automa/github-runners on monorepo', TRUE, NOW(), NULL),
  (1, 'Track "User Login Attempted" event', FALSE, NOW(), NULL);

INSERT INTO public.task_items (task_id, created_at, actor_user_id, type, data)
VALUES
  (2, NOW(), 1, 'message', '{ "content": "Update the homepage headline" }'),
  (2, NOW(), 1, 'origin', '{ "orgId": 1 }'),
  (2, NOW(), 1, 'repo', '{ "repoId": 1, "repoName": "monorepo", "repoOrgId": 1, "repoOrgName": "automa", "repoOrgProviderType": "github", "repoOrgProviderId": "65730741", "repoProviderId": "245484486" }'),
  (2, NOW(), 1, 'bot', '{ "botId": 4, "botName": "aider", "botImageUrl": "https://aider.chat/assets/icons/apple-touch-icon.png", "botOrgId": 1, "botOrgName": "automa" }'),
  (3, NOW(), NULL, 'repo', '{ "repoId": 1, "repoName": "monorepo", "repoOrgId": 1, "repoOrgName": "automa", "repoOrgProviderType": "github", "repoOrgProviderId": "65730741", "repoProviderId": "245484486" }'),
  (3, NOW(), NULL, 'bot', '{ "botId": 5, "botName": "github-runners", "botImageUrl": "https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg", "botOrgId": 1, "botOrgName": "automa" }'),
  (4, NOW(), NULL, 'repo', '{ "repoId": 1, "repoName": "monorepo", "repoOrgId": 1, "repoOrgName": "automa", "repoOrgProviderType": "github", "repoOrgProviderId": "65730741", "repoProviderId": "245484486" }'),
  (4, NOW(), NULL, 'bot', '{ "botId": 5, "botName": "github-runners", "botImageUrl": "https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg", "botOrgId": 1, "botOrgName": "automa" }'),
  (5, NOW(), NULL, 'repo', '{ "repoId": 1, "repoName": "monorepo", "repoOrgId": 1, "repoOrgName": "automa", "repoOrgProviderType": "github", "repoOrgProviderId": "65730741", "repoProviderId": "245484486" }'),
  (5, NOW(), NULL, 'bot', '{ "botId": 5, "botName": "github-runners", "botImageUrl": "https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg", "botOrgId": 1, "botOrgName": "automa" }'),
  (6, NOW(), NULL, 'message', '{ "content": "In `AuthLogin` component, when the user clicks on any of the login buttons, we want to send the \"User Login Attempted\" analytic event to track that the user has attempted a login." }'),
  (6, NOW(), NULL, 'origin', '{ "integration": "linear", "url": "https://linear.app/automa-demo/issue/DEMO-11/track-user-login-attempted-event#comment-661237eb", "teamId": "7b9f50fa-75b4-43bd-9a0a-0e0994f0ccd9", "userId": "db18fe9b-d550-44c5-816a-49ac71fccce9", "issueId": "cfb003a0-5c42-48da-b34e-ebbacb9282bb", "commentId": "661237eb-3f3d-4bb8-ad22-9245aff0a5d9", "issueTitle": "Track \"User Logged In\" event", "organizationId": "aa0479aa-f603-4508-8669-e283bca5a17f", "organizationName": "Automa", "issueIdentifier": "DEMO-11" }'),
  (6, NOW(), NULL, 'repo', '{ "repoId": 1, "repoName": "monorepo", "repoOrgId": 1, "repoOrgName": "automa", "repoOrgProviderType": "github", "repoOrgProviderId": "65730741", "repoProviderId": "245484486" }'),
  (6, NOW(), NULL, 'bot', '{ "botId": 5, "botName": "posthog", "botImageUrl": "https://posthog.com/brand/posthog-logomark.svg", "botOrgId": 1, "botOrgName": "automa" }');
