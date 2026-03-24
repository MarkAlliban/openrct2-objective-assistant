import { UI_VALUE_HEIGHT, UI_VALUE_WIDTH, WARNING_COLOUR, WINDOW_WIDTH } from "../constants";
import { TSortTable } from "../types";
import { renderRideTable } from "./render-ride-table";

export const getGuestsWidgets = (clickRow: Function, sortBy: TSortTable) => [
  {
    name: "labelYear",
    type: "label",
    x: WINDOW_WIDTH - 130,
    y: 23,
    width: 52,
    height: UI_VALUE_HEIGHT,
    text: "Time left:",
    isVisible: false,
  },
  {
    name: "textYear",
    type: "label",
    x: WINDOW_WIDTH - 75,
    y: 23,
    width: 70,
    height: UI_VALUE_HEIGHT,
    text: "",
    isVisible: false,
  },
	{name: "labelHarder",
		type:"label",
		x: 5, y: 50,
		width: 50,
		height:UI_VALUE_HEIGHT,
		text:`${WARNING_COLOUR}HARDER!`,
		isVisible: false
	},
  {
    name: "labelGuests",
    type: "label",
    x: 75,
    y: 50,
    width: 42,
    height: UI_VALUE_HEIGHT,
    text: "Guests:",
  },
  {
    name: "textGuests",
    type: "label",
    x: 75 + 42 + 3,
    y: 50,
    width: UI_VALUE_WIDTH,
    height: UI_VALUE_HEIGHT,
  },
  {
    name: "labelSoftGuestCap",
    type: "label",
    x: 275 - 48 - 3,
    y: 50,
    width: 48,
    height: UI_VALUE_HEIGHT,
    text: "Soft cap:",
  },
  {
    name: "textSoftGuestCap",
    type: "label",
    x: 275,
    y: 50,
    width: UI_VALUE_WIDTH * 2,
    height: UI_VALUE_HEIGHT,
  },
  ...renderRideTable(
    55 + UI_VALUE_HEIGHT,
    ["Ride", "Type", "Bonus"],
    clickRow,
    sortBy,
  ),
];
