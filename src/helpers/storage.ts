export const readValue = (name: string): string | null => {
  return context.sharedStorage.get(`objective-assistant.${name}`) || null;
};

export const saveValue = (name: string, value: string) => {
  context.sharedStorage.set(`objective-assistant.${name}`, value);
};
