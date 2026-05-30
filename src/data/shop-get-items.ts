import { readValue } from "../actions/shared-storage";
import { TItemData, TRideInfo } from "../types";
import { getRecommendedPrice } from "../utils/price-adjustment";
import { getShopItem } from "./shop-info";

export const getShopStrategy = () => {
  // Temperature:    "Annual average", "This month", "Any temp", "Right now"
  // Mood:           "Happy guests", "Most guests", "All guests"
  // Food buy rate:  "100%", "75%", "50%", "25%", "12.5%"
  // Merch buy rate: "100%", "75%", "50%", "25%", "12.5%"
  const strategies = [
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
      temperature: 0,
      mood: 2,
      foodBuy: 0,
      merchBuy: 0,
    },
    {
			// Maximise prices paid
      temperature: 0,
      mood: 0,
      foodBuy: 2,
      merchBuy: 4,
    },
  ];

	const strategyIndex = readValue("shops.strategy") || 0;
  return strategies[strategyIndex];
};

// Get a list of the items for sale
export const shopGetItems = (
  rides: TRideInfo[],
  optionTemperature: number,
  optionGuestMood: number,
  optionFoodBuy: number,
  optionMerchBuy: number,
): TItemData[] => {
  const items: TItemData[] = [];
  rides.forEach((ride) => {
    ride.shopItems?.forEach((item) => {
      const i = items.find((i) => i.id === item.id);
      if (i) {
        if (i.minPrice > item.price) i.minPrice = item.price;
        if (i.maxPrice < item.price) i.maxPrice = item.price;
      } else {
        const data = getShopItem(item.id);
        const recommendedPrice = getRecommendedPrice(
          data,
          optionTemperature,
          optionGuestMood,
          optionFoodBuy,
          optionMerchBuy,
        );
        data.recommendedPrice = recommendedPrice;
        items.push({
          id: item.id,
          minPrice: item.price,
          maxPrice: item.price,
          data,
        });
      }
    });
  });
  return items;
};
