export const AUTOMA_REGEX = /^\/automa(\s.*)?$/;

const OPTIONS = ['bot', 'repo'];

export const getOptions = (comment: string) => {
  const options = comment.match(AUTOMA_REGEX)![1];

  if (!options) {
    return {};
  }

  return options
    .split(' ')
    .map((option) => option.split('='))
    .filter(([key, value]) => OPTIONS.includes(key) && value)
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {} as Record<string, string>,
    );
};
