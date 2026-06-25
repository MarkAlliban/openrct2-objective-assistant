import { getAgeCategory, getBestPrice } from "../actions/rides-set-all-prices";
import {
  ERROR_COLOUR,
  INFO_COLOUR,
  SUCCESS_COLOUR,
  WARNING_COLOUR,
} from "../constants";
import { formatCurrency, formatCurrency2dp } from "../helpers/format-currency";
import { TRideExtended } from "../data-model/ride-tracker";

export const getRideName = (ride: TRideExtended) => {
  if (ride.breakdown !== "none") return `${ERROR_COLOUR}${ride.ride.name}`;
  if (ride.ride.status === "open") return ride.ride.name;
  return ride.ride.status === "testing"
    ? `${WARNING_COLOUR}${ride.ride.name}`
    : `${ERROR_COLOUR}${ride.ride.name}`;
};

const getColour = (ride: TRideExtended) => {
  return ride.buildingObjective?.duplicateType
    ? WARNING_COLOUR
    : ride.buildingObjective?.meetsRequirements
      ? SUCCESS_COLOUR
      : "";
};
export const getTypeName = (ride: TRideExtended) => {
  if (!ride.typeData.name) return `${ERROR_COLOUR}UNKNOWN`;
  return `${getColour(ride)}${ride.typeData.name}`;
};

export const getAgeName = (ride: TRideExtended) => {
  return `${ride.ride.age}m`;
};

export const getActualPriceString = (ride: TRideExtended) => {
  if (ride.ride.price?.[0] === undefined) return `${ERROR_COLOUR}???`;
  if (ride.ride.price[0] === 0) return `Free`;
  const currentPrice = ride.ride.price?.[0];
  const bestPrice = getBestPrice(
    ride.ride.age || 0,
    ride.finances?.maxPrices || [],
  );
  // Too expensive: nobody will ride it => ERROR_COLOUR
  if (bestPrice && currentPrice * 10 > bestPrice)
    return `${ERROR_COLOUR}${formatCurrency2dp(currentPrice)}`;
  // Highest acceptable price => SUCCESS_COLOUR
  if (currentPrice * 10 === bestPrice || currentPrice === 200)
    return `${SUCCESS_COLOUR}${formatCurrency2dp(currentPrice)}`;
  return `${formatCurrency2dp(ride.ride.price?.[0])}`;
};

export const getRidersString = (ride: TRideExtended) => {
  if (ride.guestHistory.error && ride.guestHistory.error > 0)
    return `${WARNING_COLOUR}In ${(ride.guestHistory.error / 40).toFixed(0)}`;
  return `${ride.guestHistory.count?.toFixed(0) || 0}`;
};

export const getMaxPriceString = (ride: TRideExtended) => {
  if (ride.finances?.maxPrices) {
    const price = ride.finances.maxPrices[getAgeCategory(ride.ride.age)];
    return price === null ? "-" : formatCurrency2dp(price);
  }
  return "";
};

export const getItemName = (name: string, oneOff: boolean) => {
  // Single-purchase items => INFO_COLOUR
  return `${oneOff ? INFO_COLOUR : ""}${name}`;
};

export const getCurrentPrice = (price: number, recommendedPrice: number) => {
  if (price === 0) return "Free";
  // Recommended => SUCCESS_COLOUR
  return `${Math.round(price) === Math.round((recommendedPrice || 0) * 10) ? SUCCESS_COLOUR : ""}${formatCurrency2dp(price || 0)}`;
};

export const getValueString = (ride: TRideExtended) => {
  if (
    ride.finances?.valueCalculated === null ||
    ride.finances?.valueCalculated === undefined
  )
    return `${ERROR_COLOUR}???`;
  return `${formatCurrency(ride.finances.valueCalculated * 10)}`;
};

export const getExcitementString = (ride: TRideExtended) => {
  if (ride.ride.classification !== "ride") return "-";
  if (ride.ride.excitement === -1 || ride.ride.excitement === undefined)
    return `${ERROR_COLOUR}???`;
  return `${getColour(ride)}${(ride.ride.excitement / 100).toFixed(2)}`;
};

export const getLengthString = (ride: TRideExtended) => {
  if (ride.ride.classification !== "ride") return "-";
  if (ride.ride.excitement === -1) return `${ERROR_COLOUR}???`;
  if (ride.ride.rideLength === 0) return "-";
  return `${ride.buildingObjective?.meetsLengthRequirement ? (ride.buildingObjective.duplicateType ? WARNING_COLOUR : SUCCESS_COLOUR) : ""}${context.formatString("{LENGTH}", ride.ride.rideLength)}`;
};
