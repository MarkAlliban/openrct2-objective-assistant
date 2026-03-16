import { openWindow } from "./ui/open-window";
import { TITLE } from "./constants";

context.subscribe("interval.day", function () {
});

export function startup() {
  if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () => openWindow());
  }
}
