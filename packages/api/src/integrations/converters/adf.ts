type Node = {
  attrs: Record<string, any>;
  content?: Node[];
} & (
  | {
      type: Omit<string, 'text'>;
      text: never;
      marks: never;
    }
  | {
      type: 'text';
      text: string;
      marks?: {
        type: string;
        attrs: Record<string, string>;
      }[];
    }
);

const contentJoiner = (content: Node[], sep?: string) =>
  content.map((node) => convert(node)).join(sep || '');

function convert(node: Node, parent?: Node): string {
  const content = node.content || [];

  switch (node.type) {
    case 'doc':
      return contentJoiner(content, '\n\n');

    case 'text':
      return `${convertMarks(node)}`;

    case 'paragraph':
      return contentJoiner(content);

    case 'heading':
      return `${'#'.repeat(node.attrs.level)} ${contentJoiner(content)}`;

    case 'hardBreak':
      return '\n';

    case 'inlineCard':
    case 'blockCard':
    case 'embedCard':
      return `[${node.attrs.url}](${node.attrs.url})`;

    case 'blockquote':
      return `> ${contentJoiner(content, '\n> ')}`;

    case 'bulletList':
    case 'orderedList':
      return `${content
        .map((subNode) => {
          const converted = convert(subNode, node);

          if (node.type === 'orderedList') {
            if (!node.attrs) {
              node.attrs = {
                order: 1,
              };
            }

            node.attrs.order += 1;
          }

          return converted;
        })
        .join('\n')}`;

    case 'listItem': {
      const order = parent?.attrs ? parent.attrs.order || 1 : 1;
      const symbol = parent?.type === 'bulletList' ? '*' : `${order}.`;

      return `  ${symbol} ${content
        .map((node) => convert(node).trimEnd())
        .join(' ')}`;
    }

    case 'codeBlock': {
      const language = node.attrs ? ` ${node.attrs.language}` : '';

      return `\`\`\`${language}\n${contentJoiner(content, '\n')}\n\`\`\``;
    }

    case 'rule':
      return '\n\n---\n';

    case 'emoji':
      return node.attrs.shortName as string;

    case 'table':
      return contentJoiner(content);

    case 'tableRow': {
      let output = '|';
      let thCount = 0;

      output += content
        .map((subNode) => {
          thCount += subNode.type === 'tableHeader' ? 1 : 0;
          return convert(subNode);
        })
        .join('');
      output += thCount ? `\n${'|:-:'.repeat(thCount)}|\n` : '\n';

      return output;
    }

    case 'tableHeader':
      return `${contentJoiner(content)}|`;

    case 'tableCell':
      return `${contentJoiner(content)}|`;

    default:
      return '';
  }
}

function convertMarks(node: Node) {
  if (!node.hasOwnProperty('marks') || !Array.isArray(node.marks)) {
    return node.text;
  }

  return node.marks.reduce((converted, mark) => {
    switch (mark.type) {
      case 'code':
        converted = `\`${converted}\``;
        break;

      case 'em':
        converted = `_${converted}_`;
        break;

      case 'link':
        converted = `[${converted}](${mark.attrs.href})`;
        break;

      case 'strike':
        converted = `~~${converted}~~`;
        break;

      case 'strong':
        converted = `**${converted}**`;
        break;

      // not supported
      default:
        break;
    }

    return converted;
  }, node.text);
}

const toMarkdown = (adf: any) => {
  // Super naive validation
  // schema is https://unpkg.com/@atlaskit/adf-schema@22.0.1/dist/json-schema/v1/full.json
  if (
    !adf ||
    typeof adf !== 'object' ||
    adf.type !== 'doc' ||
    adf.version !== 1
  ) {
    throw new Error('Given object is not an ADF document');
  }

  return convert(adf);
};

export { toMarkdown };
