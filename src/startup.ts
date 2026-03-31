import { openWindow } from "./ui/open-window";
import { TITLE } from "./constants";
import { guestTracker } from "./data/guest-tracker";
import { readValue } from "./actions/shared-storage";
import { ridesAddMoreInfo } from "./data/rides-add-more-info";
import { TRideInfo } from "./types";
import { getAgeCategory } from "./utils/ride-pricing";
import { setRidePrice } from "./actions/set-ride-price";
import { rideGetMaxPrices } from "./data/ride-get-max-prices";

export function startup() {
  // Initialise guest tracker
  const tracker = guestTracker();

  context.subscribe("interval.day", function () {
    // Track guests once per day
    tracker.updateGuestCount();

    // Update ride prices once per day
    const automatePrices = !!readValue("automatePrices") || false;
    if (automatePrices) {
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
  });

  if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () => openWindow(tracker));
  }
}
