export const readValue = (name: string): number | null => {
  return context.sharedStorage.get(`objective-assistant.${name}`) || null;
};

export const saveValue = (name: string, value: number) => {
  context.sharedStorage.set(`objective-assistant.${name}`, value);
};
