import { TGuestTracker } from "../guest-tracker";
import { TObjectiveTarget } from "../objective";
import { checkBuildingObjective } from "./check-building-objective";
import { checkRidePrices } from "./check-ride-prices";
import { checkStatRequirements } from "./check-stat-requirements";
import { getRideType, TRideTypeData } from "../../data/get-ride-type";
import { trackScan, TTrackData } from "./track-scan";
import { TRACK_DESIGN_FLAG } from "../../constants";

const RIDE_UPDATE_TICKS = 40;

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
    count: number;
    error: number;
  };
  statRequirementResults: TStatRequirementResult[];
  finances?: TRideFinances;
}

export type TRideTracker = {
  getRides: Function;
  updateAllRideData: Function;
};

const rideExtend = (
  ride: Ride,
  objective: TObjectiveTarget,
  guestTracker: TGuestTracker,
  duplicateRideTypes: number[],
) => {
  // Get the ride type data
  const typeData = getRideType(ride.type);

  // Whether the ride has its stats calculated or not
  const tested =
    (ride.excitement || -1) > -1 &&
    (ride.intensity || -1) > -1 &&
    (ride.nausea || -1) > -1;

  // For rollercoaster building objectives, check if it meets them
  const buildingObjective = checkBuildingObjective(objective, ride);

  // Get the guest history for this ride
  const trackerInfo = guestTracker.getGuestCount(ride.id);
  const guestHistory = {
    count: trackerInfo.count,
    error: trackerInfo.error,
  };

  // Scan the track to get Mobius segment lengths, inversions, underground percentage
  const trackData = trackScan(ride, typeData);

  // Check the stat requirements
  const statRequirementResults = checkStatRequirements(
    ride,
    typeData,
    trackData,
  );

  // Calculate the maximum prices
  const finances = checkRidePrices(
    ride,
    typeData,
    duplicateRideTypes.includes(ride.type),
    guestHistory.count,
  );

  // Build the extended ride info object
  const rideExtended: TRideExtended = {
    ride,
    breakdown: ride.breakdown,
    typeData,
    tested,
    trackData,
    buildingObjective,
    guestHistory,
    statRequirementResults,
    finances,
  };

  return rideExtended;
};

export const initRideTracker = (
  objective: TObjectiveTarget,
  guestTracker: TGuestTracker,
) => {
  let rides: TRideExtended[] = [];

  const updateAllRideData = () => {
    // Build an array of duplicate types
    const duplicateRideTypes = Object.entries(
      map.rides.reduce<Partial<Record<Ride["type"], number>>>(
        (acc, { type }) => {
          acc[type] = (acc[type] ?? 0) + 1;
          return acc;
        },
        {},
      ),
    )
      .filter(([, count]) => count! > 1)
      .map(([type]) => parseInt(type));

    rides = map.rides.map((ride) =>
      rideExtend(ride, objective, guestTracker, duplicateRideTypes),
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
  };

  const addRide = (rideId: number) => {
    if (rides.find((ride: TRideExtended) => ride.ride.id === rideId)) return;
    const ride = map.rides.find((ride: Ride) => ride.id === rideId);
    if (!ride) return;
    const rideExtended = rideExtend(ride, objective, guestTracker, []);
    rides.push(rideExtended);
  };

  const removeRide = (rideId: number) => {
    const rideIndex = rides.findIndex(
      (ride: TRideExtended) => ride.ride.id === rideId,
    );
    if (rideIndex === -1) return;
    rides.splice(rideIndex, 1);
  };

  const getRides = () => rides;

  // Initial load
  updateAllRideData();

  // Update all rides once per day
  let lastTick = 0;
  context.subscribe("interval.tick", () => {
    if (date.ticksElapsed < lastTick + RIDE_UPDATE_TICKS) return;
    lastTick = date.ticksElapsed;

    updateAllRideData();
  });

  // Update rides when a new one is built
  context.subscribe("action.execute", (event) => {
    // Create a new ride
    if (event.action === "ridecreate") {
      const args = event.args as RideCreateArgs;
      const { result }: { result: RideCreateActionResult } = event;
      if (result.ride === undefined) return;
      if (((args.flags ?? 0) & TRACK_DESIGN_FLAG) > 0) return;
      addRide(result.ride);
    }

    // Demolish a ride
    if (event.action === "ridedemolish") {
      const args = event.args as RideDemolishArgs;
      if (((args.flags ?? 0) & TRACK_DESIGN_FLAG) > 0) return;
      removeRide(args.ride);
    }
  });

  return { getRides, updateAllRideData };
};
