import * as nextraDocs from 'nextra-theme-docs';

import { Logo, Footer } from 'components';

const config: nextraDocs.DocsThemeConfig = {
  nextThemes: {
    defaultTheme: 'dark',
  },
  banner: {
    key: 'alpha',
    text: (
      <div className="text-base font-light">
        Automa is in <span className="font-bold">alpha</span>. Please report any
        issues to{' '}
        <a href="mailto:support@automa.app" className="font-semibold">
          support@automa.app
        </a>
      </div>
    ),
    dismissible: false,
  },
  logo: <Logo />,
  editLink: {
    text: null,
  },
  feedback: {
    content: null,
  },
  footer: {
    component: <Footer />,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s | Automa Docs',
    };
  },
};

export default config;
