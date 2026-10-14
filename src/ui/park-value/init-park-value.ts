import { ICONS, UI_VALUE_HEIGHT, WINDOW_WIDTH } from "../../constants";
import { TObjectiveAssistant } from "../../data-model/objective-assistant";
import { renderParkValueTable } from "./render-park-value-table";

export const initParkValue = (
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
      name: "labelParkValue",
      type: "label",
      x: objectiveAssistant.objective.parkValue ? 110 : 150,
      y: 50,
      width: 60,
      height: UI_VALUE_HEIGHT,
      text: "Park value:",
    },
    {
      name: "textParkValue",
      type: "label",
      x: objectiveAssistant.objective.parkValue ? 173 : 213,
      y: 50,
      width: WINDOW_WIDTH / 2,
      height: UI_VALUE_HEIGHT,
    },
    ...renderParkValueTable(objectiveAssistant, 55 + UI_VALUE_HEIGHT, clickRow),
  ];

  return {
    image: ICONS.chart,
    widgets,
  };
};
