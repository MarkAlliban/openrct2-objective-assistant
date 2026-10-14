import {
  ICONS,
  UI_VALUE_HEIGHT,
  UI_VALUE_WIDTH,
  WINDOW_WIDTH,
} from "../../constants";
import { TObjectiveAssistant } from "../../data-model/objective-assistant";
import { renderCoastersTable } from "./render-coasters-table";

export const initCoasters = (
  objectiveAssistant: TObjectiveAssistant,
  clickRow: Function,
) => {
  const widgets = [
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
      x: objectiveAssistant.objective.rollercoastersToComplete
        ? 125
        : objectiveAssistant.objective.rollercoasters
          ? 130
          : 180,
      y: 50,
      width: objectiveAssistant.objective.rollercoastersToComplete
        ? 108
        : objectiveAssistant.objective.rollercoasters
          ? 103
          : 52,
      height: UI_VALUE_HEIGHT,
      text: objectiveAssistant.objective.rollercoastersToComplete
        ? "Completed coasters:"
        : objectiveAssistant.objective.rollercoasters
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
    ...renderCoastersTable(objectiveAssistant, 55 + UI_VALUE_HEIGHT, clickRow),
  ];

  return {
    image: ICONS.coasters,
    widgets,
  };
};
