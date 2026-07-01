import { TStatRequirementResult } from ".";
import { TRideTypeData } from "../../data/get-ride-type";
import { TTrackData } from "./track-scan";

const HEIGHT_TO_UNITS = 4 / 3;

type TTrackInfo = {
  inversions: number;
  length: number;
  firstLength: number;
  underground: number;
  specialPieces: number;
};

export const checkStatRequirements = (
  ride: Ride,
  typeData: TRideTypeData,
  trackData: TTrackData[] | undefined,
): TStatRequirementResult[] => {
  if (!typeData.statRequirements) return [];

  const { statRequirements } = typeData;

  const {
    inversions = 0,
    length = 0,
    underground = 0,
    specialPieces = 0,
  } = trackData?.reduce(
    (a: TTrackInfo, segment) => ({
      inversions: a.inversions + segment.inversions,
      length: a.length + segment.length,
      underground: a.underground + segment.underground,
      specialPieces: a.specialPieces + segment.specialPieces,
      firstLength: a.firstLength || segment.length,
    }),
    {
      inversions: 0,
      length: 0,
      underground: 0,
      specialPieces: 0,
      firstLength: 0,
    },
  ) || {};

  const reqs: TStatRequirementResult[] = [];

  if (statRequirements.highestDropHeight)
    reqs.push({
      type: "highestDropHeight",
      name: "Drop height",
      required: statRequirements.highestDropHeight,
      actual: ride.highestDropHeight / HEIGHT_TO_UNITS,
      met:
        ride.highestDropHeight / HEIGHT_TO_UNITS >=
        statRequirements.highestDropHeight,
    });
  if (statRequirements.numberOfDrops)
    reqs.push({
      type: "numberOfDrops",
      name: "Number of drops",
      required: statRequirements.numberOfDrops,
      actual: ride.numDrops,
      met: ride.numDrops >= statRequirements.numberOfDrops,
    });
  if (statRequirements.maxSpeed)
    reqs.push({
      type: "maxSpeed",
      name: "Max speed",
      required: statRequirements.maxSpeed,
      actual: ride.maxSpeed,
      met: ride.maxSpeed >= statRequirements.maxSpeed,
    });
  if (statRequirements.maxLateralG)
    reqs.push({
      type: "maxLateralG",
      name: "Lateral G",
      required: statRequirements.maxLateralG,
      actual: ride.maxLateralGs,
      met: ride.maxLateralGs >= statRequirements.maxLateralG,
    });
  if (statRequirements.maxNegativeG)
    reqs.push({
      type: "maxNegativeG",
      name: "Negative vertical G",
      required: statRequirements.maxNegativeG,
      actual: ride.maxNegativeVerticalGs,
      met:
        ride.excitement > -1 &&
        ride.maxNegativeVerticalGs < statRequirements.maxNegativeG,
    });
  // BUG: For Mobius coasters we should count only the length of the first segment, but this isn't exposed by the plugin API.
  if (statRequirements.rideLength)
    reqs.push({
      type: "rideLength",
      name: "Ride length",
      required: statRequirements.rideLength,
      actual: ride.rideLength,
      met: ride.rideLength >= statRequirements.rideLength,
    });
  // BUG: Inversions isn't exposed by the plugin API. We count them by scanning the track but this also includes inversions that the train doesn't pass through.
  if (statRequirements.inversions)
    reqs.push({
      type: "inversions",
      name: "Inversions",
      required: statRequirements.inversions,
      actual: inversions,
      met: inversions >= statRequirements.inversions,
    });
  // BUG: Rides that do multiple laps (eg. Go-Karts) count total underground length, but the plugin API doesn't expose number of laps.
  if (statRequirements.maxUnderground)
    reqs.push({
      type: "maxUnderground",
      name: "Max underground percentage",
      required: statRequirements.maxUnderground,
      actual: underground / length,
      met: underground / length <= statRequirements.maxUnderground,
    });
  if (statRequirements.specialTrackPieces)
    reqs.push({
      type: "specialTrackPieces",
      name: "Special track pieces",
      required: statRequirements.specialTrackPieces || 0,
      actual: specialPieces,
      met: specialPieces >= (statRequirements.specialTrackPieces || 0),
    });

  const inversionOverrides = statRequirements.inversionOverrides;
  if (inversionOverrides && inversions) {
    reqs.forEach((req) => {
      if (inversionOverrides.includes(req.type)) {
        req.overridden = true;
      }
    });
  }

  return reqs;
};
