import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StatsigProvider } from 'statsig-react';
import axios from 'axios';

import { environment, isTest } from 'env';

import { Loader, RoutesLoader, useAsyncEffect } from 'shared';
import { useAnalytics } from 'analytics';
import { useAuth, useUser } from 'auth';

import routes from './routes';

import { Container } from './App.styles';

const App: React.FC<{}> = () => {
  const { anonymousId, identify } = useAnalytics();

  const { setAuth, unsetAuth, setAuthLoading, authLoading } = useAuth();

  const user = useUser();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          unsetAuth();
        }

        return Promise.reject(error);
      },
    );

    return axios.interceptors.request.eject(interceptor);
  }, [unsetAuth]);

  useAsyncEffect(async () => {
    try {
      const { data } = await axios('/api/session');

      if (data) {
        setAuth({
          ...data,
          id: `${data.id}`,
        });
      }
    } catch (_) {}

    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!user && !authLoading && location.pathname !== '/auth/login') {
      navigate('/auth/login', {
        state: { from: window.location.href },
      });
    }
  }, [user, authLoading, navigate, location]);

  useEffect(() => {
    identify(user);
  }, [identify, user]);

  return (
    <Container>
      <StatsigProvider
        sdkKey={import.meta.env.VITE_STATSIG_KEY}
        waitForInitialization={isTest ? false : true}
        initializingComponent={<Loader />}
        options={{
          // Checking for undefined because we don't allow loading segment in development
          overrideStableID: anonymousId ? `${anonymousId}` : undefined,
          environment: {
            tier: environment,
          },
          disableAutoMetricsLogging: true,
          disableCurrentPageLogging: true,
          disableDiagnosticsLogging: true,
          disableErrorLogging: true,
        }}
        user={{
          userID: user?.id,
          email: user?.email,
          customIDs: {
            ...(user?.org_id && {
              orgID: user.org_id,
            }),
          },
        }}
      >
        {!authLoading && <RoutesLoader fallback={<Loader />} routes={routes} />}
      </StatsigProvider>
    </Container>
  );
};

export default App;
