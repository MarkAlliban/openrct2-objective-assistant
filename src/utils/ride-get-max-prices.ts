import { TRideInfo } from "../types";

const getAgeFactors = (value: number): number[] => [
  Math.floor(value + 30),
  Math.floor(value + 10),
  Math.floor(value),
  Math.floor(value * 0.75),
  Math.floor(value * 0.56),
  Math.floor(value * 0.42),
  Math.floor(value * 0.32),
  Math.floor(value * 0.16),
  Math.floor(value * 0.08),
  Math.floor(value * 0.56),
];

export const rideGetMaxPrices = (
  ride: TRideInfo,
  rides: TRideInfo[],
) => {
  // Initial value of excitement, intensity and nausea values
  let value =
    ride.excitement !== -1 && ride.intensity !== -1 && ride.nausea !== -1
      ? Math.floor((ride.excitement * ride.ratingsMultipliers[0]) / 1024) +
        Math.floor((ride.intensity * ride.ratingsMultipliers[1]) / 1024) +
        Math.floor((ride.nausea * ride.ratingsMultipliers[2]) / 1024)
      : null;

  // Adjust for age, and reduce by 25% if there are multiple rides of the same type
  const numOfType = rides.filter(
    (r) => (r.sameTypeAs || r.typeName) === (ride.sameTypeAs || ride.typeName),
  ).length;
  let valueAged = value
    ? getAgeFactors(value).map(
        (value) => value - Math.floor(value * (numOfType === 1 ? 0 : 0.25)),
      )
    : [null, null, null, null, null, null, null, null, null, null];
  // Reduce by 75% if there is an entrance fee
  // (Actually this applies per guest but if some have and some haven't, it's difficult to know whether to apply it or not. We use the current park status for simplicity)
  if (park.entranceFee) {
    valueAged.forEach((value, index) => {
      if (value)
        valueAged[index] = Math.max(value - Math.floor(value * 0.75), 0);
    });
  }

  // Calculate the max prices from the value
  ride.maxPrices = valueAged.map((value) => (value ? value * 2 : null));
};
