import React from 'react';
import Image from 'next/image';

import Bluesky from 'assets/logos/bluesky.svg';
import Discord from 'assets/logos/discord.svg';
import Github from 'assets/logos/github.svg';
import LinkedIn from 'assets/logos/linkedin.svg';

import { SocialsProps } from './types';

import { Container, SocialLink } from './Socials.styles';

const Socials: React.FC<SocialsProps> = ({ ...props }) => {
  return (
    <Container {...props}>
      <SocialLink href="https://github.com/automa">
        <Image
          src={Github}
          alt="GitHub"
          width={20}
          height={20}
          className="size-5"
        />
      </SocialLink>
      <SocialLink href="https://discord.gg/z4Gqd7T2WQ">
        <Image
          src={Discord}
          alt="Discord"
          width={20}
          height={20}
          className="size-5"
        />
      </SocialLink>
      <SocialLink href="https://bsky.app/profile/automa.app">
        <Image
          src={Bluesky}
          alt="Bluesky"
          width={20}
          height={20}
          className="size-5"
        />
      </SocialLink>
      <SocialLink href="https://linkedin.com/company/automa-app">
        <Image
          src={LinkedIn}
          alt="LinkedIn"
          width={20}
          height={20}
          className="size-5"
        />
      </SocialLink>
    </Container>
  );
};

export default Socials;
