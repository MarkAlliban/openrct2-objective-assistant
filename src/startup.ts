import { openWindow } from "./ui/open-window";
import { TITLE } from "./constants";
import { guestTracker } from "./data/guest-tracker";
import { readValue } from "./actions/shared-storage";
import {
  updateRidePricesMultiple,
  updateRidesData,
} from "./ui/update-rides-data";
import { TRideInfo } from "./types";
import { getAgeCategory } from "./utils/ride-pricing";
import { setRidePrice } from "./actions/set-ride-price";

export function startup() {
  // Initialise guest tracker
  const tracker = guestTracker();

  context.subscribe("interval.day", function () {
    // Track guests once per day
    tracker.updateGuestCount();

    // Update ride prices once per day
    const automatePrices = !!readValue("automatePrices") || false;
    if (automatePrices) {
      const rides: TRideInfo[] = updateRidesData(
        { description: [""] },
        tracker,
        ["ride"],
      );
      rides.forEach((ride) => updateRidePricesMultiple(ride, rides));
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
