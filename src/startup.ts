import { initParkProperties } from "./data-model/park-properties";
import { initObjective } from "./data-model/objective";
import { initGuestTracker } from "./data-model/guest-tracker";
import { initRideTracker } from "./data-model/ride-tracker";
import { readValue } from "./helpers/storage";
import { ridesSetAllPrices } from "./actions/rides-set-all-prices";
import { openWindow } from "./ui/open-window";
import {
  SAVED_DATA,
  TICKS_PER_SECOND,
  TITLE,
  UI_LINE_LENGTH,
} from "./constants";
import { shopsSetAllPrices } from "./actions/shops-set-all-prices";

export function startup() {
  // Get some fixed park properties
	const parkProperties = initParkProperties();

  // Get and parse the objective
  const objective = initObjective(UI_LINE_LENGTH);

  // Initialise guest tracker
  const guestTracker = initGuestTracker();

  // Initialise the ride tracker
  const rideTracker = initRideTracker(objective, guestTracker);

  // Update ride and shop prices once per day
  let lastTick = 0;
  context.subscribe("interval.tick", function () {
    if (date.ticksElapsed < lastTick + TICKS_PER_SECOND) return;
    lastTick = date.ticksElapsed;

    const automatePrices: boolean =
      !!readValue(SAVED_DATA.automatePrices) || false;
    if (automatePrices && parkProperties.canSetRidePrices) {
      ridesSetAllPrices(rideTracker.getRides());
    }

    const automateShopPrices = !!readValue(SAVED_DATA.automateShopPrices) || false;
    if (automateShopPrices && parkProperties.canSetShopPrices) {
      shopsSetAllPrices(rideTracker.getRides());
    }
  });

  // Enable menu item and open window
  if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () =>
      openWindow(parkProperties, objective, guestTracker, rideTracker),
    );
  }
}
