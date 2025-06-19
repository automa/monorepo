import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

import { Button, Flex, Tooltip, Typography } from 'shared';

import { useApp } from 'app';
import { useUser } from 'auth';

import Logo from 'assets/logo.svg?react';
import GithubLogo from 'assets/logos/github_fill.svg?react';
import GitlabLogo from 'assets/logos/gitlab_fill.svg?react';

import { AuthLoginProps } from './types';

import { LoginButton } from './AuthLogin.styles';

const AuthLogin: React.FC<AuthLoginProps> = () => {
  const { app } = useApp();

  const user = useUser();

  const location = useLocation();

  const loginWithGithubURL = useMemo(() => {
    const referer = (location.state as { from?: string })?.from;

    return `${import.meta.env.VITE_API_URI}/auth/github${
      referer ? `?from=${referer}` : ''
    }`;
  }, [location]);

  const [isSignup, setIsSignup] = useState<boolean | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setIsSignup(searchParams.has('withSignUp'));
  }, [location, setIsSignup]);

  if (isSignup === null) {
    return null;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  if (!app.integrations.github && !app.integrations.gitlab) {
    return <Navigate to="/admin/setup" replace />;
  }

  return (
    <>
      <div className="border-b-2">
        <Flex
          justifyContent="space-between"
          className="mx-auto w-screen max-w-8xl px-6 py-4"
        >
          <Link to="/">
            <Flex className="gap-2">
              <Logo className="size-8" />
              <Typography className="text-2xl font-bold lg:text-2xl lg:font-bold">
                Automa
              </Typography>
            </Flex>
          </Link>
          <Flex className="hidden gap-2 md:block">
            <Button
              size="small"
              variant="ghost"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Log In' : 'Sign Up'}
            </Button>
          </Flex>
        </Flex>
      </div>
      <Flex direction="column" alignItems="center" className="gap-3 py-32">
        <Typography variant="title4" className="mb-7">
          {isSignup ? 'Sign up' : 'Log in'} to Automa
        </Typography>
        <LoginButton
          href={loginWithGithubURL}
          className="bg-github text-white hover:bg-github/90"
        >
          <GithubLogo className="size-6" />
          <Flex className="gap-1">Continue with GitHub</Flex>
        </LoginButton>
        <Tooltip side="bottom" body="Coming soon!">
          <LoginButton
            disabled
            className="bg-gitlab text-black hover:bg-gitlab/90"
          >
            <GitlabLogo className="size-6" />
            <Flex className="gap-1">Continue with GitLab</Flex>
          </LoginButton>
        </Tooltip>
        <Typography variant="xsmall" className="mt-4 text-neutral-600">
          By continuing, you agree to our{' '}
          <Link to="https://automa.app/terms" className="text-black">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="https://automa.app/privacy" className="text-black">
            Privacy
          </Link>
        </Typography>
      </Flex>
    </>
  );
};

export default AuthLogin;
