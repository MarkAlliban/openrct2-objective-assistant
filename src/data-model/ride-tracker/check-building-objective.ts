import { TBuildingObjective } from ".";
import { TObjectiveTarget } from "../objective";

export const checkBuildingObjective = (
  objective: TObjectiveTarget,
  ride: Ride,
): TBuildingObjective | undefined => {
  if (!objective.lengthTarget && !objective.excitementTarget) return undefined;

	let meetsExcitementRequirement =
    !!objective.excitementTarget &&
    (ride.excitement || -1) >= objective.excitementTarget;
  let meetsLengthRequirement =
    !!objective.lengthTarget &&
    (ride.rideLength || 0) >= objective.lengthTarget;
  if (
    objective.rollercoastersToComplete &&
    !objective.rollercoastersToComplete.includes(ride.id)
  ) {
    meetsExcitementRequirement = false;
    meetsLengthRequirement = false;
  }

  return {
    meetsExcitementRequirement,
    meetsLengthRequirement,
    meetsRequirements:
      (!objective.lengthTarget || meetsLengthRequirement) &&
      (!objective.excitementTarget || meetsExcitementRequirement),
  };
};
