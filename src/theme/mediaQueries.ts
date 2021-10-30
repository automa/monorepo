import breakpoints from './breakpoints';

const mediaQueries = {
  mobileOnly: `@media (max-width: ${breakpoints.mobile}px)`,
  tabletOnly: `@media (min-width: ${breakpoints.mobile + 1}px and max-width: ${
    breakpoints.tablet
  }px)`,
  desktopOnly: `@media (min-width: ${breakpoints.tablet + 1}px and max-width: ${
    breakpoints.desktop
  })`,
  wideOnly: `@media (min-width: ${breakpoints.desktop + 1}px and max-width: ${
    breakpoints.wide
  })`,
  extraWideOnly: `@media (min-width: ${breakpoints.wide + 1})`,
  tabletOrMobile: `@media (max-width ${breakpoints.tablet})`,
  desktopOrWide: `@media (min-width ${breakpoints.tablet + 1})`,
} as const;

export default mediaQueries;
