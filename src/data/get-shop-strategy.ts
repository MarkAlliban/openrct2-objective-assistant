import { readValue } from "../helpers/storage";
import { SAVED_DATA } from "../constants";

export type TShopPricingStrategy = {
  temperature: number;
  mood: number;
  foodBuy: number;
  merchBuy: number;
};

export const TEMPERATURE_SETTINGS = {
  annualAverage: 0,
  thisMonth: 1,
  anyTemp: 2,
  rightNow: 3,
};
export const MOOD_SETTINGS = {
  happy: 0,
  most: 1,
  all: 2,
};
export const BUY_SETTINGS = {
  p100: 0,
  p75: 1,
  p50: 2,
  p25: 3,
  p12: 4,
};

export const getShopStrategy = (): TShopPricingStrategy => {
  const strategies: TShopPricingStrategy[] = [
    {
      // Dynamic: auto adjust to temperature, all guest modds, always buy food, 25% to buy merch
      temperature: TEMPERATURE_SETTINGS.rightNow,
      mood: MOOD_SETTINGS.all,
      foodBuy: BUY_SETTINGS.p100,
      merchBuy: BUY_SETTINGS.p25,
    },
    {
      // Recommended: annual average temperature, all guest modds, always buy food, 25% to buy merch
      temperature: TEMPERATURE_SETTINGS.annualAverage,
      mood: MOOD_SETTINGS.all,
      foodBuy: BUY_SETTINGS.p100,
      merchBuy: BUY_SETTINGS.p25,
    },
    {
      // Sell more: any temperature, all guest moods, always buy food and merch
      temperature: TEMPERATURE_SETTINGS.anyTemp,
      mood: MOOD_SETTINGS.all,
      foodBuy: BUY_SETTINGS.p100,
      merchBuy: BUY_SETTINGS.p100,
    },
    {
      // Price gouge: auto adjust to temperature, only happy guests buy, 50% chance to buy food, 12.5% chance to buy merch
      temperature: TEMPERATURE_SETTINGS.rightNow,
      mood: MOOD_SETTINGS.happy,
      foodBuy: BUY_SETTINGS.p50,
      merchBuy: BUY_SETTINGS.p12,
    },
  ];

  const strategyIndex = parseInt(
    readValue(SAVED_DATA.shopPricingStrategy) || "0",
  );
  return strategies[strategyIndex];
};
