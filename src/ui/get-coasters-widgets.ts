import { UI_VALUE_HEIGHT, UI_VALUE_WIDTH, WINDOW_WIDTH } from "../constants";
import { TSortTable, TObjectiveTarget } from "../types";
import { renderRideTable } from "./render-ride-table";

export const getCoastersWidgets = (
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
    name: "labelCoasters",
    type: "label",
    x: objective.rollercoastersToComplete
      ? 125
      : objective.rollercoasters
        ? 130
        : 180,
    y: 50,
    width: objective.rollercoastersToComplete
      ? 108
      : objective.rollercoasters
        ? 103
        : 52,
    height: UI_VALUE_HEIGHT,
    text: objective.rollercoastersToComplete
      ? "Completed coasters:"
      : objective.rollercoasters
        ? "Different coasters:"
        : "Coasters:",
  },
  {
    name: "textCoasters",
    type: "label",
    x: 236,
    y: 50,
    width: UI_VALUE_WIDTH,
    height: UI_VALUE_HEIGHT,
  },
  ...renderRideTable(
    55 + UI_VALUE_HEIGHT,
    ["Ride", "Type", "Exc", "Length"],
    clickRow,
    sortBy,
  ),
];
