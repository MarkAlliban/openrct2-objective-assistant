import { readValue } from "../helpers/storage";
import { SAVED_DATA } from "../constants";

export type TShopPricingStrategy = {
	temperature: number;
	mood: number;
	foodBuy: number;
	merchBuy: number;
};

export const getShopStrategy = (): TShopPricingStrategy => {
  // Temperature:    "Annual average", "This month", "Any temp", "Right now"
  // Mood:           "Happy guests", "Most guests", "All guests"
  // Food buy rate:  "100%", "75%", "50%", "25%", "12.5%"
  // Merch buy rate: "100%", "75%", "50%", "25%", "12.5%"
  const strategies: TShopPricingStrategy[] = [
    {
      // Dynamic
      temperature: 3,
      mood: 2,
      foodBuy: 0,
      merchBuy: 3,
    },
    {
      // Recommended
      temperature: 0,
      mood: 2,
      foodBuy: 0,
      merchBuy: 3,
    },
    {
      // Sell more items
      temperature: 2,
      mood: 2,
      foodBuy: 0,
      merchBuy: 0,
    },
    {
      // Maximise prices paid
      temperature: 3,
      mood: 0,
      foodBuy: 2,
      merchBuy: 4,
    },
  ];

  const strategyIndex = parseInt(
    readValue(SAVED_DATA.shopPricingStrategy) || "0",
  );
  return strategies[strategyIndex];
};
