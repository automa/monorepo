import React from 'react';
import Image from 'next/image';

import { Flex } from 'components';

import Hero from 'assets/hero.webp';

import {
  Container,
  HeroButton,
  HeroImageText,
  HeroImageTextWrapper,
  Section,
  Subtitle,
  Title,
} from './page.styles';

const AppPage: React.FC = () => {
  return (
    <Container>
      <Section>
        <Title>Your coding tasks, automated your way, from anywhere.</Title>
        <Subtitle>
          Trigger tasks from your go-to apps with any coding agent. They
          complete in the background, generating a PR for you to review and
          merge.
        </Subtitle>
        <Flex className="mt-4 gap-4">
          <HeroButton href={process.env.NEXT_PUBLIC_CONSOLE_URL!} blank>
            Get Started
          </HeroButton>
          <HeroButton
            href="https://docs.automa.app/self-hosting"
            blank
            variant="secondary"
          >
            Self-host
          </HeroButton>
        </Flex>
      </Section>
      <Section>
        <Image
          id="hero-animation"
          src={Hero}
          alt="Hero"
          width={907}
          height={476}
          priority
        />
        <HeroImageTextWrapper>
          <HeroImageText className="animate-heroText1">
            Fixing a minor bug
          </HeroImageText>
          <HeroImageText className="animate-heroText2">
            Changing a page copy
          </HeroImageText>
          <HeroImageText className="animate-heroText3">
            Recurring maintenance
          </HeroImageText>
        </HeroImageTextWrapper>
        {/* Inline script for animation sync because we didn't add text to the animation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              function restartWebPAnimation() {
                const webp = document.getElementById('hero-animation');

                if (webp) {
                  const src = webp.src;

                  webp.src = '';
                  webp.src = src;
                }
              }

              document.addEventListener('DOMContentLoaded', restartWebPAnimation);
              window.addEventListener('load', restartWebPAnimation);
            })();
          `,
          }}
        />
      </Section>
    </Container>
  );
};

export default AppPage;
