import { SUCCESS_COLOUR } from "../../constants";
import { TObjectiveTarget } from "../../data-model/objective";
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
} from "../../helpers/list-elements";
import { TObjectiveAssistant } from "../../data-model/objective-assistant";
import { TRideExtended } from "../../data-model/rides/get-extended-rides";

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
  objectiveAssistant: TObjectiveAssistant,
) => {
  const { objective } = objectiveAssistant;

  const rides = objectiveAssistant.rides.filter(
    (ride) => ride.typeData.category === "rollercoaster",
  );

  // Count the qualifying coasters
  const coasterTypes = rides
    .filter((ride) => ride.buildingObjective?.meetsRequirements)
    .map((ride) => ride.typeData.sameTypeAs || ride.typeData.name);
  const uniqueTypes = coasterTypes.filter(
    (type: string, index: number) => coasterTypes.indexOf(type) === index,
  );
  // Count the completed partially-built coasters
  const completed =
    objective.rollercoastersToComplete?.filter(
      (id) =>
        rides.filter(
          (ride) =>
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
    rides.map((ride) => renderCoastersTableRow(ride)),
  );

  // Return the ride IDs
  return rides.map((ride) => ride.ride.id);
};
