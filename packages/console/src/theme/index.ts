import FontFaceObserver from 'fontfaceobserver';

export * from './mediaQueries';
export * from './utils';

export const loadFonts = async () => {
  await new FontFaceObserver('Manrope Variable').load();
  await new FontFaceObserver('Cal sans').load();
};
