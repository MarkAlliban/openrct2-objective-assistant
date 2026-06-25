import { ERROR_COLOUR, INFO_COLOUR, SUCCESS_COLOUR } from "../../constants";
import {
  TRideExtended,
  TRideTracker,
  TStatRequirementResult,
} from "../../data-model/ride-tracker";
import { updateWidgetList } from "../../helpers/update-widgets";
import { getRideName, getTypeName } from "../list-elements";
import { showStatRequirementDetails } from "./show-stat-requirement-details";

const getRideRequirements = (
  rideRequirements: TStatRequirementResult[],
  statsCalculated: boolean,
) => {
  if (!rideRequirements.length) return "-";
  if (!statsCalculated) return `${INFO_COLOUR}???`;
  const requirementsMet = rideRequirements.filter(
    (r) => r.met || r.overridden,
  ).length;
  return `${requirementsMet === rideRequirements.length ? SUCCESS_COLOUR : ERROR_COLOUR}${requirementsMet} / ${rideRequirements.length}`;
};

const renderStatRequirementsRow = (ride: TRideExtended) => {
  const cols: string[] = [
    getRideName(ride),
    getTypeName(ride),
    getRideRequirements(ride.statRequirementResults || [], !!ride.tested),
  ];
  return cols;
};

export const displayStatRequirements = (
  window: Window,
  sortBy: any,
  rideTracker: TRideTracker,
  selectedRide: number,
) => {
  const rides = rideTracker
    .getRides()
    .filter((ride: TRideExtended) => ride.ride.classification === "ride")
    .sort((a: TRideExtended, b: TRideExtended) => {
      if (sortBy.key === "Ride")
        return a.ride.name > b.ride.name ? sortBy.direction : -sortBy.direction;
      if (sortBy.key === "Type" && a.typeData.name !== b.typeData.name)
        return (a.typeData.name || "") > (b.typeData.name || "")
          ? sortBy.direction
          : -sortBy.direction;
      return a.ride.id > b.ride.id ? 1 : -1;
    });

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride: TRideExtended) => renderStatRequirementsRow(ride)),
  );

  const ride = rides.find(
    (ride: TRideExtended) => ride.ride.id === selectedRide,
  );

  if (ride) showStatRequirementDetails(ride, window);

  // Return the ride IDs
  return rides.map((ride: TRideExtended) => ride.ride.id);
};
