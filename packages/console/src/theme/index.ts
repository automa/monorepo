import FontFaceObserver from 'fontfaceobserver';

export * from './mediaQueries';
export * from './utils';

export const loadFonts = async () => {
  await new FontFaceObserver('Manrope').load();
};
