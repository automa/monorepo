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

INSERT INTO public.bots (org_id, name, short_description, image_url, description, type, webhook_url, webhook_secret, homepage, published_at, is_deterministic, is_preview, paths)
VALUES
  (1, 'automa', 'Updates & migrates automa settings', NULL, NULL, 'event', 'https://localhost:5000/hooks/automa', 'atma_whsec_automa', 'https://automa.app', NULL, TRUE, FALSE, ARRAY['automa.json', 'automa.json5', '.github/automa.json', '.github/automa.json5']),
  (1, 'dependency', 'Upgrade dependencies by updating code', NULL, NULL, 'scheduled', 'https://localhost:5001/hooks/automa', 'atma_whsec_dependency', 'https://dependency.bot', NULL, TRUE, TRUE, DEFAULT),
  (1, 'refactor', 'Refactors your code according to your rules', NULL, NULL, 'event', 'https://localhost:5002/hooks/automa', 'atma_whsec_refactor', 'https://refactor.bot', NULL, TRUE, FALSE, DEFAULT),
  (1, 'aider', 'Basic bot that codes', 'https://aider.chat/assets/icons/apple-touch-icon.png', '...', 'event', 'https://localhost:5003/hooks/automa', 'atma_whsec_aider', 'https://aider.chat', NOW(), FALSE, FALSE, DEFAULT),
  (1, 'github-runners', 'Changes GitHub CI configuration to use Depot runners', 'https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg', '...', 'scheduled', 'http://localhost:5004/hooks/automa', 'atma_whsec_github-runners', 'https://depot.dev', NOW(), TRUE, FALSE, ARRAY['.github/workflows']),
  (1, 'posthog', 'Adds code to track a new analytics event using Posthog', 'https://posthog.com/brand/posthog-logomark.svg', '...', 'event', 'http://localhost:5005/hooks/automa', 'atma_whsec_posthog', 'https://posthog.com', NOW(), FALSE, FALSE, DEFAULT);

INSERT INTO public.bot_installations (bot_id, org_id)
VALUES
  (4, 1),
  (5, 1),
  (6, 1);

INSERT INTO public.tasks (org_id, title, is_scheduled, token, created_at, completed_at)
VALUES
  (1, 'Provision the cli repo', FALSE, 'a', NOW(), NOW()),
  (1, 'Update the homepage headline', FALSE, 'b', NOW(), NULL),
  (1, 'Running automa/github-runners on monorepo', TRUE, 'c', NOW(), NOW()),
  (1, 'Running automa/github-runners on monorepo', TRUE, 'd', NOW(), NOW()),
  (1, 'Running automa/github-runners on monorepo', TRUE, 'e', NOW(), NULL),
  (1, 'Track "User Login Attempted" event', FALSE, 'f', NOW(), NULL),
  (1, 'Track "User Logout Attempted" event', FALSE, 'g', NOW(), NULL);

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
  (6, NOW(), NULL, 'origin', '{ "integration": "linear", "organizationId": "aa0479aa-f603-4508-8669-e283bca5a17f", "organizationName": "Automa", "teamId": "7b9f50fa-75b4-43bd-9a0a-0e0994f0ccd9", "teamKey": "DEMO", "teamName": "Demo", "userId": "db18fe9b-d550-44c5-816a-49ac71fccce9", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app", "issueId": "cfb003a0-5c42-48da-b34e-ebbacb9282bb", "issueTitle": "Track \"User Logged In\" event", "issueIdentifier": "DEMO-11", "commentId": "661237eb-3f3d-4bb8-ad22-9245aff0a5d9" }'),
  (6, NOW(), NULL, 'repo', '{ "repoId": 1, "repoName": "monorepo", "repoOrgId": 1, "repoOrgName": "automa", "repoOrgProviderType": "github", "repoOrgProviderId": "65730741", "repoProviderId": "245484486" }'),
  (6, NOW(), NULL, 'bot', '{ "botId": 5, "botName": "posthog", "botImageUrl": "https://posthog.com/brand/posthog-logomark.svg", "botOrgId": 1, "botOrgName": "automa" }'),
  (7, NOW(), NULL, 'message', '{ "content": "In `AuthLogout` component, when the user clicks on the logout button, we want to send the \"User Logout Attempted\" analytic event to track that the user has attempted a logout." }'),
  (7, NOW(), NULL, 'origin', '{ "integration": "jira", "organizationId": "373e3aed-a60d-4a6d-9fd1-d136bc545eaa", "organizationUrl": "https://automa-demo.atlassian.net", "organizationName": "automa-demo", "projectId": "10000", "projectKey": "DEMO", "projectName": "Demo", "issuetypeId": "10002", "issuetypeName": "Task", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app", "issueId": "10000", "issueTitle": "Track \"User Logged Out\" event", "issueKey": "DEMO-1", "commentId": "10040" }'),
  (7, NOW(), NULL, 'repo', '{ "integration": "jira", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app", "repoId": 1, "repoName": "monorepo", "repoOrgId": 1, "repoOrgName": "automa", "repoOrgProviderType": "github", "repoOrgProviderId": "65730741", "repoProviderId": "245484486" }'),
  (7, NOW(), NULL, 'bot', '{ "integration": "jira", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app", "botId": 5, "botName": "posthog", "botImageUrl": "https://posthog.com/brand/posthog-logomark.svg", "botOrgId": 1, "botOrgName": "automa" }');
