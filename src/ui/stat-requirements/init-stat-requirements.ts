import {
  INFO_COLOUR,
  UI_VALUE_HEIGHT,
  UI_VALUE_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from "../../constants";
import { TSortTable } from "../open-window";
import { renderStatRequirementsTable } from "./render-stat-requirements-table";

export const REQUIREMENT_DETAILS_WIDTH = 150;
export const ICON_SIZE = 16;

export const initStatRequirements = (
  clickRow: Function,
  sortBy: TSortTable,
) => {
  const newArray: number[] = [...Array(6).keys()];
  const requirementWidgets: any = [];
  newArray.forEach((index) => {
    requirementWidgets.push({
      name: `iconRequirement${index + 1}`,
      type: "button",
      x: WINDOW_WIDTH - REQUIREMENT_DETAILS_WIDTH,
      y: 58 + UI_VALUE_HEIGHT * 2 + ICON_SIZE * index,
      width: ICON_SIZE,
      height: ICON_SIZE,
      image: 29380,
      isVisible: false,
    });
    requirementWidgets.push({
      name: `labelRequirement${index + 1}`,
      type: "label",
      x: WINDOW_WIDTH - REQUIREMENT_DETAILS_WIDTH + 30,
      y: 58 + UI_VALUE_HEIGHT * 2 + ICON_SIZE * index + 6,
      width: REQUIREMENT_DETAILS_WIDTH,
      height: UI_VALUE_HEIGHT * 2,
      text: "",
      isVisible: false,
    });
  });

  return [
    {
      name: "labelRideName",
      type: "label",
      x: WINDOW_WIDTH - REQUIREMENT_DETAILS_WIDTH + 33,
      y: 75 + UI_VALUE_HEIGHT,
      width: 70,
      height: UI_VALUE_HEIGHT,
      text: "Select a ride",
    },
    {
      name: "labelStatRequirements",
      type: "label",
      x: 150,
      y: 50,
      width: UI_VALUE_WIDTH,
      height: UI_VALUE_HEIGHT,
      text: "Stat requirements",
    },
    {
      name: "groupDetails",
      type: "groupbox",
      x: WINDOW_WIDTH - REQUIREMENT_DETAILS_WIDTH - 5,
      y: 50 + UI_VALUE_HEIGHT,
      width: REQUIREMENT_DETAILS_WIDTH,
      height: 55,
      text: "Requirements",
    },
    ...requirementWidgets.flat(),
    {
      name: "overrideNote",
      type: "label",
      x: WINDOW_WIDTH - REQUIREMENT_DETAILS_WIDTH + 5,
      y: WINDOW_HEIGHT - 30,
      width: REQUIREMENT_DETAILS_WIDTH - 10,
      height: UI_VALUE_HEIGHT * 2,
      text: `${INFO_COLOUR}* Not required when ride\nhas at least one inversion`,
      isVisible: false,
    },

    ...renderStatRequirementsTable(
      55 + UI_VALUE_HEIGHT,
      clickRow,
      sortBy,
      WINDOW_WIDTH - REQUIREMENT_DETAILS_WIDTH - 5,
    ),
  ];
};
