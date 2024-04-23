import React from 'react';

import { Flex, Typography } from 'shared';

import { OrgSettingsBillingProps } from './types';

const OrgSettingsBilling: React.FC<OrgSettingsBillingProps> = () => {
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Billing summary</Typography>
      </Flex>
    </>
  );
};

export default OrgSettingsBilling;
