import { TRideInfo, TStatRequirementResult } from "../../types";
import { rideGetSpecialData } from "./ride-get-special-data";
import { rideNeedsMapScan } from "./ride-needs-map-scan";

export const rideCheckStatRequirements = (
  ride: TRideInfo,
  nativeRide: Ride,
): TStatRequirementResult[] => {
  if (!ride.statRequirements) return [];

  const needsTrackScan = rideNeedsMapScan(ride);
  const { inversions, underground, specialPieces } = rideGetSpecialData(
    nativeRide,
    needsTrackScan,
  );

  const reqs: TStatRequirementResult[] = [];
  // BUG: https://github.com/OpenRCT2/OpenRCT2/issues/26696
  // highestDropHeight is reported as 33% too high
  const heightErrorFactor = 4 / 3;
  if (ride.statRequirements.highestDropHeight)
    reqs.push({
      type: "highestDropHeight",
      name: "Drop height",
      required: ride.statRequirements.highestDropHeight,
      actual: nativeRide.highestDropHeight / heightErrorFactor,
      met:
        nativeRide.highestDropHeight / heightErrorFactor >=
        ride.statRequirements.highestDropHeight,
    });
  if (ride.statRequirements.numberOfDrops)
    reqs.push({
      type: "numberOfDrops",
      name: "Number of drops",
      required: ride.statRequirements.numberOfDrops,
      actual: nativeRide.numDrops,
      met: nativeRide.numDrops >= ride.statRequirements.numberOfDrops,
    });
  if (ride.statRequirements.maxSpeed)
    reqs.push({
      type: "maxSpeed",
      name: "Max speed",
      required: ride.statRequirements.maxSpeed,
      actual: nativeRide.maxSpeed,
      met: nativeRide.maxSpeed >= ride.statRequirements.maxSpeed,
    });
  if (ride.statRequirements.maxLateralG)
    reqs.push({
      type: "maxLateralG",
      name: "Lateral G",
      required: ride.statRequirements.maxLateralG,
      actual: nativeRide.maxLateralGs,
      met: nativeRide.maxLateralGs >= ride.statRequirements.maxLateralG,
    });
  if (ride.statRequirements.maxNegativeG)
    reqs.push({
      type: "maxNegativeG",
      name: "Negative vertical G",
      required: ride.statRequirements.maxNegativeG,
      actual: nativeRide.maxNegativeVerticalGs,
      met:
        nativeRide.excitement > -1 &&
        nativeRide.maxNegativeVerticalGs < ride.statRequirements.maxNegativeG,
    });
  // BUG: For Mobius coasters we should count only the length of the first segment, but this isn't exposed by the plugin API.
  if (ride.statRequirements.rideLength)
    reqs.push({
      type: "rideLength",
      name: "Ride length",
      required: ride.statRequirements.rideLength,
      actual: nativeRide.rideLength,
      met: nativeRide.rideLength >= ride.statRequirements.rideLength,
    });
  // BUG: Inversions isn't exposed by the plugin API. We count them by scanning the map but this also includes inversions that the train doesn't make it through.
  if (ride.statRequirements.inversions)
    reqs.push({
      type: "inversions",
      name: "Inversions",
      required: ride.statRequirements.inversions,
      actual: inversions,
      met: inversions >= ride.statRequirements.inversions,
    });
  if (ride.statRequirements.maxUnderground)
    reqs.push({
      type: "maxUnderground",
      name: "Max underground percentage",
      required: ride.statRequirements.maxUnderground,
      actual: underground,
      met: underground < ride.statRequirements.maxUnderground,
    });
  if (ride.statRequirements.specialTrackPieces)
    reqs.push({
      type: "specialTrackPieces",
      name: "Special track pieces",
      required: ride.statRequirements.specialTrackPieces,
      actual: specialPieces,
      met: specialPieces >= ride.statRequirements.specialTrackPieces,
    });

  const inversionOverrides = ride.statRequirements.inversionOverrides;
  if (inversionOverrides && inversions) {
    reqs.forEach((req) => {
      if (inversionOverrides.includes(req.type)) {
        req.overridden = true;
      }
    });
  }

  return reqs;
};
