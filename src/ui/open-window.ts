import { guestTracker } from "../data/guest-tracker";
import { getObjective } from "../utils/get-objective";
import { getObjectiveWidgets } from "./get-objective-widgets";
import { updateObjectiveValues } from "./update-objective-values";
import { getParkValueWidgets } from "./get-park-value-widgets";
import { updateParkValue } from "./update-park-value";
import { getGuestsWidgets } from "./get-guests-widgets";
import {
  TITLE,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_HEIGHT_MIN,
  UI_LINE_LENGTH,
  BACKGROUND_COLOUR,
  FOREGROUND_COLOUR,
  ICON_OBJECTIVE,
  ICON_CHART,
  ICON_COASTERS,
  ICON_CROWD,
  ICON_MONEY,
  ICON_BURGER,
} from "../constants";
import { updateGuestsValues } from "./update-guests-values";
import { TRidePrices, TSortTable } from "../types";
import { getCoastersWidgets } from "./get-coasters-widgets";
import { updateCoastersValues } from "./update-coasters-values";
import { getRidePricesWidgets } from "./get-ride-prices-widgets";
import { updateRidesPrices } from "./update-rides-prices";
import { openRideWindow } from "../actions/open-ride-window";
import {
  handleRidePrice,
  handleSetAllRides,
  handleSetAllShops,
  handleShopPrice,
} from "../actions/click-handlers";
import { getShopPricesWidgets } from "./get-shop-prices-widgets";
import { updateShopsPrices } from "./update-shops-prices";
import { getAwardsWidgets } from "./get-awards-widgets";
import { updateAwardsValues } from "./update-awards-values";

export const openWindow = () => {
  // Only allow one window to be open at a time
  for (let i = 0; i < ui.windows; i++) {
    if (ui.getWindow(i).title === TITLE) {
      ui.getWindow(i).bringToFront();
      return;
    }
  }
  // Initialise guest tracker
  const tracker = guestTracker();
  context.subscribe("interval.day", function () {
    tracker.updateGuestCount();
  });
  //Initialise the sorting mechanic
  const sortBy: TSortTable = {
    key: "Ride",
    direction: 1,
    set: (key: string, direction: number) => {
      sortBy.key = key;
      sortBy.direction = direction;
    },
  };

  // Closure of the ride ID's to make the ride lists clickable
  let dataRideIDs: number[] = [];
  const clickRideList = (row: number) => openRideWindow(dataRideIDs[row]);
  // Closure of the ride ID's and prices to make the price list clickable
  let dataRidePrices: TRidePrices[] = [];
  const clickRidePrice = (row: number, col: number) =>
    handleRidePrice(window, dataRidePrices, row, col);
  const setAllRides = () => handleSetAllRides(window, dataRidePrices);
  // Closure of the shop ID's and prices to make the price list clickable
  let dataShopPrices: { id: number; price: number; basePrice: number }[] = [];
  const clickShopPrice = (row: number, col: number) =>
    handleShopPrice(window, dataShopPrices, row, col);
  const setAllShops = () => handleSetAllShops(window, dataShopPrices);

  // Get and parse the objective
  const objective = getObjective(UI_LINE_LENGTH);

  let window: Window;
  window = ui.openWindow({
    classification: "objective.progress",
    title: TITLE,
    width: WINDOW_WIDTH,
    minWidth: WINDOW_WIDTH,
    maxWidth: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minHeight: WINDOW_HEIGHT_MIN,
    colours: [BACKGROUND_COLOUR, FOREGROUND_COLOUR],
    tabs: [
      {
        image: ICON_OBJECTIVE,
        widgets: getObjectiveWidgets(objective),
      },
      {
        image: ICON_CROWD,
        widgets: getGuestsWidgets(clickRideList, sortBy),
      },
      {
        image: ICON_CHART,
        widgets: getParkValueWidgets(clickRideList, sortBy, objective),
      },
      {
        image: ICON_COASTERS,
        widgets: getCoastersWidgets(clickRideList, sortBy, objective),
      },
      {
        image: ICON_MONEY,
        widgets: getRidePricesWidgets(clickRidePrice, sortBy, setAllRides),
      },
      {
        image: ICON_BURGER,
        widgets: getShopPricesWidgets(clickShopPrice, sortBy, setAllShops),
      },
      {
        image: "awards",
        widgets: getAwardsWidgets(),
      },
    ],
    onUpdate: () => {
      if (window.tabIndex === 0)
        updateObjectiveValues(window, objective, tracker);
      if (window.tabIndex === 1)
        dataRideIDs = updateGuestsValues(window, objective, tracker, sortBy);
      if (window.tabIndex === 2)
        dataRideIDs = updateParkValue(window, objective, tracker, sortBy);
      if (window.tabIndex === 3)
        dataRideIDs = updateCoastersValues(window, objective, tracker, sortBy);
      if (window.tabIndex === 4)
        dataRidePrices = updateRidesPrices(window, objective, tracker, sortBy);
      if (window.tabIndex === 5)
        dataShopPrices = updateShopsPrices(window, objective, tracker, sortBy);
      if (window.tabIndex === 6)
        updateAwardsValues(window, objective, tracker);
    },
  });
};
