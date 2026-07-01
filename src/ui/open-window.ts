import { openRideWindow } from "../actions/open-ride-window";
import { setRidePrice } from "../actions/rides-set-all-prices";
import { readValue } from "../helpers/storage";
import {
  BACKGROUND_COLOUR,
  FOREGROUND_COLOUR,
  TITLE,
  WINDOW_HEIGHT,
  WINDOW_HEIGHT_MIN,
  WINDOW_WIDTH,
} from "../constants";
import { TGuestTracker } from "../data-model/guest-tracker";
import { TObjectiveTarget } from "../data-model/objective";
import { TRideTracker } from "../data-model/ride-tracker";
import { displayRidePrices } from "./ride-prices/display-ride-prices";
import { displayShopPrices } from "./shop-prices/display-shop-prices";
import { displayGuests } from "./guests/display-guests";
import { displayParkValue } from "./park-value/display-park-value";
import { displayObjective } from "./objective/display-objective";
import { displayCoasters } from "./coasters/display-coasters";
import { displayAwards } from "./awards/display-awards";
import { displayStatRequirements } from "./stat-requirements/display-stat-requirements";
import { initTabs } from "./init-tabs";
import { tabChange } from "./tab-change";

export type TSortTable = {
  key: string;
  direction: number;
  set: Function;
};

export const openWindow = (
  parkProperties: { canSetRidePrices: boolean; canSetShopPrices: boolean },
  objective: TObjectiveTarget,
  guestTracker: TGuestTracker,
  rideTracker: TRideTracker,
) => {
  // Only allow one window to be open at a time
  for (let i = 0; i < ui.windows; i++) {
    if (ui.getWindow(i).title === TITLE) {
      ui.getWindow(i).bringToFront();
      return;
    }
  }

  // Initialise the sorting mechanic
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
  let selectedRide: number = -1;
  const clickStatList = (row: number) => (selectedRide = dataRideIDs[row]);
  // Closure of the ride ID's and prices to make the price list clickable
  let dataRidePrices: { id: number; price: number }[] = [];
  const ridePriceClick = (row: number, col: number) => {
    if (!parkProperties.canSetRidePrices) return;
    if (col < 3) return openRideWindow(dataRidePrices[row].id);
    setRidePrice(dataRidePrices[row].id, dataRidePrices[row].price, true);
  };
  // Closure of the shop ID's and prices to make the price list clickable
  let dataShopPrices: { id: number; price: number; isPrimary: boolean }[] = [];
  const shopPriceClick = (row: number, col: number) => {
    if (!parkProperties.canSetShopPrices) return;
    if (col !== 3) return openRideWindow(dataShopPrices[row].id);
    setRidePrice(
      dataShopPrices[row].id,
      dataShopPrices[row].price * 10,
      dataShopPrices[row].isPrimary,
    );
  };

  // Change tab button
  const goToObjectiveTab = (tab: number) => {
    window.tabIndex = tab;
  };

  // Prevent colour pickers from being changed
  const changeColourBack = (widgetName: string, colour: number) => {
    const w: ColourPickerWidget = window.findWidget(widgetName);
    w.colour = colour;
  };

  // Remember the active tab
  let savedTab = parseInt(readValue("tab") || "0");

  let window: Window;
  window = ui.openWindow({
    classification: "objective.assistant",
    title: TITLE,
    width: WINDOW_WIDTH,
    minWidth: WINDOW_WIDTH,
    maxWidth: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minHeight: WINDOW_HEIGHT_MIN,
    colours: [BACKGROUND_COLOUR, FOREGROUND_COLOUR],
    tabs: initTabs(
      parkProperties,
      objective,
      rideTracker,
      sortBy,
      goToObjectiveTab,
      clickRideList,
      ridePriceClick,
      shopPriceClick,
      changeColourBack,
      clickStatList,
    ),
    tabIndex: savedTab,
    onTabChange: () => {
      savedTab = tabChange(window, savedTab);
      selectedRide = -1;
    },
    onUpdate: () => {
      if (window.tabIndex === 0)
        displayObjective(window, objective, rideTracker);
      if (window.tabIndex === 1)
        dataRideIDs = displayGuests(window, objective, rideTracker, sortBy);
      if (window.tabIndex === 2)
        dataRideIDs = displayParkValue(window, objective, rideTracker, sortBy);
      if (window.tabIndex === 3)
        dataRideIDs = displayCoasters(window, objective, rideTracker, sortBy);
      if (window.tabIndex === 4)
        dataRidePrices = displayRidePrices(window, rideTracker, sortBy);
      if (window.tabIndex === 5)
        dataShopPrices = displayShopPrices(window, rideTracker, sortBy);
      if (window.tabIndex === 6)
        displayAwards(window, rideTracker, guestTracker);
      if (window.tabIndex === 7)
        dataRideIDs = displayStatRequirements(
          window,
          sortBy,
          rideTracker,
          selectedRide,
        );
    },
  });
};
