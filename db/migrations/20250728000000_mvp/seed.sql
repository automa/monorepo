INSERT INTO public.orgs (name, provider_type, provider_id, provider_name, has_installation)
VALUES
  ('automa', 'github', '65730741', 'automa', TRUE),
  ('badges', 'github', '6254238', 'badges', FALSE),
  ('openai', 'github', '14957082', 'openai', FALSE),
  ('anthropic', 'github', '76263028', 'anthropics', FALSE),
  ('aider', 'github', '172139148', 'aider-ai', FALSE),
  ('all-hands', 'github', '169105795', 'all-hands-ai', FALSE),
  ('depot', 'github', '68166601', 'depot', FALSE),
  ('posthog', 'github', '60330232', 'posthog', FALSE),
  ('google', 'github', '1342004', 'google', FALSE);

INSERT INTO public.users (name, email)
VALUES
  ('Andrej Karpathy', 'andrej@karpathy.com'),
  ('Pavan Sunkara', 'pavan.sss1991@gmail.com');

INSERT INTO public.user_providers (user_id, provider_type, provider_id, provider_email, refresh_token)
VALUES
  (1, 'github', '241138', 'andrej@karpathy.com', 'refresh_token');

INSERT INTO public.user_orgs (user_id, org_id)
VALUES (1, 1);

-- For all orgs, insert devs
DO $$
DECLARE
  org RECORD;
BEGIN
  FOR org IN SELECT * FROM public.orgs LOOP
    FOR user_id IN 2..2 LOOP
      INSERT INTO public.user_orgs (user_id, org_id)
      VALUES (user_id, org.id);
    END LOOP;
  END LOOP;
END $$;

INSERT INTO public.repos (org_id, name, provider_id, is_private, is_archived, has_installation)
VALUES
  (1, 'monorepo', '245484486', TRUE, FALSE, TRUE);

INSERT INTO public.user_repos (user_id, repo_id)
VALUES
  (2, 1);

INSERT INTO public.bots (org_id, name, short_description, image_url, type, webhook_url, webhook_secret, homepage, published_at, is_deterministic, is_preview, is_sponsored, paths, draft_paths)
VALUES
  (1, 'automa', 'Updates & migrates automa settings', NULL, 'manual', 'https://localhost:5000/hooks/automa', 'atma_whsec_automa', 'https://automa.app', NULL, TRUE, FALSE, FALSE, ARRAY['automa.json', 'automa.json5', '.github/automa.json', '.github/automa.json5'], ARRAY['automa.json', 'automa.json5', '.github/automa.json', '.github/automa.json5']),
  (1, 'dependency', 'Upgrade dependencies by updating code', NULL, 'scheduled', 'https://localhost:5001/hooks/automa', 'atma_whsec_dependency', 'https://dependency.bot', NULL, TRUE, TRUE, FALSE, DEFAULT, DEFAULT),
  (1, 'refactor', 'Refactors your code according to your rules', NULL, 'manual', 'https://localhost:5002/hooks/automa', 'atma_whsec_refactor', 'https://refactor.bot', NULL, TRUE, FALSE, FALSE, DEFAULT, DEFAULT),
  (2, 'package-badges', 'Adds package manager badges to public packages', 'https://avatars.githubusercontent.com/u/6254238?s=64', 'scheduled', 'http://localhost:5005/hooks/automa', 'atma_whsec_package-badges', 'https://github.com/automa/package-badges', NOW(), TRUE, FALSE, TRUE, ARRAY['readme.md', 'readme.rst', 'package.json', 'Cargo.toml', 'pyproject.toml'], ARRAY['readme.md', 'readme.rst', 'package.json', 'Cargo.toml', 'pyproject.toml']),
  (3, 'codex', 'OpenAI''s coding agent', 'https://automa.app/logos/openai.svg', 'manual', 'http://localhost:5007/hooks/automa', 'atma_whsec_codex', 'https://openai.com', NOW(), FALSE, FALSE, TRUE, DEFAULT, DEFAULT),
  (4, 'claude-code', 'Anthropic''s coding agent', 'https://automa.app/logos/claude.svg', 'manual', 'http://localhost:5008/hooks/automa', 'atma_whsec_claude-code', 'https://anthropic.com', NOW(), FALSE, FALSE, TRUE, DEFAULT, DEFAULT),
  (5, 'aider', 'Open source coding agent', 'https://automa.app/logos/aider.svg', 'manual', 'https://localhost:5009/hooks/automa', 'atma_whsec_aider', 'https://aider.chat', NOW(), FALSE, FALSE, FALSE, DEFAULT, DEFAULT),
  (6, 'open-hands', 'All Hands'' coding agent', 'https://avatars.githubusercontent.com/u/169105795?s=64', 'manual', 'http://localhost:5010/hooks/automa', 'atma_whsec_open-hands', 'https://all-hands.dev', NOW(), FALSE, FALSE, FALSE, DEFAULT, DEFAULT),
  (7, 'github-runners', 'Changes GitHub CI configuration to use Depot runners', 'https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg', 'scheduled', 'http://localhost:5004/hooks/automa', 'atma_whsec_github-runners', 'https://depot.dev', NOW(), TRUE, FALSE, FALSE, ARRAY['.github/workflows'], ARRAY['.github/workflows']),
  (8, 'posthog', 'Adds code to track a new analytics event using Posthog', 'https://posthog.com/brand/posthog-logomark.svg', 'manual', 'http://localhost:5006/hooks/automa', 'atma_whsec_posthog', 'https://posthog.com', NOW(), FALSE, FALSE, FALSE, DEFAULT, ARRAY['data']),
  (9, 'gemini', 'Google''s coding agent', 'https://automa.app/logos/gemini.svg', 'manual', 'http://localhost:5011/hooks/automa', 'atma_whsec_gemini', 'https://deepmind.google/models/gemini/', NOW(), FALSE, FALSE, TRUE, DEFAULT, DEFAULT);

UPDATE bots SET
  description = '{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Codex is an open-source coding agent built by OpenAI at ", "type": "text"}, {"text": "https://github.com/openai/codex", "type": "text", "marks": [{"type": "link", "attrs": {"rel": "noopener noreferrer nofollow", "href": "https://github.com/openai/codex", "class": "cursor-pointer text-blue-500 underline", "target": "_blank"}}]}, {"text": ".", "type": "text"}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 4}, "content": [{"text": "Model", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Codex uses the ", "type": "text"}, {"text": "o4-mini", "type": "text", "marks": [{"type": "code"}]}, {"text": " model from OpenAI.", "type": "text"}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 4}, "content": [{"text": "Memory & Project docs", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "You can give Codex extra instructions and guidance using ", "type": "text"}, {"text": "AGENTS.md", "type": "text", "marks": [{"type": "code"}]}, {"text": " file in the repository root.", "type": "text"}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 4}, "content": [{"text": "Security & responsible AI", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Have you discovered a vulnerability or have concerns about the model output? Please e-mail ", "type": "text"}, {"text": "security@openai.com,", "type": "text", "marks": [{"type": "link", "attrs": {"rel": "noopener noreferrer nofollow", "href": "mailto:security@openai.com", "class": "cursor-pointer text-blue-500 underline", "target": "_blank"}}, {"type": "bold"}]}, {"text": " and we will respond promptly.", "type": "text"}]}]}'::jsonb
WHERE name = 'codex';

INSERT INTO public.bot_installations (bot_id, org_id)
VALUES
  (4, 1),
  (5, 1),
  (6, 1),
  (9, 1);

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
  (2, NOW(), 1, NULL, 5, NULL, 'bot', '{}'),
  (2, NOW(), NULL, 1, 5, NULL, 'proposal', '{ "prId": 106, "prNumber": 6, "prTitle": "Updated homepage headline", "prState": "closed", "prMerged": true, "prHead": "automa:aider/aider/2", "prBase": "master" }'),
  (2, NOW(), NULL, NULL, NULL, 2, 'activity', '{ "integration": "github", "userId": 174703, "userName": "pksunkara" }'),
  (3, NOW(), NULL, 1, NULL, NULL, 'repo', '{}'),
  (3, NOW(), NULL, NULL, 9, NULL, 'bot', '{}'),
  (3, NOW(), NULL, NULL, 9, 3, 'activity', '{}'),
  (4, NOW(), NULL, 1, NULL, NULL, 'repo', '{}'),
  (4, NOW(), NULL, NULL, 9, NULL, 'bot', '{}'),
  (5, NOW(), NULL, 1, NULL, NULL, 'repo', '{}'),
  (5, NOW(), NULL, NULL, 9, NULL, 'bot', '{}'),
  (5, NOW(), NULL, 1, 9, NULL, 'proposal', '{ "prId": 107, "prNumber": 7, "prTitle": "Use depot managed runners for github actions", "prState": "closed", "prMerged": false, "prHead": "automa:depot/github-runners/5", "prBase": "master" }'),
  (5, NOW(), 1, NULL, NULL, 4, 'activity', '{}'),
  (6, NOW(), NULL, NULL, NULL, NULL, 'message', '{ "content": "In `AuthLogin` component, when the user clicks on any of the login buttons, we want to send the \"User Login Attempted\" analytic event to track that the user has attempted a login." }'),
  (6, NOW(), NULL, NULL, NULL, NULL, 'origin', '{ "integration": "linear", "organizationId": "aa0479aa-f603-4508-8669-e283bca5a17f", "organizationName": "Automa", "teamId": "7b9f50fa-75b4-43bd-9a0a-0e0994f0ccd9", "teamKey": "DEMO", "teamName": "Demo", "userId": "db18fe9b-d550-44c5-816a-49ac71fccce9", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app", "issueId": "cfb003a0-5c42-48da-b34e-ebbacb9282bb", "issueTitle": "Track \"User Logged In\" event", "issueIdentifier": "DEMO-11", "commentId": "661237eb-3f3d-4bb8-ad22-9245aff0a5d9" }'),
  (6, NOW(), NULL, 1, NULL, NULL, 'repo', '{}'),
  (6, NOW(), NULL, NULL, 10, NULL, 'bot', '{}'),
  (6, NOW(), NULL, 1, 10, NULL, 'proposal', '{ "prId": 108, "prNumber": 8, "prTitle": "Implemented tracking of \"User Login Attempted\" event", "prState": "open", "prMerged": false, "prHead": "automa:posthog/posthog/6", "prBase": "master" }'),
  (7, NOW(), NULL, NULL, NULL, NULL, 'message', '{ "content": "In `AuthLogout` component, when the user clicks on the logout button, we want to send the \"User Logout Attempted\" analytic event to track that the user has attempted a logout." }'),
  (7, NOW(), NULL, NULL, NULL, NULL, 'origin', '{ "integration": "jira", "organizationId": "373e3aed-a60d-4a6d-9fd1-d136bc545eaa", "organizationUrl": "https://automa-demo.atlassian.net", "organizationName": "automa-demo", "projectId": "10000", "projectKey": "DEMO", "projectName": "Demo", "issuetypeId": "10002", "issuetypeName": "Task", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app", "issueId": "10000", "issueTitle": "Track \"User Logged Out\" event", "issueKey": "DEMO-1", "commentId": "10040" }'),
  (7, NOW(), NULL, 1, NULL, NULL, 'repo', '{ "integration": "jira", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app" }'),
  (7, NOW(), NULL, NULL, 10, NULL, 'bot', '{ "integration": "jira", "userId": "712020:3dd57004-4041-4aca-ab80-ced34cc711ab", "userName": "Pavan Sunkara", "userEmail": "pavan.sunkara@automa.app" }'),
  (8, NOW(), 1, NULL, NULL, NULL, 'origin', '{ "orgId": 1 }'),
  (8, NOW(), NULL, NULL, NULL, 5, 'activity', '{}');
