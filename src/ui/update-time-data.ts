import {
  TICKS_PER_MONTH,
  TICKS_PER_YEAR,
  WARNING_COLOUR,
  WARNING_DAYS,
} from "../constants";
import { convertTicksToDays } from "../utils/convert-ticks-to-days";
import { TObjectiveTarget } from "../types";
import { updateWidget } from "./update-widget";

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
        `${daysRemaining < WARNING_DAYS ? `{${WARNING_COLOUR}}` : ""}${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
        true,
      );
      updateWidget(window, "labelYear", null, true);
    } else {
      updateWidget(window, "textYear", null, false);
      updateWidget(window, "labelYear", null, false);
    }
  }
};
