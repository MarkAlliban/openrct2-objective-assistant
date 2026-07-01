import { TBuildingObjective } from ".";
import { TObjectiveTarget } from "../objective";

export const checkBuildingObjective = (
  objective: TObjectiveTarget,
  ride: Ride,
): TBuildingObjective | undefined => {
  if (!objective.lengthTarget && !objective.excitementTarget) return undefined;
  const meetsExcitementRequirement =
    !!objective.excitementTarget &&
    (ride.excitement || -1) >= objective.excitementTarget;
  const meetsLengthRequirement =
    !!objective.lengthTarget &&
    (ride.rideLength || 0) >= objective.lengthTarget;

  return {
    meetsExcitementRequirement,
    meetsLengthRequirement,
    meetsRequirements:
      (!objective.lengthTarget || meetsLengthRequirement) &&
      (!objective.excitementTarget || meetsExcitementRequirement),
  };
};
