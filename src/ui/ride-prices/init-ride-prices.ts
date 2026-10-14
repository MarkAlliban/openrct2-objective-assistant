import { ridesSetAllPrices } from "../../actions/rides-set-all-prices";
import { readValue, saveValue } from "../../helpers/storage";
import { ICONS, SAVED_DATA, UI_VALUE_HEIGHT } from "../../constants";
import { renderRidePriceTable } from "./render-ride-price-table";
import { TObjectiveAssistant } from "../../data-model/objective-assistant";
import { setParkEntrance } from "../../actions/set-park-entrance";

const RIDE_PRICING_STRATEGY = {
  0: "Maximum prices",
  1: "Cheap prices",
  2: "All free",
};
const PARK_ENTRANCE_STRATEGY = {
  0: "Maximum affordable",
  1: "Good value",
  2: "Free",
};

export const initRidePrices = (
  objectiveAssistant: TObjectiveAssistant,
  ridePricesClick: Function,
) => {
  const automatePrices: boolean =
    !!readValue(SAVED_DATA.automatePrices) || false;
  const pricingStrategy: number = parseInt(
    readValue(SAVED_DATA.pricingStrategy) || "0",
  );
  const automateParkEntrance: boolean =
    !!readValue(SAVED_DATA.automateParkEntrance) || false;
  const parkEntranceStrategy: number = parseInt(
    readValue(SAVED_DATA.parkEntranceStrategy) || "0",
  );

  const widgets = [
    {
      name: "optionAutoPrices",
      type: "checkbox",
      x: 45,
      y: 50,
      width: 100,
      height: UI_VALUE_HEIGHT,
      text: `${objectiveAssistant.parkProperties.canSetRidePrices ? '' : '{GREY}'}Auto prices`,
      isChecked: automatePrices,
      onChange: (e: boolean) =>
        saveValue(SAVED_DATA.automatePrices, e ? "1" : ""),
    },
    {
      name: "optionAction",
      type: "dropdown",
      x: 15,
      y: 55 + UI_VALUE_HEIGHT,
      width: 110,
      height: UI_VALUE_HEIGHT,
      items: Object.values(RIDE_PRICING_STRATEGY),
      selectedIndex: pricingStrategy,
      onChange: (e: number) => {
        saveValue(SAVED_DATA.pricingStrategy, e.toString());
        if (
          (!!readValue(SAVED_DATA.automatePrices) || false) &&
          objectiveAssistant.parkProperties.canSetRidePrices
        ) {
          ridesSetAllPrices(objectiveAssistant.rides);
        }
      },
    },
    {
      name: "optionActionDo",
      type: "button",
      x: 125,
      y: 55 + UI_VALUE_HEIGHT,
      width: 30,
      height: UI_VALUE_HEIGHT,
      text: "Set",
      onClick: () => {
        if (objectiveAssistant.parkProperties.canSetRidePrices) {
          objectiveAssistant.updateAllRideData();
          ridesSetAllPrices(objectiveAssistant.rides);
        }
      },
    },

    {
      name: "optionAutoParkEntrance",
      type: "checkbox",
      x: 255,
      y: 50,
      width: 120,
      height: UI_VALUE_HEIGHT,
      text: `${objectiveAssistant.parkProperties.canSetParkEntrance ? '' : '{GREY}'}Auto park entrance`,
      isChecked: automateParkEntrance,
      onChange: (e: boolean) =>
        saveValue(SAVED_DATA.automateParkEntrance, e ? "1" : ""),
    },
    {
      name: "optionActionEntrance",
      type: "dropdown",
      x: 230,
      y: 55 + UI_VALUE_HEIGHT,
      width: 135,
      height: UI_VALUE_HEIGHT,
      items: Object.values(PARK_ENTRANCE_STRATEGY),
      selectedIndex: parkEntranceStrategy,
      onChange: (e: number) => {
        saveValue(SAVED_DATA.parkEntranceStrategy, e.toString());
        if (
          (!!readValue(SAVED_DATA.automateParkEntrance) || false) &&
          objectiveAssistant.parkProperties.canSetParkEntrance
        ) {
          setParkEntrance(objectiveAssistant.parkEntranceFee);
        }
      },
    },
    {
      name: "optionActionEntranceDo",
      type: "button",
      x: 365,
      y: 55 + UI_VALUE_HEIGHT,
      width: 30,
      height: UI_VALUE_HEIGHT,
      text: "Set",
      onClick: () => {
        if (objectiveAssistant.parkProperties.canSetParkEntrance) {
          setParkEntrance(objectiveAssistant.parkEntranceFee);
        }
      },
    },

    ...renderRidePriceTable(
      objectiveAssistant,
      60 + UI_VALUE_HEIGHT * 2,
      ridePricesClick,
    ),
  ];

  return {
    image: ICONS.money,
    widgets,
  };
};
