import React from 'react';
import { useOutletContext } from 'react-router-dom';

import { Typography } from 'shared';

import { Org } from 'orgs';

const OrgSettingsBilling: React.FC = () => {
  const { org } = useOutletContext<{ org: Org }>();

  return <Typography variant="title6">Billing summary</Typography>;
};

export default OrgSettingsBilling;
