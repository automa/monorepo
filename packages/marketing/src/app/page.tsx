import React from 'react';
import Image from 'next/image';

import { Button, Flex } from 'components';

import Activity from 'assets/landing/activity.svg';
import Analytics from 'assets/landing/analytics.svg';
import Async from 'assets/landing/async.svg';
import Chat from 'assets/landing/chat.svg';
import Concurrent from 'assets/landing/concurrent.svg';
import Context from 'assets/landing/context.svg';
import CustomAgent from 'assets/landing/custom_agent.svg';
import Dashboard from 'assets/landing/dashboard.svg';
import Hero from 'assets/landing/hero.webp';
import Marketplace from 'assets/landing/marketplace.svg';
import ProjectManagement from 'assets/landing/project_management.svg';
import PullRequest from 'assets/landing/pull_request.svg';

import {
  BentoCard,
  BentoCardContent,
  BentoCardImage,
  BentoCardSubtitle,
  BentoCardTitle,
  BentoGrid,
  Container,
  HeroImageText,
  HeroImageTextWrapper,
  Section,
  SectionSubtitle,
  SectionTitle,
  Subtitle,
  Title,
} from './page.styles';

const AppPage: React.FC = () => {
  return (
    <Container>
      <Section>
        <Title>Your coding tasks, using any agent, from anywhere.</Title>
        <Subtitle>
          Trigger tasks from your go-to apps with any coding agent. They
          complete in the background, generating a PR for you to review and
          merge.
        </Subtitle>
        <Flex className="mt-4 gap-4">
          <Button
            href={process.env.NEXT_PUBLIC_CONSOLE_URL!}
            blank
            size="xlarge"
          >
            Get Started
          </Button>
          <Button href="/self-hosting" variant="secondary" size="xlarge">
            Self-host
          </Button>
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
        {/* Animation sync because we didn't add text to it */}
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
              // window.addEventListener('load', restartWebPAnimation);
            })();
          `,
          }}
        />
      </Section>

      <Section>
        <SectionTitle>Your agents, your way</SectionTitle>
        <SectionSubtitle>
          Install trusted agents or plug in your own. Automa provides the glue,
          while the agents are your choice.
        </SectionSubtitle>
        <BentoGrid className="lg:grid-cols-2 xl:grid-cols-3">
          <BentoCard className="!pb-0 md:col-span-2 md:row-span-2">
            <BentoCardContent>
              <BentoCardTitle>One Home for Agents</BentoCardTitle>
              <BentoCardSubtitle>
                Track every task across all your agents and tools in one unified
                dashboard.
              </BentoCardSubtitle>
              <BentoCardImage className="items-end">
                <Image src={Dashboard} alt="Dashboard" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
          <BentoCard className="!pb-0">
            <BentoCardContent>
              <BentoCardTitle>Bring Your Own Agent</BentoCardTitle>
              <BentoCardSubtitle>
                Build custom agents in your preferred language to solve unique
                problems.
              </BentoCardSubtitle>
              <BentoCardImage className="items-end">
                <Image src={CustomAgent} alt="CustomAgent" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
          <BentoCard className="!pb-0">
            <BentoCardContent>
              <BentoCardTitle>Discover Agents</BentoCardTitle>
              <BentoCardSubtitle>
                Choose from trusted, pre-built agents, or from a vibrant
                marketplace.
              </BentoCardSubtitle>
              <BentoCardImage className="items-end">
                <Image src={Marketplace} alt="Marketplace" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
        </BentoGrid>
      </Section>

      <Section>
        <SectionTitle>Right in your workflow</SectionTitle>
        <SectionSubtitle>
          Automate your full workflow from plan to PR, all without leaving the
          tools you love.
        </SectionSubtitle>
        <BentoGrid className="lg:grid-cols-2 xl:grid-cols-5">
          <BentoCard className="xl:col-span-3">
            <BentoCardContent>
              <BentoCardTitle>Turn Plans into Actions</BentoCardTitle>
              <BentoCardSubtitle>
                Trigger agents via comments or assignments in your project
                tools.
              </BentoCardSubtitle>
              <BentoCardImage>
                <Image src={ProjectManagement} alt="ProjectManagement" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
          <BentoCard className="!pb-0 !pr-0 xl:col-span-2">
            <BentoCardContent>
              <BentoCardTitle className="pr-6 lg:pr-8">
                Automated Pull Requests
              </BentoCardTitle>
              <BentoCardSubtitle className="pr-6 lg:pr-8">
                Get a detailed, linked pull request delivered the moment a task
                finishes.
              </BentoCardSubtitle>
              <BentoCardImage className="items-end justify-end">
                <Image src={PullRequest} alt="PullRequest" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
          <BentoCard className="xl:col-span-2">
            <BentoCardContent>
              <BentoCardTitle>Managed Context Retrieval</BentoCardTitle>
              <BentoCardSubtitle>
                Let agents get the data they need without providing wide access.
              </BentoCardSubtitle>
              <BentoCardImage>
                <Image src={Context} alt="Context" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
          <BentoCard className="xl:col-span-3">
            <BentoCardContent>
              <BentoCardTitle>Act on Ideas, Instantly</BentoCardTitle>
              <BentoCardSubtitle>
                Run tasks immediately from chat, no ticket or developer needed.
              </BentoCardSubtitle>
              <BentoCardImage>
                <Image src={Chat} alt="Chat" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
        </BentoGrid>
      </Section>

      <Section>
        <SectionTitle>Your automation, supercharged</SectionTitle>
        <SectionSubtitle>
          Scale your automation fearlessly on a platform built for speed,
          transparency, and control.
        </SectionSubtitle>
        <BentoGrid className="lg:grid-cols-2">
          <BentoCard className="xl:min-w-150">
            <BentoCardContent>
              <BentoCardTitle>Fire and Forget</BentoCardTitle>
              <BentoCardSubtitle>
                Stay in your flow. We implement the tasks in the background.
              </BentoCardSubtitle>
              <BentoCardImage>
                <Image src={Async} alt="Async" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
          <BentoCard className="xl:min-w-150">
            <BentoCardContent>
              <BentoCardTitle>Run Tasks in Parallel</BentoCardTitle>
              <BentoCardSubtitle>
                Start as many tasks as you need. Our platform handles them all
                at once.
              </BentoCardSubtitle>
              <BentoCardImage>
                <Image src={Concurrent} alt="Concurrent" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
          <BentoCard>
            <BentoCardContent>
              <BentoCardTitle>A Clear Audit Trail</BentoCardTitle>
              <BentoCardSubtitle>
                Follow a detailed feed of events to understand exactly what
                happened.
              </BentoCardSubtitle>
              <BentoCardImage>
                <Image src={Activity} alt="Activity" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
          <BentoCard>
            <BentoCardContent>
              <BentoCardTitle>Measure Your Impact</BentoCardTitle>
              <BentoCardSubtitle>
                Get the insights you need to prove and improve your automation
                efforts.
              </BentoCardSubtitle>
              <BentoCardImage>
                <Image src={Analytics} alt="Analytics" />
              </BentoCardImage>
            </BentoCardContent>
          </BentoCard>
        </BentoGrid>
      </Section>

      <Section>
        <SectionTitle>Ready to get started?</SectionTitle>
        <SectionSubtitle>
          Automate the mundane, so you can focus on what matters most.
        </SectionSubtitle>
        <Flex className="mt-8 gap-4">
          <Button
            href={process.env.NEXT_PUBLIC_CONSOLE_URL!}
            blank
            size="xlarge"
          >
            Get Started
          </Button>
          <Button href="/self-hosting" variant="secondary" size="xlarge">
            Self-host
          </Button>
        </Flex>
      </Section>
    </Container>
  );
};

export default AppPage;
