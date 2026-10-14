import { ERROR_COLOUR, INFO_COLOUR, SUCCESS_COLOUR } from "../../constants";
import { updateWidgetList } from "../../helpers/update-widgets";
import { getRideName, getTypeName } from "../../helpers/list-elements";
import { TObjectiveAssistant } from "../../data-model/objective-assistant";
import {
  TRideExtended,
  TStatRequirementResult,
} from "../../data-model/rides/get-extended-rides";
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
  objectiveAssistant: TObjectiveAssistant,
  selectedRide: number,
) => {
  const rides = objectiveAssistant.rides.filter(
    (ride) => ride.ride.classification === "ride",
  );

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride) => renderStatRequirementsRow(ride)),
  );

  const ride = rides.find((ride) => ride.ride.id === selectedRide);

  if (ride) showStatRequirementDetails(ride, window);

  // Return the ride IDs
  return rides.map((ride) => ride.ride.id);
};
