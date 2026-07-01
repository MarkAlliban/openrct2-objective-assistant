export function arrayToObject<T extends AwardType, V>(
  arr: { name: T; text: V }[],
): Record<T, V> {
  return arr.reduce(
    (acc, item) => {
      acc[item.name] = item.text;
      return acc;
    },
    {} as Record<T, V>,
  );
}
