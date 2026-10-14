import { UI_VALUE_HEIGHT } from "../constants";
import { TObjectiveAssistant } from "../data-model/objective-assistant";

export type TTableColumn = {
  header: string;
  width?: number;
  canSort?: boolean;
};

export const renderSortingButtons = (
  objectiveASsistant: TObjectiveAssistant,
  cols: TTableColumn[],
  y: number,
) => {
  let X_SO_FAR = 5;
  const widgets: any[] = cols.map((col) => {
    X_SO_FAR += col.width || 0;
    return col.canSort
      ? {
          name: `sortBy${col.header}`,
          type: "button",
          x: X_SO_FAR - (col.width || 0),
          y,
          width: (col.width || 0) - 1,
          height: UI_VALUE_HEIGHT,
          text: `{BLACK}${col.header}`,
          onClick: () =>
            objectiveASsistant.setSortBy(
              col.header,
              objectiveASsistant.sortBy.key === col.header
                ? -objectiveASsistant.sortBy.direction
                : 1,
            ),
        }
      : {
          name: `sortBy${col.header}`,
          type: "label",
          x: X_SO_FAR - (col.width || 0),
          y,
          width: (col.width || 0) - 1,
          height: UI_VALUE_HEIGHT,
          text: `{BLACK}${col.header}`,
          alignment: "centred",
        };
  });
  return widgets;
};
