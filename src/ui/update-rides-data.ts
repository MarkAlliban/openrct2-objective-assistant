import { TGuestTracker } from "../data/guest-tracker";
import { getRideInfo } from "../data/ride-info";
import { TObjectiveTarget } from "../utils/get-objective";
import { getRideValue } from "../utils/get-ride-value";

export type TRideInfo = {
  name: string;
  id: number;
  classification?: string;
  type: number;
  status: string;
  breakdown: string;
  rideLength?: number;
  excitement?: number;
  value?: number;
  category?: string;
  ratingsMultipliers?: [number, number, number];
  typeName?: string;
  bonusValue?: number;
  valueCalculated?: number | null;
  duplicateType?: boolean;
  meetsExcitementRequirement?: boolean;
  meetsLengthRequirement?: boolean;
  meetsRequirements?: boolean;
  error?: number;
  count?: number;
  incomplete?: boolean;
};

const rideAddMoreInfo = (
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  ride: TRideInfo,
) => {
  // Add ride type info
  const rideInfo = getRideInfo(ride.type);
  ride.typeName = rideInfo.typeName;
  ride.bonusValue = rideInfo.bonusValue;
  ride.category = rideInfo.category;
  ride.ratingsMultipliers = rideInfo.ratingsMultipliers;

  // Add guest tracker numbers
  const trackerInfo = tracker.getGuestCount(ride.id);
  ride.count = trackerInfo.count;
  ride.error = trackerInfo.error;

  // Calculate ride value
  ride.valueCalculated = getRideValue(ride);

  // For non-coasters, we're finished here
  if (ride.category !== "rollercoaster") return ride;
  // If the objective isn't building 10 coasters, we're finished here
  if (!objective.excitementTarget && !objective.lengthTarget) return ride;

  // Check if the coaster matches the requirements
  if (objective.lengthTarget)
    ride.meetsLengthRequirement =
      (ride.rideLength || 0) >= objective.lengthTarget;
  if (objective.excitementTarget)
    ride.meetsExcitementRequirement =
      (ride.excitement || 0) >= objective.excitementTarget;
  ride.meetsRequirements =
    (!objective.lengthTarget || ride.meetsLengthRequirement) &&
    (!objective.excitementTarget || ride.meetsExcitementRequirement);

  return ride;
};

export const updateRidesData = (
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  types: string[],
  combineStalls = false,
  combineFacilities = false,
) => {
  const rides: TRideInfo[] = map.rides
    .filter((ride) => types.indexOf(ride.classification) !== -1)
    .map((ride) => rideAddMoreInfo(objective, tracker, ride));

  map.rides.forEach((ride) => {
    // const r = context.getRide(ride.id);
    console.log(ride.object);
    // const obj = context.getObject("ride", ride.object.name);
    // console.log(ride.id, obj);
  });

  // Combine the stalls
  const stalls: TRideInfo = {
    name: "Stalls",
    id: 1000001,
    type: 0,
    typeName: "-",
    status: "open",
    breakdown: "none",
    count: 0,
    bonusValue: 0,
    valueCalculated: 0,
  };
  if (combineStalls) {
    rides.forEach((ride: TRideInfo) => {
      if (ride.classification === "stall" && ride.status === "open") {
        stalls.count = (stalls.count || 0) + 1;
        stalls.bonusValue = (stalls.bonusValue || 0) + (ride.bonusValue || 0);
      }
    });
  }
  if (stalls && (stalls.count || 0) > 0) {
    stalls.typeName = `x${stalls.count}`;
    rides.push(stalls);
  }
  // Combine the facilities
  const facilities: TRideInfo = {
    name: "Facilities",
    id: 1000002,
    type: 0,
    typeName: "-",
    status: "open",
    breakdown: "none",
    count: 0,
    bonusValue: 0,
    valueCalculated: 0,
  };
  if (combineFacilities) {
    rides.forEach((ride) => {
      if (ride.classification === "facility" && ride.status === "open") {
        facilities.count = (facilities.count || 0) + 1;
        facilities.bonusValue =
          (facilities.bonusValue || 0) + (ride.bonusValue || 0);
      }
    });
  }
  if (facilities && (facilities.count || 0) > 0) {
    facilities.typeName = `x${facilities.count}`;
    rides.push(facilities);
  }
  // Add in the guests
  if (types.indexOf("guests") !== -1) {
    rides.push({
      name: "Guests",
      id: 1000000,
      type: 0,
      typeName: "Guests",
      status: "open",
      breakdown: "none",
      count: park.guests,
      bonusValue: 0,
      valueCalculated: park.guests * 7,
    });
  }

  // Return the filtered ride list
  return rides.filter((ride) => {
    if (combineFacilities && ride.classification === "facility") return false;
    if (combineStalls && ride.classification === "stall") return false;
    return true;
  });
};
