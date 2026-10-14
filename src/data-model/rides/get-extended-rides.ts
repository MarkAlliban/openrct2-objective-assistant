import { TObjectiveTarget } from "../objective";
import { TTrackData } from "./track-scan";
import { rideExtend } from "./ride-extend";
import { TGuestCount } from "../guests/update-guest-count";
import { sortRides, TSortTable } from "./sort-rides";
import { TRideTypeData } from "./get-ride-type";

export type TBuildingObjective = {
  meetsExcitementRequirement: boolean;
  meetsLengthRequirement: boolean;
  meetsRequirements: boolean;
  duplicateType?: boolean;
};
export type TStatRequirementResult = {
  type: string;
  name: string;
  required: number;
  actual: number;
  met: boolean;
  overridden?: boolean;
};
export type TRideFinances = {
  value: number | null;
  agedValues: (number | null)[];
  maxPrices: (number | null)[];
  valueCalculated: number;
};

export interface TRideExtended {
  ride: Ride;
  // BUG: https://github.com/OpenRCT2/OpenRCT2/issues/26290
  // BreakdownType should include "none"; workaround here
  breakdown: BreakdownType | "none";
  typeData: TRideTypeData;
  tested: boolean; // Whether the ride is tested or not
  trackData: TTrackData[] | undefined; // Lengths for different segments (for Mobius coasters), underground percentage, inversions
  buildingObjective?: TBuildingObjective; // Scenario objectives that require building / finishing coasters
  guestHistory: {
    count: number | undefined;
    error: number | undefined;
  };
  statRequirementResults: TStatRequirementResult[];
  finances?: TRideFinances;
}

export const getExtendedRides = (
  objective: TObjectiveTarget,
  guestCount: TGuestCount[],
  sortBy: TSortTable,
) => {
  // Build an array of duplicate types
  const duplicateRideTypes = Object.entries(
    map.rides.reduce<Partial<Record<Ride["type"], number>>>((acc, { type }) => {
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .filter(([, count]) => count! > 1)
    .map(([type]) => parseInt(type));

  const rides = map.rides.map((ride) =>
    rideExtend(ride, objective, guestCount[ride.id], duplicateRideTypes),
  );

  // Find dupliate types for coaster-building objectives
  Object.values(
    rides.reduce<Record<string, TRideExtended[]>>((acc, ride) => {
      if (ride.buildingObjective?.meetsRequirements) {
        (acc[ride.ride.type] ??= []).push(ride);
      }
      return acc;
    }, {}),
  )
    .filter((group) => group.length > 1)
    .forEach((group) =>
      group.forEach((ride) => {
        ride.buildingObjective!.duplicateType = true;
      }),
    );

  return sortRides(rides, sortBy);
};
