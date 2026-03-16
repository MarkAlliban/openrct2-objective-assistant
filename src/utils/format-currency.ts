export const formatCurrency = (x: number) =>
  context.formatString("{CURRENCY2DP}", x).split(".")[0];
