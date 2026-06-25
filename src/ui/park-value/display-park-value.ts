import { SUCCESS_COLOUR } from "../../constants";
import { TObjectiveTarget } from "../../data-model/objective";
import { formatCurrency } from "../../helpers/format-currency";
import { TRideExtended, TRideTracker } from "../../data-model/ride-tracker";
import { getRideName, getRidersString, getValueString } from "../list-elements";
import { TSortTable } from "../open-window";
import {
  updateTimeData,
  updateWidget,
  updateWidgetList,
} from "../../helpers/update-widgets";

const renderParkValueTableRow = (ride: TRideExtended) => {
  const cols: string[] = [
    getRideName(ride),
    getRidersString(ride),
    `${ride.typeData.bonusValue}`,
    getValueString(ride),
  ];
  return cols;
};

export const displayParkValue = (
  window: Window,
  objective: TObjectiveTarget,
  rideTracker: TRideTracker,
  sortBy: TSortTable,
) => {
  // Get sorted ride list
  const rides = rideTracker
    .getRides()
    .filter((ride: TRideExtended) => ride.ride.classification === "ride")
    .sort((a: TRideExtended, b: TRideExtended) => {
      if (sortBy.key === "Ride")
        return a.ride.name > b.ride.name ? sortBy.direction : -sortBy.direction;
      if (
        sortBy.key === "Bonus" &&
        a.typeData.bonusValue !== b.typeData.bonusValue
      )
        return (a.typeData.bonusValue || 0) > (b.typeData.bonusValue || 0)
          ? -sortBy.direction
          : sortBy.direction;
      if (
        sortBy.key === "Riders" &&
        a.guestHistory.count !== b.guestHistory.count
      )
        return (a.guestHistory.count || 0) > (b.guestHistory.count || 0)
          ? -sortBy.direction
          : sortBy.direction;
      if (sortBy.key === "Value" && a.finances?.value !== b.finances?.value)
        return (a.finances?.value || 0) > (b.finances?.value || 0)
          ? -sortBy.direction
          : sortBy.direction;
      return a.ride.id > b.ride.id ? 1 : -1;
    });

  const guestsRow =
    park.guests > 0
      ? ["Guests", `${park.guests}`, "0", formatCurrency(park.guests * 70)]
      : null;

  // Update park value widget
  const text = objective.parkValue
    ? `${park.value >= objective.parkValue ? SUCCESS_COLOUR : ""}${formatCurrency(park.value)} / ${formatCurrency(objective.parkValue)}`
    : `${formatCurrency(park.value)}`;
  updateWidget(window, "textParkValue", text);

  // Update time limit indicator
  updateTimeData(window, objective, true);

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    [
      ...rides.map((ride: TRideExtended) => renderParkValueTableRow(ride)),
      guestsRow,
    ].filter(Boolean),
  );

  // Return the ride IDs
  return rides.map((ride: TRideExtended) => ride.ride.id);
};
