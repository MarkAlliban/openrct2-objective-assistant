import { convertTicksToDays } from "../utils/convert-ticks-to-days";
import { TObjectiveTarget } from "../types";
import { formatCurrency } from "../utils/format-currency";
import {
  SUCCESS_COLOUR,
  TICKS_PER_MONTH,
  TICKS_PER_YEAR,
  ERROR_COLOUR,
  WARNING_COLOUR,
  WARNING_DAYS,
} from "../constants";
import { ridesAddMoreInfo } from "../data/rides-add-more-info";
import { TGuestTracker } from "../data/guest-tracker";
import { updateWidget } from "./update-widget";

export const updateObjectiveValues = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
) => {
  // Scenario status
  updateWidget(
    window,
    "valueScenarioStatus",
    scenario.status === "inProgress"
      ? "In progress"
      : scenario.status === "completed"
        ? `${SUCCESS_COLOUR}Completed`
        : `${ERROR_COLOUR}Failed`,
  );

  // Time left
  if (objective.year) {
    const ticksElapsed =
      date.monthsElapsed * TICKS_PER_MONTH + date.monthProgress;
    const ticksRemaining = TICKS_PER_YEAR * objective.year - ticksElapsed;
    const daysRemaining = convertTicksToDays(ticksRemaining);
    updateWidget(
      window,
      "valueYear",
      daysRemaining <= 0
        ? `${scenario.status === "failed" ? ERROR_COLOUR : ""}${-daysRemaining} day${daysRemaining === -1 ? "" : "s"} ago`
        : `${daysRemaining < WARNING_DAYS ? WARNING_COLOUR : ""}${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
    );
  }
  // Guest number
  if (objective.guests) {
    updateWidget(
      window,
      "valueGuests",
      `${park.guests >= objective.guests ? SUCCESS_COLOUR : ""}${park.guests} / ${objective.guests}`,
    );
    updateWidget(
      window,
      "valueSoftCap",
      `${park.suggestedGuestMaximum >= objective.guests ? SUCCESS_COLOUR : ""}${park.suggestedGuestMaximum}`,
    );
  }
  // Park value
  if (objective.parkValue) {
    updateWidget(
      window,
      "valueParkValue",
      `${park.value >= objective.parkValue ? SUCCESS_COLOUR : ""}${formatCurrency(park.value)}`,
    );
  }
  // Park rating
  if (objective.rating) {
    updateWidget(
      window,
      "valueRating",
      `${park.rating >= objective.rating ? SUCCESS_COLOUR : ""}${park.rating} / ${objective.rating}`,
    );
  }
  // Rollercoaster stats
  if (objective.rollercoasters) {
    const rides = ridesAddMoreInfo(objective, tracker, ["ride"]);
    const coasterTypes = rides
      .filter(
        (ride) => ride.category === "rollercoaster" && ride.meetsRequirements,
      )
      .map((ride) => ride.sameTypeAs || ride.typeName);
    const uniqueTypes = coasterTypes.filter(
      (t, i) => coasterTypes.indexOf(t) === i,
    );
    updateWidget(
      window,
      "valueRollercoasters",
      `${uniqueTypes.length} / ${objective.rollercoasters}`,
    );
  }
  if (objective.excitementTarget) {
    updateWidget(
      window,
      "valueExcitement",
      `${(objective.excitementTarget / 100).toFixed(2)}`,
    );
  }
  if (objective.lengthTarget) {
    updateWidget(
      window,
      "valueLength",
      context.formatString("{LENGTH}", objective.lengthTarget),
    );
  }
  // Ride income
  if (objective.rideIncome) {
    updateWidget(
      window,
      "valueRideIncome",
      formatCurrency(objective.rideIncome),
    );
  }
  // Stalls income
  if (objective.stallsIncome) {
    updateWidget(
      window,
      "valueStallsIncome",
      formatCurrency(objective.stallsIncome),
    );
  }
  // Bank loan
  if (objective.loan !== undefined) {
    updateWidget(
      window,
      "valueLoan",
      `${park.bankLoan <= objective.loan ? SUCCESS_COLOUR : ""}${formatCurrency(park.bankLoan)}`,
    );
  }
};
