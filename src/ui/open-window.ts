import { TGuestTracker } from "../data/guest-tracker";
import { getObjectiveWidgets } from "./objective/get-objective-widgets";
import { updateObjectiveValues } from "./objective/update-objective-values";
import { getParkValueWidgets } from "./park-value/get-park-value-widgets";
import { updateParkValue } from "./park-value/update-park-value";
import { getGuestsWidgets } from "./guests/get-guests-widgets";
import {
  TITLE,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_HEIGHT_MIN,
  BACKGROUND_COLOUR,
  FOREGROUND_COLOUR,
  ICON_OBJECTIVE,
  ICON_CHART,
  ICON_COASTERS,
  ICON_CROWD,
  ICON_MONEY,
  ICON_BURGER,
} from "../constants";
import { updateGuestsValues } from "./guests/update-guests-values";
import { TObjectiveTarget, TRidePrices, TSortTable } from "../types";
import { getCoastersWidgets } from "./coasters/get-coasters-widgets";
import { updateCoastersValues } from "./coasters/update-coasters-values";
import { getRidePricesWidgets } from "./ride-prices/get-ride-prices-widgets";
import { updateRidesPrices } from "./ride-prices/update-rides-prices";
import { openRideWindow } from "../actions/open-ride-window";
import {
  handleRidePrice,
  handleSetAllRides,
  handleSetAllShops,
  handleShopPrice,
} from "../actions/click-handlers";
import { getShopPricesWidgets } from "./shop-prices/get-shop-prices-widgets";
import { updateShopsPrices } from "./shop-prices/update-shops-prices";
import { getAwardsWidgets } from "./awards/get-awards-widgets";
import { updateAwardsValues } from "./awards/update-awards-values";
import { readValue, saveValue } from "../actions/shared-storage";

export const openWindow = (
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
) => {
  // Only allow one window to be open at a time
  for (let i = 0; i < ui.windows; i++) {
    if (ui.getWindow(i).title === TITLE) {
      ui.getWindow(i).bringToFront();
      return;
    }
  }

  //Initialise the sorting mechanic
  const sortBy: TSortTable = {
    key: "Ride",
    direction: 1,
    set: (key: string, direction: number) => {
      sortBy.key = key;
      sortBy.direction = direction;
    },
  };

  // Initialise guest thoughts
  const thoughts: Partial<Record<ThoughtType, number>> = {
    toilet: 0,
    bad_litter: 0,
    path_disgusting: 0,
    vandalism: 0,
    very_clean: 0,
    scenery: 0,
    hungry: 0,
    lost: 0,
    cant_find: 0,
  };
  const guests = map.getAllEntities("guest");
  for (const guest of guests) {
    for (const thought of guest.thoughts) {
      if (thought.freshness <= 5 && thoughts[thought.type] !== undefined) {
        thoughts[thought.type]!++;
      }
    }
  }

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
  let savedTab = readValue("tab") || 0;

  // Automate prices?
  let automatePrices = !!readValue("automatePrices") || false;
  let automateShopPrices = !!readValue("automateShopPrices") || false;

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
        widgets: getObjectiveWidgets(objective, goToObjectiveTab),
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
        widgets: getRidePricesWidgets(
          clickRidePrice,
          sortBy,
          setAllRides,
          automatePrices,
        ),
      },
      {
        image: ICON_BURGER,
        widgets: getShopPricesWidgets(
          clickShopPrice,
          sortBy,
          setAllShops,
          automateShopPrices,
        ),
      },
      {
        image: "awards",
        widgets: getAwardsWidgets(changeColourBack),
      },
    ],
    tabIndex: savedTab,
    onTabChange: () => {
      if (window.tabIndex !== savedTab) {
        savedTab = window.tabIndex;
        saveValue("tab", savedTab);
      }
    },
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
        updateAwardsValues(window, objective, tracker, thoughts);
    },
  });
};
