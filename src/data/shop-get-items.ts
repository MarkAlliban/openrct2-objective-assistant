import { setRidePrice } from "../actions/set-ride-price";
import { readValue } from "../actions/shared-storage";
import { TItemData, TRideInfo } from "../types";
import { getRecommendedPrice } from "../utils/price-adjustment";
import { ridesAddMoreInfo } from "./rides-add-more-info";
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
        i.guestCount += ride.guestCount || 0;
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
          guestCount: ride.guestCount || 0,
          guestError: ride.guestError || 0,
          data,
        });
      }
    });
  });
  return items;
};

export const shopsSetAllPrices = () => {
  const shops: TRideInfo[] = ridesAddMoreInfo(null, null, [
    "stall",
    "facility",
  ]);
  const strategy = getShopStrategy();
  const items = shopGetItems(
    shops,
    strategy.temperature,
    strategy.mood,
    strategy.foodBuy,
    strategy.merchBuy,
  );
  items.forEach((item) => {
    const itemId = item.id;
    const price = item.data.recommendedPrice || 0;
    if (!price) return;
    map.rides
      .filter(
        (ride: Ride) =>
          ride.classification === "stall" || ride.classification === "facility",
      )
      .forEach((shop: Ride) => {
        if (shop.object.shopItem === itemId)
          setRidePrice(shop.id, Math.round(price * 10), true);
        if (shop.object.shopItemSecondary === itemId)
          setRidePrice(shop.id, Math.round(price * 10), false);
      });
  });
};
