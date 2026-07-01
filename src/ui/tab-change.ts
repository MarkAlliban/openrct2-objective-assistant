import { WINDOW_HEIGHT } from "../constants";
import { saveValue } from "../helpers/storage";
import { updateWidget } from "../helpers/update-widgets";

export const tabChange = (window: Window, savedTab: number) => {
  if (window.tabIndex !== savedTab) {
    savedTab = window.tabIndex;
    saveValue("tab", savedTab.toString());
    if (savedTab === 6) {
      window.height = WINDOW_HEIGHT;
    }
    if (savedTab === 7) {
      updateWidget(window, "labelRideName", "Select a ride");
    }
  }
  return savedTab;
};
