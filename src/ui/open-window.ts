import { openRideWindow } from "../actions/open-ride-window";
import { setRidePrice } from "../actions/rides-set-all-prices";
import { readValue, saveValue } from "../helpers/storage";
import {
  BACKGROUND_COLOUR,
  FOREGROUND_COLOUR,
  ICON_AWARDS,
  ICON_BURGER,
  ICON_CHART,
  ICON_COASTERS,
  ICON_CROWD,
  ICON_MONEY,
  ICON_OBJECTIVE,
  ICON_STATS,
  TITLE,
  WINDOW_HEIGHT,
  WINDOW_HEIGHT_MIN,
  WINDOW_WIDTH,
} from "../constants";
import { TGuestTracker } from "../data-model/guest-tracker";
import { TObjectiveTarget } from "../data-model/objective";
import { TRideTracker } from "../data-model/ride-tracker";
import { initRidePrices } from "./ride-prices/init-ride-prices";
import { displayRidePrices } from "./ride-prices/display-ride-prices";
import { initShopPrices } from "./shop-prices/init-shop-prices";
import { displayShopPrices } from "./shop-prices/display-shop-prices";
import { initGuests } from "./guests/init-guests";
import { displayGuests } from "./guests/display-guests";
import { initParkValue } from "./park-value/init-park-value";
import { displayParkValue } from "./park-value/display-park-value";
import { initObjectiveWindow } from "./objective/init-objective-window";
import { displayObjective } from "./objective/display-objective";
import { initCoasters } from "./coasters/init-coasters";
import { displayCoasters } from "./coasters/display-coasters";
import { initAwards } from "./awards/init-awards";
import { displayAwards } from "./awards/display-awards";
import { initStatRequirements } from "./stat-requirements/init-stat-requirements";
import { updateWidget } from "../helpers/update-widgets";
import { displayStatRequirements } from "./stat-requirements/display-stat-requirements";

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
  let selectedRide: number = -1;
  const clickRideList = (row: number) => openRideWindow(dataRideIDs[row]);
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
    tabs: [
      {
        image: ICON_OBJECTIVE,
        widgets: initObjectiveWindow(objective, goToObjectiveTab),
      },
      {
        image: ICON_CROWD,
        widgets: initGuests(clickRideList, sortBy),
      },
      {
        image: ICON_CHART,
        widgets: initParkValue(clickRideList, sortBy, objective),
      },
      {
        image: ICON_COASTERS,
        widgets: initCoasters(clickRideList, sortBy, objective),
      },
      {
        image: ICON_MONEY,
        widgets: initRidePrices(
          rideTracker,
          ridePriceClick,
          sortBy,
          parkProperties,
        ),
      },
      {
        image: ICON_BURGER,
        widgets: initShopPrices(
          rideTracker,
          shopPriceClick,
          sortBy,
          parkProperties,
        ),
      },
      {
        image: ICON_AWARDS,
        widgets: initAwards(changeColourBack),
      },
      {
        image: ICON_STATS,
        widgets: initStatRequirements(clickStatList, sortBy),
      },
    ],
    tabIndex: savedTab,
    onTabChange: () => {
      if (window.tabIndex !== savedTab) {
        savedTab = window.tabIndex;
        saveValue("tab", savedTab.toString());
        if (savedTab === 6) {
          window.height = WINDOW_HEIGHT;
        }
        if (savedTab === 7) {
          selectedRide = -1;
          updateWidget(window, "labelRideName", "Select a ride");
        }
      }
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
