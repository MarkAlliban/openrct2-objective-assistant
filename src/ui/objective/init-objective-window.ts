import { UI_VALUE_HEIGHT, UI_VALUE_WIDTH, WINDOW_WIDTH } from "../../constants";
import { TObjectiveTarget } from "../../data-model/objective";
import { formatCurrency } from "../../helpers/format-currency";

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

export const initObjectiveWindow = (
  objective: TObjectiveTarget,
  goToObjectiveTab: Function,
):WidgetDesc[] => {
  const widgets = [];
  let y: number = 65;

  widgets.push(
    {
      name: "labelYear",
      type: "label",
      x: WINDOW_WIDTH - 130,
      y: 23,
      width: 52,
      height: UI_VALUE_HEIGHT,
      text: "Time left:",
      isVisible: false,
    },
    {
      name: "textYear",
      type: "label",
      x: WINDOW_WIDTH - 75,
      y: 23,
      width: 70,
      height: UI_VALUE_HEIGHT,
      text: "",
      isVisible: false,
    },
  );

  widgets.push(
    addRequirementLabel("labelScenarioStatus", 40, "Status:", y),
    addRequirementValue("valueScenarioStatus", y),
  );
  y += UI_VALUE_HEIGHT;

  if (objective.guests) {
    widgets.push(
      addRequirementLabel("labelGuests", 42, "Guests:", y),
      addRequirementValue("valueGuests", y),
      addRequirementLabel("labelSoftCap", 48, "Soft cap:", y + UI_VALUE_HEIGHT),
      addRequirementValue("valueSoftCap", y + UI_VALUE_HEIGHT),
    );
    y += UI_VALUE_HEIGHT + UI_VALUE_HEIGHT;
  }
  if (objective.parkValue) {
    widgets.push(
      addRequirementLabel("labelParkValue", 60, "Park value:", y),
      addRequirementValue("valueParkValue", y),
    );
    y += UI_VALUE_HEIGHT;
    widgets.push(
      addRequirementLabel("labelParkValueTarget", 39, "Target:", y),
      addRequirementValue(
        "valueParkValueTarget",
        y,
        formatCurrency(objective.parkValue),
      ),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.rating) {
    widgets.push(
      addRequirementLabel("labelRating", 61, "Park rating:", y),
      addRequirementValue("valueRating", y),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.year) {
    widgets.push(
      addRequirementLabel("labelYear2", 52, "Time left:", y),
      addRequirementValue("valueYear2", y),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.rollercoasters) {
    widgets.push(
      addRequirementLabel("labelRollercoasters", 52, "Coasters:", y),
      addRequirementValue("valueRollercoasters", y),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.excitementTarget) {
    widgets.push(
      addRequirementLabel("labelExcitement", 64, "Excitement:", y),
      addRequirementValue("valueExcitement", y),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.lengthTarget) {
    widgets.push(
      addRequirementLabel("labelLength", 40, "Length:", y),
      addRequirementValue("valueLength", y),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.rideIncome) {
    widgets.push(
      addRequirementLabel("labelRideIncome", 64, "Ride income:", y),
      addRequirementValue("valueRideIncome", y),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.stallsIncome) {
    widgets.push(
      addRequirementLabel("labelStallsIncome", 74, "Stalls income:", y),
      addRequirementValue("valueStallsIncome", y),
    );
    y += UI_VALUE_HEIGHT;
  }
  if (objective.loan !== undefined) {
    widgets.push(
      addRequirementLabel("labelLoan", 30, "Loan:", y),
      addRequirementValue("valueLoan", y),
    );
  }

  widgets.push(
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
    {
      name: "goToObjectivePage",
      type: "button",
      x: 150,
      y:
        55 +
        Math.max(
          objective.description.length * 10 + 22,
          (widgets.length / 2) * UI_VALUE_HEIGHT + 20,
        ),
      width: 100,
      height: UI_VALUE_HEIGHT * 1.5,
      text: "More info",
      onClick: () => goToObjectiveTab(objective.tab || 0),
      isVisible: !!objective.tab,
    },
  );

  return widgets as WidgetDesc[];
};
