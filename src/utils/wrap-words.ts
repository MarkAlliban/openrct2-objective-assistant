export const wrapWords = (text: string, lineLength: number): string[] => {
  const words: string[] = text.split(" ");
  return words.reduce((a: string[], word: string) => {
    if (!a.length) return [word];
    if (a[a.length - 1].length + word.length > lineLength) return [...a, word];
    a[a.length - 1] += ` ${word}`;
    return a;
  }, []);
};
