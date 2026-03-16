import { convertTicksToDays } from "../utils/convert-ticks-to-days";
import { TObjectiveTarget } from "../utils/get-objective";
import { TICKS_PER_MONTH, TICKS_PER_YEAR } from "../constants";
import { ERROR_COLOUR, WARNING_COLOUR, WARNING_DAYS } from "../constants";

export const updateObjectiveValues = (window: Window, objective: TObjectiveTarget) => {
  if (objective.guests) {
    const box: TextBoxWidget = window.findWidget("valueGuests");
    box.text = `${park.guests} / ${objective.guests}`;
  }
  if (objective.parkValue) {
    const box: TextBoxWidget = window.findWidget("valueParkValue");
    box.text = context.formatString("{CURRENCY2DP}", park.value).split(".")[0];
  }
  if (objective.rating) {
    const box: TextBoxWidget = window.findWidget("valueRating");
    box.text = `${park.rating} / ${objective.rating}`;
  }
  if (objective.year) {
    const ticksElapsed =
      date.monthsElapsed * TICKS_PER_MONTH + date.monthProgress;
    const ticksRemaining = TICKS_PER_YEAR * objective.year - ticksElapsed;
    const daysRemaining = convertTicksToDays(ticksRemaining);
    const box: TextBoxWidget = window.findWidget("valueYear");
    box.text =
      daysRemaining <= 0
        ? `{${ERROR_COLOUR}}${-daysRemaining} days ago`
        : `${daysRemaining < WARNING_DAYS ? `{${WARNING_COLOUR}}` : ""}${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;
  }
  if (objective.rollercoasters) {
    const box: TextBoxWidget = window.findWidget("valueRollercoasters");
    box.text = `X / ${objective.rollercoasters}`;
  }
  if (objective.excitementTarget) {
    const box: TextBoxWidget = window.findWidget("valueExcitement");
    box.text = `${(objective.excitementTarget / 100).toFixed(2)}`;
  }
  if (objective.lengthTarget) {
    const box: TextBoxWidget = window.findWidget("valueLength");
    box.text = context.formatString("{LENGTH}", objective.lengthTarget);
  }

  if (objective.rideIncome) {
    const box: TextBoxWidget = window.findWidget("valueRideIncome");
    box.text = context.formatString("{CURRENCY2DP}", objective.rideIncome).split(".")[0];
  }
  if (objective.stallsIncome) {
    const box: TextBoxWidget = window.findWidget("valueStallsIncome");
    box.text = context.formatString("{CURRENCY2DP}", objective.stallsIncome).split(".")[0];
  }
  if (objective.loan) {
    const box: TextBoxWidget = window.findWidget("valueLoan");
    box.text = context.formatString("{CURRENCY2DP}", park.bankLoan).split(".")[0];
  }

};
