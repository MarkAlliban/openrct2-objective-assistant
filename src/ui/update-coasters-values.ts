import { SUCCESS_COLOUR, WARNING_COLOUR } from "../constants";
import { TGuestTracker } from "../data/guest-tracker";
import { TObjectiveTarget, TRideInfo } from "../types";
import { renderRideTableRow } from "./render-ride-table-row";
import { updateRidesData } from "./update-rides-data";
import { updateTimeData } from "./update-time-data";
import { updateWidget, updateWidgetList } from "./update-widget";

const getCoasterText = (
  objective: TObjectiveTarget,
  completed: number[],
  uniqueTypes: (string | undefined)[],
  rides: TRideInfo[],
) => {
  if (objective.rollercoastersToComplete)
    return `${completed.length < objective.rollercoastersToComplete.length ? `{${WARNING_COLOUR}}` : `{${SUCCESS_COLOUR}}`}${completed.length}{WHITE} / ${objective.rollercoasters}`;
  else if (objective.rollercoasters)
    return `${uniqueTypes.length < objective.rollercoasters ? `{${WARNING_COLOUR}}` : `{${SUCCESS_COLOUR}}`}${uniqueTypes.length}{WHITE} / ${objective.rollercoasters}`;
  else return `${rides.length}`;
};

export const updateCoastersValues = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  sortBy: any,
) => {
  const rides = updateRidesData(objective, tracker, ["ride"])
    .filter((ride) => ride.category === "rollercoaster")
    .sort((a, b) => {
      if (sortBy.key === "Ride")
        return a.name > b.name ? sortBy.direction : -sortBy.direction;
      if (sortBy.key === "Type" && a.typeName !== b.typeName)
        return (a.typeName || "") > (b.typeName || "")
          ? sortBy.direction
          : -sortBy.direction;
      if (sortBy.key === "Exc" && a.excitement !== b.excitement)
        return (a.excitement || 0) > (b.excitement || 0)
          ? -sortBy.direction
          : sortBy.direction;
      if (sortBy.key === "Length" && a.rideLength !== b.rideLength)
        return (a.rideLength || 0) > (b.rideLength || 0)
          ? -sortBy.direction
          : sortBy.direction;
      return a.id > b.id ? 1 : -1;
    });

  // Count the qualifying coasters
  const coasterTypes = rides
    .filter(
      (ride) => ride.category === "rollercoaster" && ride.meetsRequirements,
    )
    .map((ride) => ride.sameTypeAs || ride.typeName);
  const uniqueTypes = coasterTypes.filter(
    (t, i) => coasterTypes.indexOf(t) === i,
  );
  // Count the completed partially-built coasters
  const completed =
    objective.rollercoastersToComplete?.filter(
      (id) =>
        rides.filter((ride) => ride.id === id && ride.meetsRequirements)
          .length > 0,
    ) || [];

  // Update the coasters count
  const text = getCoasterText(objective, completed, uniqueTypes, rides);
  updateWidget(window, "textCoasters", text);

  // Update time limit indicator
  updateTimeData(window, objective, !!objective.rollercoasters);

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride) =>
      renderRideTableRow(ride, ["name", "type", "excitement", "length"]),
    ),
  );

  // Return the ride IDs
  return rides.map((ride) => ride.id);
};
