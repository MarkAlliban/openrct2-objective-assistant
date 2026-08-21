import { TRideExtended } from "../data-model/ride-tracker";
import { getShopItem } from "../data/get-shop-item";
import { getShopStrategy } from "../data/get-shop-strategy";
import { getPhotoPrice, getRecommendedPrice } from "../data/recommended-price";
import { setRidePrice } from "./rides-set-all-prices";

export const shopsSetAllPrices = (rides: TRideExtended[]) => {
  const strategy = getShopStrategy();
  rides
    .filter((ride) => ["stall", "facility"].includes(ride.ride.classification))
    .forEach((ride) => {
      if (ride.ride.object.shopItem === 255) return;
      const shopItem = getShopItem(ride.ride.object.shopItem);
      const recommendedPrice = getRecommendedPrice(
        shopItem,
        strategy.temperature,
        strategy.mood,
        strategy.foodBuy,
        strategy.merchBuy,
      );
      if (recommendedPrice !== null && recommendedPrice !== undefined) {
        setRidePrice(ride.ride.id, recommendedPrice * 10, true);
      }

      if (ride.ride.object.shopItemSecondary === 255) return;
      const shopItemSecondary = getShopItem(ride.ride.object.shopItemSecondary);
      const recommendedPriceSecondary = getRecommendedPrice(
        shopItemSecondary,
        strategy.temperature,
        strategy.mood,
        strategy.foodBuy,
        strategy.merchBuy,
      );
      if (
        recommendedPriceSecondary !== null &&
        recommendedPriceSecondary !== undefined
      ) {
        setRidePrice(ride.ride.id, recommendedPriceSecondary * 10, false);
      }
    });

  rides
    .filter(
      (ride: TRideExtended) =>
        ride.ride.classification === "ride" && ride.ride.price.length > 1,
    )
    .forEach((ride: TRideExtended) => {
      setRidePrice(ride.ride.id, getPhotoPrice(strategy) * 10, false);
    });
};
