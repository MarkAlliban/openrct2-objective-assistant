import { TGuestTracker } from "../data/guest-tracker";
import { TObjectiveTarget, TSortTable } from "../types";
import { formatCurrency } from "../utils/format-currency";
import { ridesAddMoreInfo } from "../data/rides-add-more-info";
import { renderRideTableRow } from "./render-ride-table-row";
import { updateTimeData } from "./update-time-data";
import { SUCCESS_COLOUR, WARNING_COLOUR } from "../constants";
import { updateWidget, updateWidgetList } from "./update-widget";

export const updateParkValue = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  sortBy: TSortTable,
): number[] => {
  const rides = ridesAddMoreInfo(objective, tracker, ["ride", "guests"]).sort(
    (a, b) => {
      if (sortBy.key === "Ride")
        return a.name > b.name ? sortBy.direction : -sortBy.direction;
      if (sortBy.key === "Bonus" && a.bonusValue !== b.bonusValue)
        return (a.bonusValue || 0) > (b.bonusValue || 0)
          ? -sortBy.direction
          : sortBy.direction;
      if (sortBy.key === "Riders" && a.guestCount !== b.guestCount)
        return (a.guestCount || 0) > (b.guestCount || 0)
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
    ? `${park.value < objective.parkValue ? WARNING_COLOUR : SUCCESS_COLOUR}${formatCurrency(park.value)}{WHITE} / ${formatCurrency(objective.parkValue)}`
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
