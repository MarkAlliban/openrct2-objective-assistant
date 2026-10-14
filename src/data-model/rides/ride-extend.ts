import { TObjectiveTarget } from "../objective";
import { TRideExtended } from "./get-extended-rides";
import { checkBuildingObjective } from "./check-building-objective";
import { checkRidePrices } from "./check-ride-prices";
import { checkStatRequirements } from "./check-stat-requirements";
import { trackScan } from "./track-scan";
import { TGuestCount } from "../guests/update-guest-count";
import { getRideType } from "./get-ride-type";

export const rideExtend = (
  ride: Ride,
  objective: TObjectiveTarget,
  guestCount: TGuestCount,
  duplicateRideTypes: number[],
): TRideExtended => {
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
  const trackerInfo = guestCount;
  const guestHistory = {
    count: trackerInfo?.count,
    error: trackerInfo?.error,
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
  return {
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
};
