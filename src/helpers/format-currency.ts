export const formatCurrency = (x: number) =>
  context.formatString("{CURRENCY}", x);

export const formatCurrency2dp = (x: number) => {
  return context.formatString("{CURRENCY2DP}", Math.round(x));
}
