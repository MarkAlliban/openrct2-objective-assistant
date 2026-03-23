export const readValue = (name: string): { value: number | null } =>
  context.sharedStorage.get(`objective-progress.${name}`) || { value: null };

export const saveValue = (name: string, value: { value: number }) => {
  context.sharedStorage.set(`objective-progress.${name}`, value);
};
