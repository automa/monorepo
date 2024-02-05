import * as nextraDocs from 'nextra-theme-docs';

import { Logo, Footer, Banner } from 'components';

const config: nextraDocs.DocsThemeConfig = {
  useNextSeoProps() {
    return {
      titleTemplate: 'Automa Docs | %s',
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Documentation for Automa" />
    </>
  ),
  banner: {
    key: 'alpha',
    text: <Banner />,
    dismissible: false,
  },
  logo: <Logo />,
  direction: 'ltr',
  editLink: {
    text: null,
  },
  feedback: {
    content: null,
  },
  footer: {
    component: <Footer />,
  },
};

export default config;
