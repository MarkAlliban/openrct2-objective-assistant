import { UI_VALUE_HEIGHT, WINDOW_WIDTH } from "../../constants";
import { TSortTable, TObjectiveTarget } from "../../types";
import { renderRideTable } from "../helpers/render-ride-table";

export const getParkValueWidgets = (
  clickRow: Function,
  sortBy: TSortTable,
  objective: TObjectiveTarget,
) => [
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
  {
    name: "labelParkValue",
    type: "label",
    x: objective.parkValue ? 110 : 150,
    y: 50,
    width: 60,
    height: UI_VALUE_HEIGHT,
    text: "Park value:",
  },
  {
    name: "textParkValue",
    type: "label",
    x: objective.parkValue ? 173 : 213,
    y: 50,
    width: WINDOW_WIDTH / 2,
    height: UI_VALUE_HEIGHT,
  },
  ...renderRideTable(
    55 + UI_VALUE_HEIGHT,
    ["Ride", "Riders", "Bonus", "Value"],
    clickRow,
    sortBy,
  ),
];
