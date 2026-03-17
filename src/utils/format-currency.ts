export const formatCurrency = (x: number) =>
  context.formatString("{CURRENCY}", x);

export const formatCurrency2dp = (x: number) =>
  context.formatString("{CURRENCY2DP}", x);
