import { UI_VALUE_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants";

export const renderRideTable = (
  y: number,
  columns: string[],
  clickRow: Function,
  sortBy: { key: string; direction: number; set: Function },
) => {
  // Get the columns to display
  const cols = [
    {
      header: "Ride",
      canSort: true,
    },
    {
      header: "Type",
      canSort: true,
    },
    {
      header: "Age",
      width: 30,
      canSort: true,
    },
    {
      header: "Exc",
      width: 40,
      canSort: true,
    },
    {
      header: "Length",
      width: 60,
      canSort: true,
    },
    {
      header: "Riders",
      width: 40,
      canSort: true,
    },
    {
      header: "Bonus",
      width: 50,
      canSort: true,
    },
    {
      header: "Value",
      width: 80,
      canSort: true,
    },
  ].filter((x) => columns.indexOf(x.header) !== -1);
  if (columns.indexOf("Prices") > -1) {
    cols.push(
      {
        header: "Current",
        width: 55,
        canSort: false,
      },
      {
        header: "0-4m",
        width: 50,
        canSort: false,
      },
      {
        header: "5-12m",
        width: 50,
        canSort: false,
      },
      {
        header: "13-39m",
        width: 50,
        canSort: false,
      },
      {
        header: "40-63m",
        width: 55,
        canSort: false,
      },
    );
  }
  if (columns.indexOf("Shops") > -1) {
    cols.push(
      {
        header: "Name",
        canSort: true,
      },
      {
        header: "Current",
        width: 60,
        canSort: false,
      },
      {
        header: "Base",
        width: 50,
        canSort: false,
      },
      {
        header: "Recommend",
        width: 70,
        canSort: false,
      },
    );
  }
  // Add auto-width to any that don't have width specified
  const usedWidth = cols.reduce((a, c) => a + (c.width || 0), 0);
  const colsToShare = cols.reduce((a, c) => a + (c.width ? 0 : 1), 0);
  if (colsToShare)
    cols.forEach((c) => {
      if (!c.width) c.width = (WINDOW_WIDTH - 10 - usedWidth) / colsToShare;
    });

  // Make sorting buttons
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
  // Add the rides list
	// TODO: Stop the weird highlighting
  widgets.push({
    name: "listRides",
    type: "listview",
    x: 5,
    y: y + UI_VALUE_HEIGHT,
    width: WINDOW_WIDTH - 10,
    height: WINDOW_HEIGHT - y - UI_VALUE_HEIGHT - 5,
    isStriped: true,
    canSelect: false,
    columns: cols,
    items: [],
    onClick: (row: number, col: number) => {
      clickRow(row, col);
    },
  });
  return widgets;
};
