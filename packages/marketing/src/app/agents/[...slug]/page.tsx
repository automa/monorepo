import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import TiptapHeading, { Level } from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { generateHTML } from '@tiptap/html';
import { mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { twp } from 'theme';

import { Button, Flex, Tooltip, Typography } from 'components';

import { TypographyComponentProps } from 'components/Typography';
import { typography } from 'components/Typography/Typography.cva';

import { getAgentBySlug, listAgents } from '../utils';

import AgentBadges from '../AgentBadges';

import { Container, Fallback, ImageContainer } from './page.styles';

export const generateStaticParams = listAgents;

type Props = {
  params: Awaited<ReturnType<typeof generateStaticParams>>[0];
};

const Heading = TiptapHeading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel
      ? (node.attrs.level as Level)
      : this.options.levels[0];

    let variant: TypographyComponentProps['variant'] = 'medium';

    switch (level) {
      case 1:
        variant = 'title4';
        break;

      case 2:
        variant = 'title5';
        break;

      case 3:
        variant = 'title6';
        break;

      case 4:
        variant = 'xlarge';
        break;

      default:
        break;
    }

    return [
      `h${level}`,
      mergeAttributes(HTMLAttributes, {
        class: `mb-2 ${typography({ variant })}`,
      }),
      0,
    ];
  },
});

// TODO: Unify this with console and put it in a shared package
const extensions = [
  StarterKit.configure({
    heading: false,
    paragraph: {
      HTMLAttributes: {
        class: twp`mb-2 min-h-6`,
      },
    },
    code: {
      HTMLAttributes: {
        class: twp`rounded-md bg-neutral-200 px-1.5 py-0.5`,
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: twp`my-4 border-t-2 border-neutral-200`,
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: twp`border-l-4 border-neutral-200 pl-4`,
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: twp`mb-2 list-inside list-disc`,
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: twp`mb-2 list-inside list-decimal`,
      },
    },
    listItem: {
      HTMLAttributes: {
        class: twp`[&_p]:inline`,
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: twp`mb-2 rounded-md bg-neutral-200 p-2`,
      },
    },
  }),
  Heading.configure({
    levels: [1, 2, 3, 4],
  }),
  Link.configure({
    HTMLAttributes: {
      class: twp`cursor-pointer text-blue-500 underline`,
    },
  }),
  Table.configure({
    HTMLAttributes: {
      class: twp`my-6 border-collapse [&_p]:mb-0`,
    },
  }),
  TableRow,
  TableHeader.configure({
    HTMLAttributes: {
      class: twp`border border-neutral-200 bg-neutral-200 px-2 py-1.5 font-bold [&.selectedCell]:bg-neutral-300`,
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: twp`border border-neutral-200 px-2 py-1.5 [&.selectedCell]:bg-neutral-200`,
    },
  }),
];

const AgentPage = async ({ params: { slug } }: Props) => {
  const bot = await getAgentBySlug(slug);

  if (!bot) {
    notFound();
  }

  const description = generateHTML(
    (bot?.description as object) || { type: 'doc', content: [] },
    extensions,
  );

  return (
    <Container>
      <Flex alignItems="center" className="gap-6">
        <ImageContainer>
          {bot.image_url ? (
            <Image
              src={bot.image_url}
              alt={`${bot.name} logo`}
              width={80}
              height={80}
              className="rounded-2xl"
            />
          ) : (
            <Fallback>
              <span className="w-full">{bot.name.charAt(0).toUpperCase()}</span>
            </Fallback>
          )}
        </ImageContainer>

        <Flex direction="column" className="gap-3 md:gap-4">
          <Flex alignItems="baseline" wrap="wrap" className="gap-4">
            <Typography variant="title3">{bot.name}</Typography>
            <Flex alignItems="center" className="gap-4">
              <Typography variant="large" className="text-neutral-500">
                by {bot.orgs.name}
              </Typography>

              <AgentBadges bot={bot} />
            </Flex>
          </Flex>
          <Typography
            variant="large"
            className="hidden text-neutral-600 md:block"
          >
            {bot.short_description}
          </Typography>
        </Flex>
      </Flex>

      <Typography variant="large" className="block text-neutral-600 md:hidden">
        {bot.short_description}
      </Typography>

      <Flex justifyContent="center" className="py-6">
        {bot.is_preview ? (
          <Tooltip body="Coming soon!">
            <Button size="xlarge" disabled>
              Install Agent
            </Button>
          </Tooltip>
        ) : (
          <Button
            href={`${process.env.NEXT_PUBLIC_CONSOLE_URL!}/$/bots/new/${
              bot.orgs.name
            }/${bot.name}`}
            blank
            size="xlarge"
          >
            Install Agent
          </Button>
        )}
      </Flex>

      {/* Description */}
      <div className="px-1" dangerouslySetInnerHTML={{ __html: description }} />
    </Container>
  );
};

export default AgentPage;
