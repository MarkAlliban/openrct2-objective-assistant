import { SAVED_DATA } from "../constants";
import { readValue } from "../helpers/storage";

export type TParkEntranceFee = {
  maximumAffordable: number;
  goodValue: number;
};

export const setParkEntrance = (parkEntranceFee: TParkEntranceFee) => {
  const parkEntranceStrategy: number = parseInt(
    readValue(SAVED_DATA.parkEntranceStrategy) || "0",
  );
  context.executeAction("parksetentrancefee", {
    value: Math.max(
      parkEntranceStrategy === 0
        ? parkEntranceFee.maximumAffordable
        : parkEntranceStrategy === 1
          ? parkEntranceFee.goodValue
          : 0,
      0,
    ),
  });
};
