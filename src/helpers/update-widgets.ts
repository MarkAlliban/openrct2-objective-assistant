import {
  TICKS_PER_MONTH,
  TICKS_PER_YEAR,
  UI_VALUE_HEIGHT,
  WARNING_COLOUR,
  WARNING_DAYS,
} from "../constants";
import { TObjectiveTarget } from "../data-model/objective";
import { convertTicksToDays } from "./convert-ticks-to-days";

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

const deepEquals = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (!(typeof a === "object" && typeof b === "object")) return false;
  if (a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!(Array.isArray(a) && Array.isArray(b))) return false;
    if (a.length !== b.length) return false;
    return a.every((el, index) => deepEquals(el, b[index]));
  }
  return true;
};

export const updateWidget = (
  window: Window,
  name: string,
  text: string | null,
  setVisible: boolean | null = null,
  position: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  } = {},
) => {
  const widget: LabelWidget = window.findWidget(name);
  if (!widget) return;
  if (text !== null && widget.text !== text) widget.text = text;
  if (setVisible && !widget.isVisible) widget.isVisible = true;
  if (setVisible === false && widget.isVisible) widget.isVisible = false;
  const { x, y, width, height } = position;
  if (x !== undefined && widget.x !== x) widget.x = x;
  if (y !== undefined && widget.y !== y) widget.y = y;
  if (width !== undefined && widget.width !== width) widget.width = width;
  if (height !== undefined && widget.height !== height) widget.height = height;
};

export const updateWidgetList = (
  window: Window,
  name: string,
  items: ListViewItem[],
) => {
  const widget: ListViewWidget = window.findWidget(name);
  if (!widget) return;

  const oldItems = widget.items;
  if (!deepEquals(oldItems, items)) widget.items = items;
  fitListToWindow(window, widget, items.length);
};

export const updateTimeData = (
  window: Window,
  objective: TObjectiveTarget,
  visible: boolean,
) => {
  if (objective.year) {
    const ticksElapsed =
      date.monthsElapsed * TICKS_PER_MONTH + date.monthProgress;
    const ticksRemaining = TICKS_PER_YEAR * objective.year - ticksElapsed;
    const daysRemaining = convertTicksToDays(ticksRemaining);
    if (daysRemaining >= 0 && visible) {
      updateWidget(
        window,
        "textYear",
        `${daysRemaining < WARNING_DAYS ? WARNING_COLOUR : ""}${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
        true,
      );
      updateWidget(window, "labelYear", null, true);
    } else {
      updateWidget(window, "textYear", null, false);
      updateWidget(window, "labelYear", null, false);
    }
  }
};
