import React from 'react';
import { CheckCircle, XCircle } from '@phosphor-icons/react/dist/ssr';

import { Typography } from 'components';

import {
  Comparison,
  ComparisonTable,
  ComparisonTitle,
  Container,
  FAQ,
  FAQAnswer,
  FAQItem,
  FAQQuestion,
  FAQTitle,
  FeatureCell,
  FeatureItem,
  FeaturesList,
  FeatureText,
  Header,
  PlanButton,
  PlanCard,
  PlanDescription,
  PlanHeader,
  PlanName,
  PlanPrice,
  PlansContainer,
  PopularBadge,
  Price,
  PriceExtra,
  PriceUnit,
  Subtitle,
  TableCell,
  TableHeader,
  TableRow,
  TableText,
  Title,
} from './page.styles';

const CheckMark = () => (
  <CheckCircle weight="fill" className="size-6 text-green-500/80" />
);

const CrossMark = () => (
  <XCircle weight="fill" className="size-6 text-red-500/80" />
);

const PricingPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Simple, transparent pricing</Title>
        <Subtitle>Choose the plan that works best for your team.</Subtitle>
      </Header>

      <PlansContainer>
        {/* Self-Hosted Plan */}
        <PlanCard>
          <PlanHeader>
            <PlanName>Self-Hosted</PlanName>
            <PlanDescription>
              Deploy on your own infrastructure.
            </PlanDescription>
            <PlanPrice>
              <Price>Free</Price>
              <PriceUnit>up to 10 engineers</PriceUnit>
            </PlanPrice>
            <PriceExtra>
              Then <span className="text-neutral-400 line-through">$100+</span>{' '}
              <span className="font-semibold text-green-600">$50+/month</span>
            </PriceExtra>
          </PlanHeader>

          <FeaturesList>
            <FeatureItem>
              <CheckMark />
              <FeatureText>Control over your code</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <CheckMark />
              <FeatureText>Freedom to update</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <CheckMark />
              <FeatureText>Connect to internal network</FeatureText>
            </FeatureItem>
          </FeaturesList>

          <PlanButton
            variant="secondary"
            href="https://docs.automa.app/self-hosting"
            blank
          >
            Get Started
          </PlanButton>
        </PlanCard>

        {/* Cloud Plan */}
        <PlanCard className="relative">
          <PopularBadge>Most Popular</PopularBadge>
          <PlanHeader>
            <PlanName>Cloud</PlanName>
            <PlanDescription>Fully managed. No infrastructure.</PlanDescription>
            <PlanPrice>
              <Price>Free</Price>
              <PriceUnit>platform</PriceUnit>
            </PlanPrice>
            <PriceExtra>
              +{' '}
              <span className="font-semibold text-blue-600">
                Coding agent usage
              </span>
            </PriceExtra>
          </PlanHeader>

          <FeaturesList>
            <FeatureItem>
              <CheckMark />
              <FeatureText>Wider variety of agents</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <CheckMark />
              <FeatureText>Unified billing</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <CheckMark />
              <FeatureText>Automatic updates</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <CheckMark />
              <FeatureText>99% uptime SLA</FeatureText>
            </FeatureItem>
          </FeaturesList>

          <PlanButton href={process.env.NEXT_PUBLIC_CONSOLE_URL!} blank>
            Start Free
          </PlanButton>
        </PlanCard>
      </PlansContainer>

      {/* Feature Comparison */}
      <Comparison>
        <ComparisonTitle>Feature Comparison</ComparisonTitle>
        <ComparisonTable>
          <TableHeader>
            <FeatureCell>
              <Typography className="!font-semibold">Feature</Typography>
            </FeatureCell>
            <TableCell>
              <Typography className="!font-semibold">Self-Hosted</Typography>
            </TableCell>
            <TableCell>
              <Typography className="!font-semibold">Cloud</Typography>
            </TableCell>
          </TableHeader>

          <TableRow>
            <FeatureCell>
              <FeatureText>Unlimited tasks</FeatureText>
            </FeatureCell>
            <TableCell>
              <CheckMark />
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Unlimited repositories</FeatureText>
            </FeatureCell>
            <TableCell>
              <CheckMark />
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Unlimited agents</FeatureText>
            </FeatureCell>
            <TableCell>
              <CheckMark />
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Unlimited users</FeatureText>
            </FeatureCell>
            <TableCell>
              <TableText>Depends</TableText>
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Custom agents</FeatureText>
            </FeatureCell>
            <TableCell>
              <CheckMark />
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Agent Marketplace</FeatureText>
            </FeatureCell>
            <TableCell>
              <CrossMark />
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Code residency</FeatureText>
            </FeatureCell>
            <TableCell>
              <CheckMark />
            </TableCell>
            <TableCell>
              <TableText>Limited</TableText>
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Agent insights</FeatureText>
            </FeatureCell>
            <TableCell>
              <CheckMark />
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>API</FeatureText>
            </FeatureCell>
            <TableCell>
              <CheckMark />
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Managed Infrastructure</FeatureText>
            </FeatureCell>
            <TableCell>
              <CrossMark />
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Automatic Updates</FeatureText>
            </FeatureCell>
            <TableCell>
              <TableText>Manual</TableText>
            </TableCell>
            <TableCell>
              <CheckMark />
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>Support Level</FeatureText>
            </FeatureCell>
            <TableCell>
              <TableText>Community / Priority</TableText>
            </TableCell>
            <TableCell>
              <TableText>Priority</TableText>
            </TableCell>
          </TableRow>

          <TableRow>
            <FeatureCell>
              <FeatureText>SLA</FeatureText>
            </FeatureCell>
            <TableCell>
              <CrossMark />
            </TableCell>
            <TableCell>
              <TableText>99%</TableText>
            </TableCell>
          </TableRow>
        </ComparisonTable>
      </Comparison>

      {/* FAQ */}
      <FAQ>
        <FAQTitle>Frequently Asked Questions</FAQTitle>

        <FAQItem>
          <FAQQuestion>Is the self-hosted version really free?</FAQQuestion>
          <FAQAnswer>
            Yes! The self-hosted version is free for teams up to 10 engineers
            under our BUSL license. After 10 engineers, it starts at{' '}
            <span className="line-through">$100</span> $50/month.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>
            What&apos;s the difference between self-hosted and cloud?
          </FAQQuestion>
          <FAQAnswer>
            Both offer the same platform features and access to the agents.
            Self-hosted gives you complete control but requires you to manage
            the infrastructure. Cloud is fully managed by us with SLA
            guarantees.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>
            What&apos;s the difference between self-hosted free and paid?
          </FAQQuestion>
          <FAQAnswer>
            The free self-hosted version is limited to teams up to 10 engineers.
            While it includes all existing platform features, it does not
            include priority support.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>
            How does coding agent pricing work on cloud?
          </FAQQuestion>
          <FAQAnswer>
            Automa is a marketplace for coding agents with unified billing.
            Agent providers set their pricing models, but you pay through Automa
            with a single bill. Some agents use usage-based pricing, others
            offer subscriptions, and some are completely free.
          </FAQAnswer>
        </FAQItem>

        <FAQItem>
          <FAQQuestion>
            How does coding agent pricing work on self-hosted?
          </FAQQuestion>
          <FAQAnswer>
            You either host your own agents, or use agents from the marketplace
            which can either be self-hosted or on cloud. Each agent may have its
            own pricing model, which you pay directly to the agent provider.
            Automa does not handle billing for self-hosted agents, so you manage
            those payments separately.
          </FAQAnswer>
        </FAQItem>
      </FAQ>
    </Container>
  );
};

export default PricingPage;
