import { UI_VALUE_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants";
import { renderSortingButtons } from "../../helpers/render-sorting-buttons";

export const renderShopTable = (
  y: number,
  clickRow: Function,
  sortBy: { key: string; direction: number; set: Function },
  tableWidth = WINDOW_WIDTH,
) => {
  // Get the columns to display
  const cols = [
    {
      header: "Name",
      canSort: true,
    },
    {
      header: "Item",
      width: 80,
      canSort: true,
    },
    {
      header: "Current",
      width: 60,
      canSort: false,
    },
    {
      header: "Recommend",
      width: 70,
      canSort: false,
    },
    {
      header: "Sales",
      width: 60,
      canSort: false,
    },
  ];

  // Add auto-width to any that don't have width specified
  const usedWidth = cols.reduce((a, c) => a + (c.width || 0), 0);
  const colsToShare = cols.reduce((a, c) => a + (c.width ? 0 : 1), 0);
  if (colsToShare)
    cols.forEach((c) => {
      if (!c.width) c.width = (tableWidth - 10 - usedWidth) / colsToShare;
    });

  // Make sorting buttons
  const widgets = renderSortingButtons(cols, sortBy, y);

  // Add the rides list
  widgets.push({
    name: "listShops",
    type: "listview",
    x: 5,
    y: y + UI_VALUE_HEIGHT,
    width: tableWidth - 10,
    height: WINDOW_HEIGHT - y - UI_VALUE_HEIGHT - 5,
    isStriped: true,
    canSelect: false,
    columns: cols,
    items: [],
    onClick: (row: number, col: number) => clickRow(row, col),
  });

  return widgets;
};
