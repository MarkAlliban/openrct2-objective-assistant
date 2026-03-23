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
