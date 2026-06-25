import { SUCCESS_COLOUR } from "../../constants";
import { TObjectiveTarget } from "../../data-model/objective";
import { TRideExtended, TRideTracker } from "../../data-model/ride-tracker";
import {
  updateTimeData,
  updateWidget,
  updateWidgetList,
} from "../../helpers/update-widgets";
import {
  getExcitementString,
  getLengthString,
  getRideName,
  getTypeName,
} from "../list-elements";

const renderCoastersTableRow = (ride: TRideExtended) => {
  const cols: string[] = [
    getRideName(ride),
    getTypeName(ride),
    getExcitementString(ride),
    getLengthString(ride),
  ];
  return cols;
};

const getCoasterText = (
  objective: TObjectiveTarget,
  completed: number[],
  uniqueTypes: (string | undefined)[],
  rides: TRideExtended[],
) => {
  if (objective.rollercoastersToComplete)
    return `${completed.length >= objective.rollercoastersToComplete.length ? SUCCESS_COLOUR : ""}${completed.length}{WHITE} / ${objective.rollercoasters}`;
  else if (objective.rollercoasters)
    return `${uniqueTypes.length >= objective.rollercoasters ? SUCCESS_COLOUR : ""}${uniqueTypes.length}{WHITE} / ${objective.rollercoasters}`;
  else return `${rides.length}`;
};

export const displayCoasters = (
  window: Window,
  objective: TObjectiveTarget,
  rideTracker: TRideTracker,
  sortBy: any,
) => {
  const rides = rideTracker
    .getRides()
    .filter((ride: TRideExtended) => ride.typeData.category === "rollercoaster")
    .sort((a: TRideExtended, b: TRideExtended) => {
      if (sortBy.key === "Ride")
        return a.ride.name > b.ride.name ? sortBy.direction : -sortBy.direction;
      if (sortBy.key === "Type" && a.typeData.name !== b.typeData.name)
        return (a.typeData.name || "") > (b.typeData.name || "")
          ? sortBy.direction
          : -sortBy.direction;
      if (sortBy.key === "Exc" && a.ride.excitement !== b.ride.excitement)
        return (a.ride.excitement || 0) > (b.ride.excitement || 0)
          ? -sortBy.direction
          : sortBy.direction;
      if (sortBy.key === "Length" && a.ride.rideLength !== b.ride.rideLength)
        return (a.ride.rideLength || 0) > (b.ride.rideLength || 0)
          ? -sortBy.direction
          : sortBy.direction;
      return a.ride.id > b.ride.id ? 1 : -1;
    });

  // Count the qualifying coasters
  const coasterTypes = rides
    .filter((ride: TRideExtended) => ride.buildingObjective?.meetsRequirements)
    .map(
      (ride: TRideExtended) => ride.typeData.sameTypeAs || ride.typeData.name,
    );
  const uniqueTypes = coasterTypes.filter(
    (type: string, index: number) => coasterTypes.indexOf(type) === index,
  );
  // Count the completed partially-built coasters
  const completed =
    objective.rollercoastersToComplete?.filter(
      (id) =>
        rides.filter(
          (ride: TRideExtended) =>
            ride.ride.id === id && ride.buildingObjective?.meetsRequirements,
        ).length > 0,
    ) || [];

  // Update the coasters count
  const text = getCoasterText(objective, completed, uniqueTypes, rides);
  updateWidget(window, "textCoasters", text);

  // Update time limit indicator
  updateTimeData(window, objective, true);

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride: TRideExtended) => renderCoastersTableRow(ride)),
  );

  // Return the ride IDs
  return rides.map((ride: TRideExtended) => ride.ride.id);
};
