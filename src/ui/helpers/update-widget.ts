import { fitListToWindow } from "./fit-list-to-window";

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

export const getWidgetDropdownValue = (
  window: Window,
  name: string,
): number => {
  const box: DropdownWidget = window.findWidget(name);
  return box ? box.selectedIndex : 0;
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
