import { TEMP_COLD, TEMP_HOT } from "../constants";
import { TShopItem } from "./get-shop-item";
import { getAverageMonthlyTemperatures, getAverageTemperature } from "./weather";

// How much extra you can charge for 100%, 75%, 50%, 25% and 12.5% chance to buy repectively
export const overspend = {
  unhappy: [0, 0.2, 0.4, 0.6, 0.7],
  normal: [0.1, 0.5, 0.9, 1.3, 1.5],
  happy: [0.3, 1.1, 1.9, 2.7, 3.1],
};

// For each 0.1 increment, what is the chance a guest will buy the item?
// We don't need this data for the code, but it's used to calculate the chanceToBuy above.
// const overchargePercenrages = {
//   unhappy: [100, 0.875, 0.75, 0.625, 0.5, 0.375, 0.25, 0.125],
//   normal: [
//     100, 100, 0.875, 0.875, 0.75, 0.75, 0.625, 0.625, 0.5, 0.5, 0.375, 0.375,
//     0.25, 0.25, 0.125, 0.125,
//   ],
//   happy: [
//     100, 100, 100, 100, 0.875, 0.875, 0.875, 0.875, 0.75, 0.75, 0.75, 0.75,
//     0.625, 0.625, 0.625, 0.625, 0.5, 0.5, 0.5, 0.5, 0.375, 0.375, 0.375, 0.375,
//     0.25, 0.25, 0.25, 0.25, 0.125, 0.125, 0.125, 0.125,
//   ],
// };

export const getTempAdjustedPrice = (
  data: TShopItem,
  temperatureMode: number,
  temperature: number,
) => {
  if (temperatureMode == 2) {
    return Math.min(data.coldPrice, data.basePrice, data.hotPrice);
  }
  return temperature < TEMP_COLD
    ? data.coldPrice
    : temperature < TEMP_HOT
      ? data.basePrice
      : data.hotPrice;
};

export const getRecommendedPrice = (
  shopItem: TShopItem,
  optionTemperature: number,
  optionGuestMood: number,
  optionFoodBuy: number,
  optionMerchBuy: number,
) => {
  // Adjust the price for the temperature
  const tempAdjustedPrice = getTempAdjustedPrice(
    shopItem,
    optionTemperature,
    optionTemperature === 0
      ? getAverageTemperature()
      : optionTemperature === 1
        ? getAverageMonthlyTemperatures()[date.month]
        : climate.current.temperature,
  );

  // Get the overcharge array for the guests mood
  const priceAdjustments =
    overspend[
      optionGuestMood === 0
        ? "happy"
        : optionGuestMood === 1
          ? "normal"
          : "unhappy"
    ];

  // Get recommended price based on overcharge options
  let recommendedPrice =
    tempAdjustedPrice +
    priceAdjustments[shopItem.oneOff ? optionMerchBuy : optionFoodBuy];

  // Umbrella are always £20
  if (shopItem.itemId === 4) recommendedPrice = 20;
  // Maps are always £0.70
  if (shopItem.itemId === 2) recommendedPrice = 0.7;

  // Maximum price is £20
  return Math.min(recommendedPrice, 20);
};
