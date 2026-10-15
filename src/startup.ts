import { ObjectiveAssistant } from "./data-model/objective-assistant";
import { openWindow } from "./ui/open-window";
import { TITLE } from "./constants";

export function startup() {
  const objectiveAssistant = new ObjectiveAssistant();

  // Enable menu item and open window
  if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () =>
      openWindow(objectiveAssistant),
    );
  }
}
