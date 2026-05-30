import { openWindow } from "./ui/open-window";
import { TITLE } from "./constants";
import { guestTracker } from "./data/guest-tracker";
import { readValue } from "./actions/shared-storage";
import { ridesAddMoreInfo } from "./data/rides-add-more-info";
import { TRideInfo } from "./types";
import { getAgeCategory } from "./utils/ride-pricing";
import { setRidePrice } from "./actions/set-ride-price";
import { rideGetMaxPrices } from "./data/ride-get-max-prices";
import { getShopStrategy, shopGetItems } from "./data/shop-get-items";

export function startup() {
  // Initialise guest tracker
  const tracker = guestTracker();

  context.subscribe("interval.day", function () {
    // Track guests once per day
    tracker.updateGuestCount();
    const noMoney = park.getFlag("noMoney");
    const unlockAllPrices = park.getFlag("unlockAllPrices"); // Can set ride and entrance prices
    const freeParkEntry = park.getFlag("freeParkEntry"); // Can set only ride prices
    const canSetRidePrices = !noMoney && (unlockAllPrices || freeParkEntry);
    const canSetShopPrices = !noMoney;

    // Update ride prices once per day
    const automatePrices = !!readValue("automatePrices") || false;
    if (automatePrices && canSetRidePrices) {
      const rides: TRideInfo[] = ridesAddMoreInfo(
        { description: [""] },
        tracker,
        ["ride"],
      );
      rides.forEach((ride) => rideGetMaxPrices(ride, rides));
      rides.forEach((ride) => {
        const price = ride.maxPrices![getAgeCategory(ride.age || 0)];
        setRidePrice(ride.id, price, true);
      });
    }

    // Update shop prices once per day
    const automateShopPrices = !!readValue("automateShopPrices") || false;
    if (automateShopPrices && canSetShopPrices) {
      const shops: TRideInfo[] = ridesAddMoreInfo(
        { description: [""] },
        tracker,
        ["stall", "facility"],
      );
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
              ride.classification === "stall" ||
              ride.classification === "facility",
          )
          .forEach((shop: Ride) => {
            if (shop.object.shopItem === itemId)
              setRidePrice(shop.id, Math.round(price * 10), true);
            if (shop.object.shopItemSecondary === itemId)
              setRidePrice(shop.id, Math.round(price * 10), false);
          });
      });
    }
  });

  if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () => openWindow(tracker));
  }
}
