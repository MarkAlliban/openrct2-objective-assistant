import { TGuestTracker } from "../data/guest-tracker";
import { TObjectiveTarget } from "../utils/get-objective";
import { formatCurrency } from "../utils/format-currency";
import { updateRidesData } from "./update-rides-data";
import { renderRideTableRow } from "./render-ride-table-row";
import { fitListToWindow } from "./fit-list-to-window";

export const updateParkValue = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
): number[] => {
  const rides = updateRidesData(objective, tracker, ["ride", "guests"]).sort(
    (a, b) => {
      if (
        a.valueCalculated === b.valueCalculated ||
        a.valueCalculated === null ||
        a.valueCalculated === undefined ||
        b.valueCalculated === null ||
        b.valueCalculated === undefined
      )
        return a.id > b.id ? 1 : -1;
      return a.valueCalculated > b.valueCalculated ? -1 : 1;
    },
  );

  // Update park value widget
  const label: LabelWidget = window.findWidget("textParkValue");
  label.text = `${formatCurrency(park.value)}${objective.parkValue ? ` / ${formatCurrency(objective.parkValue)}` : ""}`;

  // Update ride list widget
  const listview: ListViewWidget = window.findWidget("listRides");
  listview.items = rides.map((ride) =>
    renderRideTableRow(ride, ["name", "type", "riders", "bonus", "value"]),
  );
	fitListToWindow(window, listview, rides.length);

	// Return the ride IDs
  return rides.map((ride) => ride.id);
};
