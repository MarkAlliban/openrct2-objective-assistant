import { TGuestTracker } from "../data/guest-tracker";
import { TObjectiveTarget, TSortTable } from "../types";
import { formatCurrency } from "../utils/format-currency";
import { updateRidesData } from "./update-rides-data";
import { renderRideTableRow } from "./render-ride-table-row";
import { updateTimeData } from "./update-time-data";
import { SUCCESS_COLOUR, WARNING_COLOUR } from "../constants";
import { updateWidget } from "./update-widget";
import { updateWidgetList } from "./update-widget-list";

export const updateParkValue = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  sortBy: TSortTable,
): number[] => {
  const rides = updateRidesData(objective, tracker, ["ride", "guests"]).sort(
    (a, b) => {
      if (sortBy.key === "Ride")
        return a.name > b.name ? sortBy.direction : -sortBy.direction;
      if (sortBy.key === "Bonus" && a.bonusValue !== b.bonusValue)
        return (a.bonusValue || 0) > (b.bonusValue || 0)
          ? -sortBy.direction
          : sortBy.direction;
      if (sortBy.key === "Riders" && a.count !== b.count)
        return (a.count || 0) > (b.count || 0)
          ? -sortBy.direction
          : sortBy.direction;
      if (sortBy.key === "Value" && a.valueCalculated !== b.valueCalculated)
        return (a.valueCalculated || 0) > (b.valueCalculated || 0)
          ? -sortBy.direction
          : sortBy.direction;
      return a.id > b.id ? 1 : -1;
    },
  );

  // Update park value widget
  const text = objective.parkValue
    ? `${park.value < objective.parkValue ? `{${WARNING_COLOUR}}` : `{${SUCCESS_COLOUR}}`}${formatCurrency(park.value)}{WHITE} / ${formatCurrency(objective.parkValue)}`
    : `${formatCurrency(park.value)}`;
  updateWidget(window, "textParkValue", text);

  // Update time limit indicator
  updateTimeData(window, objective, !!objective.parkValue);

  // Update ride list widget
  updateWidgetList(window, "listRides", rides.map((ride) =>
    renderRideTableRow(ride, ["name", "riders", "bonus", "value"]),
  ));

  // Return the ride IDs
  return rides.map((ride) => ride.id);
};
