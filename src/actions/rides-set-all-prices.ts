import { SAVED_DATA } from "../constants";
import { TRideExtended } from "../data-model/ride-tracker";
import { readValue } from "../helpers/storage";

export const setRidePrice = (
  ride: number,
  price: number,
  isPrimaryPrice: boolean,
) => {
  context.executeAction("ridesetprice", {
    ride,
    price: price > 200 ? 200 : price,
    isPrimaryPrice,
  });
};

export const getAgeCategory = (age: number) => {
  if (age < 5) return 0;
  if (age < 13) return 1;
  if (age < 40) return 2;
  if (age < 64) return 3;
  if (age < 88) return 4;
  if (age < 104) return 5;
  if (age < 120) return 6;
  if (age < 128) return 7;
  if (age < 200) return 8;
  return 9;
};

export const ridesSetAllPrices = (rides: TRideExtended[]) => {
  const pricingStrategy: number = parseInt(
    readValue(SAVED_DATA.pricingStrategy) || "0",
  );

  rides
    .filter((ride) => ride.ride.classification === "ride")
    .filter((ride) => ride.ride.excitement > -1)
    .forEach((ride) => {
      let price: number | null =
        ride.finances?.maxPrices[getAgeCategory(ride.ride.age || 0)] ?? null;
      if (price === null) return;
      if (ride.typeData.category === "transport" && ride.ride.price[0] === 0)
        return;

      if (pricingStrategy === 1) price = Math.min(price, 20);
      if (pricingStrategy === 2) price = 0;
      if (ride.ride.price[0] !== price) {
        setRidePrice(ride.ride.id, price, true);
      }
    });
};

export const getBestPrice = (age: number, maxPrices: (number | null)[]) => {
  const ageCategory = getAgeCategory(age || 0);
  return maxPrices?.[ageCategory] && maxPrices[ageCategory]! * 10;
};
