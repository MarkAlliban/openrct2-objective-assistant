import { convertTicksToDays } from "../utils/convert-ticks-to-days";
import { TObjectiveTarget } from "../types";
import { formatCurrency } from "../utils/format-currency";
import { SUCCESS_COLOUR, TICKS_PER_MONTH, TICKS_PER_YEAR } from "../constants";
import { ERROR_COLOUR, WARNING_COLOUR, WARNING_DAYS } from "../constants";
import { updateRidesData } from "./update-rides-data";
import { TGuestTracker } from "../data/guest-tracker";

export const updateObjectiveValues = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
) => {
  // Scenario status
  const scenarioStatusBox: LabelWidget = window.findWidget(
    "valueScenarioStatus",
  );
  scenarioStatusBox.text =
    scenario.status === "inProgress"
      ? "In progress"
      : scenario.status === "completed"
        ? `{${SUCCESS_COLOUR}}Completed`
        : `{${ERROR_COLOUR}}Failed`;

	// Time left
  if (objective.year) {
    const ticksElapsed =
      date.monthsElapsed * TICKS_PER_MONTH + date.monthProgress;
    const ticksRemaining = TICKS_PER_YEAR * objective.year - ticksElapsed;
    const daysRemaining = convertTicksToDays(ticksRemaining);
    const box: LabelWidget = window.findWidget("valueYear");
    box.text =
      daysRemaining <= 0
        ? `{${scenario.status === "failed" ? ERROR_COLOUR : ""}}${-daysRemaining} day${daysRemaining === -1 ? "" : "s"} ago`
        : `${daysRemaining < WARNING_DAYS ? `{${WARNING_COLOUR}}` : ""}${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;
  }
	// Guest number
  if (objective.guests) {
    const box: LabelWidget = window.findWidget("valueGuests");
    box.text = `${park.guests >= objective.guests ? `{${SUCCESS_COLOUR}}` : ""}${park.guests} / ${objective.guests}`;
  }
	// Park value
  if (objective.parkValue) {
    const box: LabelWidget = window.findWidget("valueParkValue");
    box.text = `${park.value >= objective.parkValue ? `{${SUCCESS_COLOUR}}` : ""}${formatCurrency(park.value)}`;
  }
	// Park rating
	if (objective.rating) {
    const box: LabelWidget = window.findWidget("valueRating");
    box.text = `${park.rating >= objective.rating ? `{${SUCCESS_COLOUR}}` : ""}${park.rating} / ${objective.rating}`;
  }
	// Rollercoaster stats
  if (objective.rollercoasters) {
    const rides = updateRidesData(objective, tracker, ["ride"]);
    const box: LabelWidget = window.findWidget("valueRollercoasters");
    const coasterTypes = rides
      .filter(
        (ride) => ride.category === "rollercoaster" && ride.meetsRequirements,
      )
      .map((ride) => ride.sameTypeAs || ride.typeName);
    const uniqueTypes = coasterTypes.filter(
      (t, i) => coasterTypes.indexOf(t) === i,
    );
    box.text = `${uniqueTypes.length} / ${objective.rollercoasters}`;
  }
	if (objective.excitementTarget) {
    const box: LabelWidget = window.findWidget("valueExcitement");
    box.text = `${(objective.excitementTarget / 100).toFixed(2)}`;
  }
  if (objective.lengthTarget) {
    const box: LabelWidget = window.findWidget("valueLength");
    box.text = context.formatString("{LENGTH}", objective.lengthTarget);
  }
	// Ride income
  if (objective.rideIncome) {
    const box: LabelWidget = window.findWidget("valueRideIncome");
    box.text = formatCurrency(objective.rideIncome);
  }
	// Stalls income
	if (objective.stallsIncome) {
    const box: LabelWidget = window.findWidget("valueStallsIncome");
    box.text = formatCurrency(objective.stallsIncome);
  }
	// Bank loan
	if (objective.loan !== undefined) {
    const box: LabelWidget = window.findWidget("valueLoan");
    box.text = `${park.bankLoan <= objective.loan ? `{${SUCCESS_COLOUR}}` : ""}${formatCurrency(park.bankLoan)}`;
  }
};
