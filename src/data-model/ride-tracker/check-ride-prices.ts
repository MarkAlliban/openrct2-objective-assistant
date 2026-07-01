import { TRideFinances } from ".";
import { TRideTypeData } from "../../data/get-ride-type";

export const getRideValue = (
  ride: Ride,
  guestCount: number,
  bonusValue: number,
) => (ride.value || 0) * (guestCount + bonusValue * 4);

export const checkRidePrices = (
  ride: Ride,
  typeData: TRideTypeData,
  isDuplicate: boolean,
  guestCount: number,
): TRideFinances => {
  // Calculate the value (for ticket price)
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

  // Initial value calculated from excitement, intensity and nausea values
  let value =
    ride.excitement !== null &&
    ride.intensity !== null &&
    ride.nausea !== null &&
    ride.excitement !== undefined &&
    ride.intensity !== undefined &&
    ride.nausea !== undefined &&
    ride.excitement !== -1 &&
    ride.intensity !== -1 &&
    ride.nausea !== -1
      ? Math.floor(
          (ride.excitement * (typeData.ratingsMultipliers[0] || 0)) / 1024,
        ) +
        Math.floor(
          (ride.intensity * (typeData.ratingsMultipliers[1] || 0)) / 1024,
        ) +
        Math.floor((ride.nausea * (typeData.ratingsMultipliers[2] || 0)) / 1024)
      : null;

  // Get the ride value
  const valueCalculated = getRideValue(ride, guestCount, typeData.bonusValue);

  // Adjust for age, and reduce by 25% if there are multiple rides of the same type
  let agedValues = value
    ? getAgeFactors(value).map(
        (value) => value - Math.floor(value * (isDuplicate ? 0.25 : 0)),
      )
    : [null, null, null, null, null, null, null, null, null, null];

  // Reduce by 75% if there is an entrance fee
  // (Actually this applies per guest but if some have paid to enter and some haven't, it's difficult to know whether to apply it or not. We use the current park entrance fee for simplicity)
  if (park.entranceFee) {
    agedValues.forEach((value, index) => {
      if (value)
        agedValues[index] = Math.max(value - Math.floor(value * 0.75), 0);
    });
  }

  return {
    value,
    agedValues,
    maxPrices: agedValues.map((value) => (value !== null ? value * 2 : null)),
		valueCalculated
  };
};
