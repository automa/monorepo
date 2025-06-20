// eslint-disable-next-line import/consistent-type-specifier-style
import type { MDXComponents } from 'mdx/types';

import { Typography } from 'components';

export const common: MDXComponents = {
  h1: (props) => <Typography variant="title1" {...props} />,
  h2: (props) => <Typography variant="title2" {...props} />,
  h3: (props) => <Typography variant="title3" {...props} />,
  h4: (props) => <Typography variant="title4" {...props} />,
  h5: (props) => <Typography variant="title5" {...props} />,
  h6: (props) => <Typography variant="title6" {...props} />,
  p: ({ children, ...props }) => (
    <p className="py-4" {...props}>
      <Typography variant="large">{children}</Typography>
    </p>
  ),
  em: (props) => <em className="italic" {...props} />,
  strong: (props) => <strong className="font-bold" {...props} />,
  hr: (props) => (
    <hr className="my-8 border-t-4 border-neutral-200" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc pl-6 text-base lg:text-lg" {...props} />
  ),
  li: (props) => <li className="py-1" {...props} />,
};

export const useMDXComponents = (components: MDXComponents): MDXComponents => {
  return {
    ...common,
    ...components,
  };
};
