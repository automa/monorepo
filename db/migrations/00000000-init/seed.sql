INSERT INTO public.orgs (name, provider_type, provider_id, provider_name, has_installation)
VALUES
  ('automa', 'github', '65730741', 'automa', TRUE),
  ('badges', 'github', '6254238', 'badges', FALSE),
  ('aider', 'github', '172139148', 'aider-ai', FALSE),
  ('posthog', 'github', '60330232', 'posthog', FALSE),
  ('depot', 'github', '68166601', 'depot', FALSE);

INSERT INTO public.users (name, email)
VALUES
  ('John Smith', 'john@smith.com'),
  ('Pavan Sunkara', 'pavan.sss1991@gmail.com');

INSERT INTO public.user_providers (user_id, provider_type, provider_id, provider_email, refresh_token)
VALUES
  (1, 'github', '51139846', 'john@smith.com', 'refresh_token');

INSERT INTO public.user_orgs (user_id, org_id)
VALUES
  (1, 1),
  (2, 1),
  (2, 2),
  (2, 3),
  (2, 4),
  (2, 5);

INSERT INTO public.repos (org_id, name, provider_id, is_private, is_archived, has_installation)
VALUES
  (1, 'monorepo', '245484486', TRUE, FALSE, TRUE);

INSERT INTO public.user_repos (user_id, repo_id)
VALUES
  (2, 1);

INSERT INTO public.bots (org_id, name, short_description, image_url, type, webhook_url, webhook_secret, homepage, published_at, is_deterministic, is_preview, paths, draft_paths)
VALUES
  (1, 'automa', 'Updates & migrates automa settings', NULL, 'manual', 'https://localhost:5000/hooks/automa', 'atma_whsec_automa', 'https://automa.app', NULL, TRUE, FALSE, ARRAY['automa.json', 'automa.json5', '.github/automa.json', '.github/automa.json5'], ARRAY['automa.json', 'automa.json5', '.github/automa.json', '.github/automa.json5']),
  (1, 'dependency', 'Upgrade dependencies by updating code', NULL, 'scheduled', 'https://localhost:5001/hooks/automa', 'atma_whsec_dependency', 'https://dependency.bot', NULL, TRUE, TRUE, DEFAULT, DEFAULT),
  (1, 'refactor', 'Refactors your code according to your rules', NULL, 'manual', 'https://localhost:5002/hooks/automa', 'atma_whsec_refactor', 'https://refactor.bot', NULL, TRUE, FALSE, DEFAULT, DEFAULT),
  (3, 'aider', 'Basic bot that codes', 'https://aider.chat/assets/icons/apple-touch-icon.png', 'manual', 'https://localhost:5003/hooks/automa', 'atma_whsec_aider', 'https://aider.chat', NOW(), FALSE, FALSE, DEFAULT, DEFAULT),
  (5, 'github-runners', 'Changes GitHub CI configuration to use Depot runners', 'https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg', 'scheduled', 'http://localhost:5004/hooks/automa', 'atma_whsec_github-runners', 'https://depot.dev', NOW(), TRUE, FALSE, ARRAY['.github/workflows'], ARRAY['.github/workflows']),
  (2, 'package-badges', 'Adds package manager badges to public packages', 'https://avatars.githubusercontent.com/u/6254238?s=64', 'scheduled', 'http://localhost:5005/hooks/automa', 'atma_whsec_package-badges', 'https://github.com/automa/package-badges', NOW(), TRUE, FALSE, ARRAY['readme.md', 'readme.rst', 'package.json', 'Cargo.toml', 'pyproject.toml'], ARRAY['readme.md', 'readme.rst', 'package.json', 'Cargo.toml', 'pyproject.toml']),
  (4, 'posthog', 'Adds code to track a new analytics event using Posthog', 'https://posthog.com/brand/posthog-logomark.svg', 'manual', 'http://localhost:5006/hooks/automa', 'atma_whsec_posthog', 'https://posthog.com', NOW(), FALSE, FALSE, DEFAULT, ARRAY['data']);

INSERT INTO public.bot_installations (bot_id, org_id)
VALUES
  (4, 1),
  (5, 1),
  (6, 1),
  (7, 1);

INSERT INTO public.tasks (org_id, title, is_scheduled, token, created_at, state)
VALUES
  (1, 'Provision the cli repo', FALSE, 'a', NOW(), 'failed'),
  (1, 'Update the homepage headline', FALSE, 'b', NOW(), 'completed'),
  (1, 'Running depot/github-runners on monorepo', TRUE, 'c', NOW(), 'skipped'),
  (1, 'Running depot/github-runners on monorepo', TRUE, 'd', NOW(), DEFAULT),
  (1, 'Running depot/github-runners on monorepo', TRUE, 'e', NOW(), 'cancelled'),
  (1, 'Track "User Login Attempted" event', FALSE, 'f', NOW(), 'submitted'),
  (1, 'Track "User Logout Attempted" event', FALSE, 'g', NOW(), DEFAULT),
  (1, 'Provision the node.js template repo', FALSE, 'h', NOW(), 'skipped');

INSERT INTO public.task_activities (type, from_state, to_state)
VALUES
  ('state', 'started', 'failed'),
  ('state', 'submitted', 'completed'),
  ('state', 'started', 'skipped'),
  ('state', 'submitted', 'cancelled'),
  ('state', 'started', 'skipped');

INSERT INTO public.task_items (task_id, created_at, actor_user_id, repo_id, bot_id, task_activity_id, type, data)
VALUES
  (1, NOW(), 1, NULL, NULL, NULL, 'origin', '{ "orgId": 1 }'),
  (1, NOW(), NULL, NULL, NULL, 1, 'activity', '{}'),
  (2, NOW(), 1, NULL, NULL, NULL, 'message', '{ "content": "Change it to say \"Run any coding agent asynchronously from any integration\"" }'),
  (2, NOW(), 1, NULL, NULL, NULL, 'origin', '{ "orgId": 1 }'),
  (2, NOW(), 1, 1, NULL, NULL, 'repo', '{}'),
  (2, NOW(), 1, NULL, 4, NULL, 'bot', '{}'),
  (2, NOW(), NULL, 1, 4, NULL, 'proposal', '{ "prId": 106, "prNumber": 6, "prTitle": "Updated homepage headline", "prState": "closed", "prMerged": true, "prHead": "automa:aider/aider/2", "prBase": "master" }'),
  (2, NOW(), NULL, NULL, NULL, 2, 'activity', '{ "integration": "github", "userId": 174703, "userName": "pksunkara" }'),
  (3, NOW(), NULL, 1, NULL, NULL, 'repo', '{}'),
  (3, NOW(), NULL, NULL, 5, NULL, 'bot', '{}'),
  (3, NOW(), NULL, NULL, 5, 3, 'activity', '{}'),
  (4, NOW(), NULL, 1, NULL, NULL, 'repo', '{}'),
  (4, NOW(), NULL, NULL, 5, NULL, 'bot', '{}'),
  (5, NOW(), NULL, 1, NULL, NULL, 'repo', '{}'),
  (5, NOW(), NULL, NULL, 5, NULL, 'bot', '{}'),
  (5, NOW(), NULL, 1, 5, NULL, 'proposal', '{ "prId": 107, "prNumber": 7, "prTitle": "Use depot managed runners for github actions", "prState": "closed", "prMerged": false, "prHead": "automa:depot/github-runners/5", "prBase": "master" }'),
  (5, NOW(), 1, NULL, NULL, 4, 'activity', '{}'),
  (6, NOW(), NULL, NULL, NULL, NULL, 'message', '{ "content": "In `AuthLogin` component, when the user clicks on any of the login buttons, we want to send the \"User Login Attempted\" analytic event to track that the user has attempted a login." }'),
  (6, NOW(), NULL, NULL, NULL, NULL, 'origin', '{ "integration": "linear", "organizationId": "aa0479aa-f603-4508-8669-e283bca5a17f", "organizationName": "Automa", "teamId": "7b9f50fa-75b4-43bd-9a0a-0e0994f0ccd9", "teamKey": "DEMO", "teamName": "Demo", "userId": "db18fe9b-d550-44c5-816a-49ac71fccce9", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app", "issueId": "cfb003a0-5c42-48da-b34e-ebbacb9282bb", "issueTitle": "Track \"User Logged In\" event", "issueIdentifier": "DEMO-11", "commentId": "661237eb-3f3d-4bb8-ad22-9245aff0a5d9" }'),
  (6, NOW(), NULL, 1, NULL, NULL, 'repo', '{}'),
  (6, NOW(), NULL, NULL, 7, NULL, 'bot', '{}'),
  (6, NOW(), NULL, 1, 7, NULL, 'proposal', '{ "prId": 108, "prNumber": 8, "prTitle": "Implemented tracking of \"User Login Attempted\" event", "prState": "open", "prMerged": false, "prHead": "automa:posthog/posthog/6", "prBase": "master" }'),
  (7, NOW(), NULL, NULL, NULL, NULL, 'message', '{ "content": "In `AuthLogout` component, when the user clicks on the logout button, we want to send the \"User Logout Attempted\" analytic event to track that the user has attempted a logout." }'),
  (7, NOW(), NULL, NULL, NULL, NULL, 'origin', '{ "integration": "jira", "organizationId": "373e3aed-a60d-4a6d-9fd1-d136bc545eaa", "organizationUrl": "https://automa-demo.atlassian.net", "organizationName": "automa-demo", "projectId": "10000", "projectKey": "DEMO", "projectName": "Demo", "issuetypeId": "10002", "issuetypeName": "Task", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app", "issueId": "10000", "issueTitle": "Track \"User Logged Out\" event", "issueKey": "DEMO-1", "commentId": "10040" }'),
  (7, NOW(), NULL, 1, NULL, NULL, 'repo', '{ "integration": "jira", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app" }'),
  (7, NOW(), NULL, NULL, 7, NULL, 'bot', '{ "integration": "jira", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app" }'),
  (8, NOW(), 1, NULL, NULL, NULL, 'origin', '{ "orgId": 1 }'),
  (8, NOW(), NULL, NULL, NULL, 5, 'activity', '{}');
