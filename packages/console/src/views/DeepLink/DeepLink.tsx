import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useOrg, useOrgs } from 'orgs';

import { DeepLinkProps } from './types';

const DeepLink: React.FC<DeepLinkProps> = () => {
  const location = useLocation();

  const { orgs } = useOrgs();
  const { org } = useOrg();

  if (!orgs?.length) {
    return null;
  }

  // TODO: Either store the last visited org in local storage and read it
  // or ask the user to select an org if they have access to multiple
  const toOrg = org || orgs[0];

  const to = location.pathname.replace('$', `${toOrg.name}`);

  return <Navigate to={to} replace />;
};

export default DeepLink;
