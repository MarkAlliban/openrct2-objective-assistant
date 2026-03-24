export const readValue = (name: string): number | null =>
  context.sharedStorage.get(`objective-progress.${name}`) || null;

export const saveValue = (name: string, value: number) => {
  context.sharedStorage.set(`objective-progress.${name}`, value);
};
