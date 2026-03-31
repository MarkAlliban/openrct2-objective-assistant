import { TGuestTracker } from "../data/guest-tracker";
import { TObjectiveTarget, TRideInfo, TRidePrices, TSortTable } from "../types";
import { renderRideTableRow } from "./render-ride-table-row";
import { ridesAddMoreInfo } from "../data/rides-add-more-info";
import { rideGetMaxPrices } from "../data/ride-get-max-prices";
import { updateWidgetList } from "./update-widget";

export const updateRidesPrices = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  sortBy: TSortTable,
): TRidePrices[] => {
  const rides: TRideInfo[] = ridesAddMoreInfo(objective, tracker, ["ride"])
    .sort((a, b) => {
      if (sortBy.key === "Ride")
        return a.name > b.name ? sortBy.direction : -sortBy.direction;
      if (sortBy.key === "Age" && a.age !== b.age)
        return (a.age || 0) > (b.age || 0)
          ? -sortBy.direction
          : sortBy.direction;
      return a.id > b.id ? 1 : -1;
    });
  rides.forEach((ride) => rideGetMaxPrices(ride, rides));

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride) => renderRideTableRow(ride, ["name", "age", "prices"])),
  );

  // Return the ride IDs
  return rides.map((ride) => ({
    id: ride.id,
    age: ride.age || 0,
    currentPrice: ride.price?.[0] || 0,
    prices: ride.maxPrices || [],
  }));
};
