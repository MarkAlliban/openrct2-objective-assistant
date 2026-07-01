import { UI_VALUE_HEIGHT } from "../constants";
import { TSortTable } from "../ui/open-window";

export type TTableColumn = {
  header: string;
  width?: number;
  canSort?: boolean;
};

export const renderSortingButtons = (
  cols: TTableColumn[],
  sortBy: TSortTable,
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
            sortBy.set(
              col.header,
              sortBy.key === col.header ? -sortBy.direction : 1,
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
