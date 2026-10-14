export const updateParkEntranceFee = () => {
  const guestMinimumCash = park.guestInitialCash - 100;
  const maximumAffordable = Math.min(
    park.totalRideValueForMoney,
    guestMinimumCash,
  );
  const goodValue = Math.min(
    park.totalRideValueForMoney / 2 - 1,
    guestMinimumCash,
  );

  return {
    maximumAffordable,
    goodValue,
  };
};
