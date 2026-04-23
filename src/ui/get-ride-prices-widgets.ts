import { saveValue } from "../actions/shared-storage";
import { UI_VALUE_HEIGHT } from "../constants";
import { TSortTable } from "../types";
import { renderRideTable } from "./render-ride-table";

export const getRidePricesWidgets = (
  clickRow: Function,
  sortBy: TSortTable,
  clickAction: Function,
  automatePrices: boolean,
) => [
  {
    name: "optionClickModify",
    type: "checkbox",
    x: 5,
    y: 50,
    width: 115,
    height: UI_VALUE_HEIGHT,
    text: "Click prices to set?",
    isChecked: false,
  },
  {
    name: "optionAutoPrices",
    type: "checkbox",
    x: 140,
    y: 50,
    width: 100,
    height: UI_VALUE_HEIGHT,
    text: "Auto prices?",
    isChecked: automatePrices,
    onChange: (e: boolean) => {
      automatePrices = e;
      saveValue("automatePrices", e ? 1 : 0);
    },
  },
  {
    name: "optionAction",
    type: "dropdown",
    x: 250,
    y: 50,
    width: 100,
    height: UI_VALUE_HEIGHT,
    items: ["Actions...", "Optimise all", "Set long term", "Make all cheap", "Make all free"],
    selectedIndex: 0,
  },
  {
    name: "optionActionDo",
    type: "button",
    x: 350,
    y: 50,
    width: 30,
    height: UI_VALUE_HEIGHT,
    text: "Go!",
    onClick: clickAction,
  },

  ...renderRideTable(
    55 + UI_VALUE_HEIGHT,
    ["Ride", "Age", "Prices"],
    clickRow,
    sortBy,
  ),
];
