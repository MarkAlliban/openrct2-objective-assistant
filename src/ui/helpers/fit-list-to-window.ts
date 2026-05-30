import { UI_VALUE_HEIGHT } from "../../constants";

export const fitListToWindow = (
  window: Window,
  listview: ListViewWidget,
  n: number,
) => {
  const newHeight = window.height - 5 - listview.y;
  if (listview.height !== newHeight) {
    listview.height = newHeight;
  }
  if (window.height - listview.y < n * UI_VALUE_HEIGHT + 20) {
    if (listview.scrollbars !== "vertical") listview.scrollbars = "vertical";
  } else if (listview.scrollbars !== "none") listview.scrollbars = "none";
};
