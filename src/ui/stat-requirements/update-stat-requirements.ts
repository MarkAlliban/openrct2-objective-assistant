import { renderRideTableRow } from "../helpers/render-ride-table-row";
import { updateWidgetList } from "../helpers/update-widget";
import { TRideInfo, TStatTracker } from "../../types";
import { updateStatRequirementsDetails } from "./update-stat-requirements-details";

export const updateStatRequirementValues = (
  window: Window,
  sortBy: any,
  statTracker: TStatTracker,
  selectedRide: number,
) => {
  const statRequirementsData: TRideInfo[] = statTracker.getStatRequirements();
  const rides = statRequirementsData.sort((a, b) => {
    if (sortBy.key === "Ride")
      return a.name > b.name ? sortBy.direction : -sortBy.direction;
    if (sortBy.key === "Type" && a.typeName !== b.typeName)
      return (a.typeName || "") > (b.typeName || "")
        ? sortBy.direction
        : -sortBy.direction;
    return a.id > b.id ? 1 : -1;
  });

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride) => renderRideTableRow(ride, ["name", "type", "reqs"])),
  );

  const ride = statRequirementsData.find(
    (ride: TRideInfo) => ride.id === selectedRide,
  );

  if (ride) updateStatRequirementsDetails(ride, window);

  // Return the ride IDs
  return rides.map((ride) => ride.id);
};
