import { ObjectiveAssistant } from "./data-model/objective-assistant";
import { openWindow } from "./ui/open-window";
import { TITLE } from "./constants";

export function startup() {
  const objectiveAssistant = new ObjectiveAssistant();

  // Initialise guest tracker
  // const guestTracker = initGuestTracker();

  // Initialise the ride tracker
  // const rideTracker = initRideTracker(
  //   objectiveAssistant.objective,
  //   guestTracker,
  // );

  // Update ride and shop prices once per day
  // let lastTick = 0;
  // context.subscribe("interval.tick", function () {
  //   if (date.ticksElapsed < lastTick + TICKS_PER_SECOND) return;
  //   lastTick = date.ticksElapsed;

  // const automatePrices: boolean =
  //   !!readValue(SAVED_DATA.automatePrices) || false;
  // if (automatePrices && objectiveAssistant.parkProperties.canSetRidePrices) {
  //   ridesSetAllPrices(rideTracker.getRides());
  // }

  // const automateShopPrices =
  //   !!readValue(SAVED_DATA.automateShopPrices) || false;
  // if (
  //   automateShopPrices &&
  //   objectiveAssistant.parkProperties.canSetShopPrices
  // ) {
  //   shopsSetAllPrices(rideTracker.getRides());
  // }
  // });

  // Enable menu item and open window
  if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () =>
      openWindow(objectiveAssistant),
    );
  }
}
