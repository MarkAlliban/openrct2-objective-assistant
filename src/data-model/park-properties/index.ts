export type TParkProperties = {
	canSetRidePrices: boolean;
	canSetShopPrices: boolean
}

export const initParkProperties = ():TParkProperties => {
  const hasMoney = !park.getFlag("noMoney"); // Scenario is using money?
  const unlockAllPrices = park.getFlag("unlockAllPrices"); // Can set ride and entrance prices
  const freeParkEntry = park.getFlag("freeParkEntry"); // Can set only ride prices
  const canSetRidePrices = hasMoney && (unlockAllPrices || freeParkEntry);
  const canSetShopPrices = hasMoney;

  return { canSetRidePrices, canSetShopPrices };
};
