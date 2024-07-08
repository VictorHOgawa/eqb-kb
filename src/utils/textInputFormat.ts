export const removeSpace = (text: string) => {
  if (!text) {
    return '';
  }

  const replace = text.replace(/\s/g, '');
  return replace;
};
