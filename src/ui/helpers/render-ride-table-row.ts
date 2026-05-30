import { formatCurrency, formatCurrency2dp } from "../../utils/format-currency";
import {
  SUCCESS_COLOUR,
  ERROR_COLOUR,
  WARNING_COLOUR,
  INFO_COLOUR,
} from "../../constants";
import { TItemData, TRideInfo, TShopItem } from "../../types";
import {
  getAgeCategory,
  getBestPrice,
  getLongTermPrice,
} from "../../utils/ride-pricing";

const getRideName = (ride: TRideInfo) => {
  if (ride.breakdown !== "none") return `${ERROR_COLOUR}${ride.name}`;
  if (ride.status === "open") return ride.name;
  return ride.status === "testing"
    ? `${WARNING_COLOUR}${ride.name}`
    : `${ERROR_COLOUR}${ride.name}`;
};
const getColour = (ride: TRideInfo) => {
  return ride.duplicateType
    ? WARNING_COLOUR
    : ride.meetsRequirements
      ? SUCCESS_COLOUR
      : "";
};

const getTypeName = (ride: TRideInfo) => {
  if (!ride.typeName) return `${ERROR_COLOUR}UNKNOWN`;
  return `${getColour(ride)}${ride.typeName}`;
};

const getAgeName = (ride: TRideInfo) => {
  return `${ride.age}`;
};

const getExcitementString = (ride: TRideInfo) => {
  if (ride.classification !== "ride") return "-";
  if (ride.excitement === -1 || ride.excitement === undefined)
    return `${ERROR_COLOUR}???`;
  return `${getColour(ride)}${(ride.excitement / 100).toFixed(2)}`;
};

const getLengthString = (ride: TRideInfo) => {
  if (ride.classification !== "ride") return "-";
  if (ride.excitement === -1) return `${ERROR_COLOUR}???`;
  if (ride.rideLength === 0) return "-";
  return `${ride.meetsLengthRequirement ? (ride.duplicateType ? WARNING_COLOUR : SUCCESS_COLOUR) : ""}${context.formatString("{LENGTH}", ride.rideLength)}`;
};

const getRidersString = (ride: TRideInfo) => {
  if (ride.guestError && ride.guestError > 0)
    return `${WARNING_COLOUR}In ${(ride.guestError / 40).toFixed(0)}`;
  return `${ride.guestCount?.toFixed(0) || 0}`;
};

const getValueString = (ride: TRideInfo) => {
  if (ride.valueCalculated === null || ride.valueCalculated === undefined)
    return `${ERROR_COLOUR}???`;
  return `${formatCurrency(ride.valueCalculated * 10)}`;
};

const getActualPriceString = (ride: TRideInfo) => {
  if (ride.price?.[0] === undefined) return `${ERROR_COLOUR}???`;
  if (ride.price[0] === 0) return `Free`;
  const currentPrice = ride.price?.[0];
  const bestPrice = getBestPrice(ride.age || 0, ride.maxPrices || []);
  // Too expensive: nobody will ride it => ERROR_COLOUR
  if (bestPrice && currentPrice * 10 > bestPrice)
    return `${ERROR_COLOUR}${formatCurrency2dp(currentPrice)}`;
  // Highest acceptable price => SUCCESS_COLOUR
  if (currentPrice * 10 === bestPrice || currentPrice === 200)
    return `${SUCCESS_COLOUR}${formatCurrency2dp(currentPrice)}`;
  // Long term price => WHITE
  const longTermPrice = getLongTermPrice(ride.age || 0, ride.maxPrices || []);
  if (longTermPrice && currentPrice * 10 >= longTermPrice)
    return `${formatCurrency2dp(currentPrice)}`;
  // Too cheap => WARNING_COLOUR
  return `${WARNING_COLOUR}${formatCurrency2dp(ride.price?.[0])}`;
};

const getMaxPriceString = (ride: TRideInfo) => {
  if (ride.maxPrices) {
    return ride.maxPrices.map(
      (price, index) =>
        // Recommended price column => INFO_COLOUR
        `${getAgeCategory(ride.age || 0) === index ? INFO_COLOUR : ""}${price === null ? `${ERROR_COLOUR}???` : formatCurrency2dp(price)}`,
    );
  }
  return [""];
};

export const renderRideTableRow = (ride: TRideInfo, columns: string[]) => {
  const cols: string[] = [];
  if (columns.indexOf("name") !== -1) cols.push(getRideName(ride));
  if (columns.indexOf("type") !== -1) cols.push(getTypeName(ride));
  if (columns.indexOf("age") !== -1) cols.push(getAgeName(ride));
  if (columns.indexOf("excitement") !== -1)
    cols.push(getExcitementString(ride));
  if (columns.indexOf("length") !== -1) cols.push(getLengthString(ride));
  if (columns.indexOf("riders") !== -1) cols.push(getRidersString(ride));
  if (columns.indexOf("bonus") !== -1) cols.push(`${ride.bonusValue}`);
  if (columns.indexOf("value") !== -1) cols.push(getValueString(ride));
  if (columns.indexOf("prices") !== -1)
    cols.push(getActualPriceString(ride), ...getMaxPriceString(ride));
  return cols;
};

const getItemName = (data: TShopItem) => {
  // Single-purchase items => INFO_COLOUR
  return `${data.oneOff ? INFO_COLOUR : ""}${data.name}`;
};
const getCurrentPrice = (item: TItemData) => {
  if (item.minPrice === item.maxPrice && item.minPrice === 0) return "Free";
  if (item.minPrice !== item.maxPrice)
    // Mixed pricing => WARNING_COLOUR
    return `${WARNING_COLOUR}${formatCurrency2dp(item.maxPrice || 0)}`;

  // Recommended => SUCCESS_COLOUR
  return `${Math.round(item.minPrice) === Math.round((item.data.recommendedPrice || 0) * 10) ? SUCCESS_COLOUR : ""}${formatCurrency2dp(item.maxPrice || 0)}`;
};

export const renderItemTableRow = (item: TItemData) => [
  getItemName(item.data),
  getCurrentPrice(item),
  formatCurrency2dp((item.data.basePrice || 0) * 10),
  formatCurrency2dp((item.data.recommendedPrice || 0) * 10),
];
