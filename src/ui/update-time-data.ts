import {
  TICKS_PER_MONTH,
  TICKS_PER_YEAR,
  WARNING_COLOUR,
  WARNING_DAYS,
} from "../constants";
import { convertTicksToDays } from "../utils/convert-ticks-to-days";
import { TObjectiveTarget } from "../types";

export const updateTimeData = (window: Window, objective: TObjectiveTarget, visible: boolean) => {
  if (objective.year) {
    const ticksElapsed =
      date.monthsElapsed * TICKS_PER_MONTH + date.monthProgress;
    const ticksRemaining = TICKS_PER_YEAR * objective.year - ticksElapsed;
    const daysRemaining = convertTicksToDays(ticksRemaining);
    const box: LabelWidget = window.findWidget("textYear");
    const label: LabelWidget = window.findWidget("labelYear");
    if (daysRemaining >= 0 && visible) {
      box.text = `${daysRemaining < WARNING_DAYS ? `{${WARNING_COLOUR}}` : ""}${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;
      box.isVisible = true;
      label.isVisible = true;
    } else if (box.isVisible) {
      box.isVisible = false;
      label.isVisible = false;
    }
  }
};
