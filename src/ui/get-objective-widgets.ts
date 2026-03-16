import { TObjectiveTarget } from "../utils/get-objective";
import { formatCurrency } from "../utils/format-currency";
import { UI_VALUE_HEIGHT, UI_VALUE_WIDTH, WINDOW_WIDTH } from "../constants";

const addRequirementLabel = (
  name: string,
  width: number,
  text: string,
  y: number,
): LabelDesc => ({
  name,
  type: "label",
  x: WINDOW_WIDTH - 10 - width - UI_VALUE_WIDTH,
  y,
  width,
  height: UI_VALUE_HEIGHT,
  text,
});
const addRequirementValue = (
  name: string,
  y: number,
  text?: string,
): LabelDesc => ({
  name,
  type: "label",
  x: WINDOW_WIDTH - 5 - UI_VALUE_WIDTH,
  y,
  width: UI_VALUE_WIDTH,
  height: UI_VALUE_HEIGHT,
  text,
});

export const getObjectiveWidgets = (objective: TObjectiveTarget) => {
  const widgets: WidgetDesc[] = [];
  let y: number = 65;

  if (objective.guests) {
    widgets.push(addRequirementLabel("labelGuests", 42, "Guests:", y));
    widgets.push(addRequirementValue("valueGuests", y));
    y += UI_VALUE_HEIGHT;
  }
  if (objective.parkValue) {
    widgets.push(addRequirementLabel("labelParkValue", 60, "Park value:", y));
    widgets.push(addRequirementValue("valueParkValue", y));
    y += UI_VALUE_HEIGHT;
    widgets.push(addRequirementLabel("labelParkValueTarget", 39, "Target:", y));
    widgets.push(
      addRequirementValue(
        "valueParkValueTarget",
        y,
        formatCurrency(objective.parkValue),
      ),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.rating) {
    widgets.push(addRequirementLabel("labelRating", 61, "Park rating:", y));
    widgets.push(addRequirementValue("valueRating", y));
    y += UI_VALUE_HEIGHT;
  }
  if (objective.year) {
    widgets.push(addRequirementLabel("labelYear", 52, "Time left:", y));
    widgets.push(addRequirementValue("valueYear", y));
    y += UI_VALUE_HEIGHT;
  }
  if (objective.rollercoasters) {
    widgets.push(
      addRequirementLabel("labelRollercoasters", 52, "Coasters:", y),
    );
    widgets.push(addRequirementValue("valueRollercoasters", y));
    y += UI_VALUE_HEIGHT;
  }
  if (objective.excitementTarget) {
    widgets.push(addRequirementLabel("labelExcitement", 64, "Excitement:", y));
    widgets.push(addRequirementValue("valueExcitement", y));
    y += UI_VALUE_HEIGHT;
  }
  if (objective.lengthTarget) {
    widgets.push(addRequirementLabel("labelLength", 40, "Length:", y));
    widgets.push(addRequirementValue("valueLength", y));
    y += UI_VALUE_HEIGHT;
  }
  if (objective.rideIncome) {
    widgets.push(addRequirementLabel("labelRideIncome", 64, "Ride income:", y));
    widgets.push(addRequirementValue("valueRideIncome", y));
    y += UI_VALUE_HEIGHT;
  }
  if (objective.stallsIncome) {
    widgets.push(
      addRequirementLabel("labelStallsIncome", 74, "Stalls income:", y),
    );
    widgets.push(addRequirementValue("valueStallsIncome", y));
    y += UI_VALUE_HEIGHT;
  }
  if (objective.loan) {
    widgets.push(addRequirementLabel("labelLoan", 30, "Loan:", y));
    widgets.push(addRequirementValue("valueLoan", y));
    y += UI_VALUE_HEIGHT;
  }

  widgets.unshift(
    {
      name: "groupObjective",
      type: "groupbox",
      x: 5,
      y: 50,
      width: WINDOW_WIDTH - 10,
      height: Math.max(
        objective.description.length * 10 + 22,
        (widgets.length / 2) * UI_VALUE_HEIGHT + 20,
      ),
      text: "Objective",
    },
    {
      name: "labelObjective",
      type: "label",
      x: 10,
      y: 65,
      width: 350,
      height: 15,
      text: objective.description.join("\n"),
    },
  );

  return { widgets, height: y };
};
