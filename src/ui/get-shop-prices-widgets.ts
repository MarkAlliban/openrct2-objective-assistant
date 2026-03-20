import { UI_VALUE_HEIGHT } from "../constants";
import { TSortTable } from "../types";
import { renderRideTable } from "./render-ride-table";

export const getShopPricesWidgets = (
  clickRow: Function,
  sortBy: TSortTable,
  clickAction: Function,
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
    name: "optionActionDo",
    type: "button",
    x: 50,
    y: 75,
    width: 130,
    height: UI_VALUE_HEIGHT,
    text: "Set all to recommended",
    onClick: clickAction,
  },
	{
		name: "labelTemperature",
		type: "label",
		x: 206,
		y: 50,
		width: 71,
    height: UI_VALUE_HEIGHT,
		text: "Temperature:"
	},
	{
    name: "optionTemperature",
    type: "dropdown",
    x: 285,
    y: 50,
    width: 120,
    height: UI_VALUE_HEIGHT,
    items: ["Annual average", "This month", "Any temp", "Right now"],
    selectedIndex: 0,
  },
	{
		name: "labelGuestMood",
		type: "label",
		x: 235,
		y: 65,
		width: 42,
    height: UI_VALUE_HEIGHT,
		text: "Guests:"
	},
  {
    name: "optionGuestMood",
    type: "dropdown",
    x: 285,
    y: 65,
    width: 120,
    height: UI_VALUE_HEIGHT,
    items: ["Happy guests", "Average guests", "Unhappy guests"],
    selectedIndex: 0,
  },
	{
		name: "labelGreediness",
		type: "label",
		x: 226,
		y: 80,
		width: 51,
    height: UI_VALUE_HEIGHT,
		text: "Strategy:"
	},
  {
    name: "optionGreediness",
    type: "dropdown",
    x: 285,
    y: 80,
    width: 120,
    height: UI_VALUE_HEIGHT,
    items: ["Maximise sales", "Profitise", "Quite expensive", "Price gouge"],
    selectedIndex: 0,
  },
  ...renderRideTable(85 + UI_VALUE_HEIGHT, ["Shops"], clickRow, sortBy),
];
