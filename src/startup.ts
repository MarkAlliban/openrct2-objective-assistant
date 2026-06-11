import { openWindow } from "./ui/open-window";
import { TITLE, UI_LINE_LENGTH } from "./constants";
import { guestTracker } from "./data/guest-tracker";
import { readValue } from "./actions/shared-storage";
import { ridesSetAllPrices } from "./utils/ride-pricing";
import { shopsSetAllPrices } from "./data/shop-get-items";
import { getObjective } from "./utils/get-objective";
import { statRequirementTracker } from "./data/stat-requirement-tracker";

export function startup() {
  // Get and parse the objective
  const objective = getObjective(UI_LINE_LENGTH);

  // Initialise guest tracker
  const tracker = guestTracker();

  // Initialise ride stat calculator
  const statTracker = statRequirementTracker();

  // Set scenario variables
  const noMoney = park.getFlag("noMoney");
  const unlockAllPrices = park.getFlag("unlockAllPrices"); // Can set ride and entrance prices
  const freeParkEntry = park.getFlag("freeParkEntry"); // Can set only ride prices
  const canSetRidePrices = !noMoney && (unlockAllPrices || freeParkEntry);
  const canSetShopPrices = !noMoney;

  context.subscribe("interval.day", function () {
    // Update ride prices once per day
    const automatePrices = !!readValue("automatePrices") || false;
    if (automatePrices && canSetRidePrices) {
      ridesSetAllPrices();
    }

    // Update shop prices once per day
    const automateShopPrices = !!readValue("automateShopPrices") || false;
    if (automateShopPrices && canSetShopPrices) {
      shopsSetAllPrices();
    }
  });

  if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () =>
      openWindow(objective, tracker, statTracker),
    );
  }
}
