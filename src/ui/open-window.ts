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
import { tabChange } from "./tab-change";
import { TObjectiveAssistant } from "../data-model/objective-assistant";
import * as w from "./ui";

const UPDATE_TICKS = 5;

let window: Window | undefined;
export const openWindow = (objectiveAssistant: TObjectiveAssistant) => {
  // Only allow one window to be open at a time
	if(typeof window !== 'undefined') return;

  // Closure of the ride ID's to make the ride lists clickable
  let dataRideIDs: number[] = [];
  const clickRideList = (row: number) => openRideWindow(dataRideIDs[row]);
  let selectedRide: number = -1;
  const clickStatList = (row: number) => (selectedRide = dataRideIDs[row]);
  // Closure of the ride ID's and prices to make the price list clickable
  let dataRidePrices: { id: number; price: number | null | undefined }[] = [];
  const ridePriceClick = (row: number, col: number) => {
    if (!objectiveAssistant.parkProperties.canSetRidePrices) return;
    if (col < 3) return openRideWindow(dataRidePrices[row].id);
    setRidePrice(dataRidePrices[row].id, dataRidePrices[row].price || 0, true);
  };
  // Closure of the shop ID's and prices to make the price list clickable
  let dataShopPrices: { id: number; price: number; isPrimary: boolean }[] = [];
  const shopPriceClick = (row: number, col: number) => {
    if (!objectiveAssistant.parkProperties.canSetShopPrices) return;
    if (col !== 3) return openRideWindow(dataShopPrices[row].id);
    setRidePrice(
      dataShopPrices[row].id,
      dataShopPrices[row].price * 10,
      dataShopPrices[row].isPrimary,
    );
  };

  // Change tab button
  const goToObjectiveTab = (tab: number) => {
    window!.tabIndex = tab;
  };

  // Prevent colour pickers from being changed
  const changeColourBack = (widgetName: string, colour: number) => {
    const w: ColourPickerWidget = window!.findWidget(widgetName);
    w.colour = colour;
  };

  // Remember the active tab
  let savedTab = parseInt(readValue("tab") || "0");

  let lastUpdated = 0;
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
      w.initObjectiveWindow(objectiveAssistant.objective, goToObjectiveTab),
      w.initGuests(objectiveAssistant, clickRideList),
      w.initParkValue(objectiveAssistant, clickRideList),
      w.initCoasters(objectiveAssistant, clickRideList),
      w.initRidePrices(objectiveAssistant, ridePriceClick),
      w.initShopPrices(objectiveAssistant, shopPriceClick),
      w.initAwards(changeColourBack),
      w.initStatRequirements(objectiveAssistant, clickStatList),
    ],
    tabIndex: savedTab,
    onTabChange: () => {
      savedTab = tabChange(window!, savedTab);
      selectedRide = -1;
      lastUpdated = 0;
    },
    onUpdate: () => {
      if (date.ticksElapsed < lastUpdated + UPDATE_TICKS) return;
      lastUpdated = date.ticksElapsed;
      const tabIndex = window!.tabIndex;
      if (tabIndex === 0) w.displayObjective(window!, objectiveAssistant);
      if (tabIndex === 1)
        dataRideIDs = w.displayGuests(window!, objectiveAssistant);
      if (tabIndex === 2)
        dataRideIDs = w.displayParkValue(window!, objectiveAssistant);
      if (tabIndex === 3)
        dataRideIDs = w.displayCoasters(window!, objectiveAssistant);
      if (tabIndex === 4)
        dataRidePrices = w.displayRidePrices(window!, objectiveAssistant);
      if (tabIndex === 5)
        dataShopPrices = w.displayShopPrices(window!, objectiveAssistant);
      if (tabIndex === 6) w.displayAwards(window!, objectiveAssistant);
      if (tabIndex === 7)
        dataRideIDs = w.displayStatRequirements(
          window!,
          objectiveAssistant,
          selectedRide,
        );
    },
    onClose: () => (window = undefined),
  });
};
