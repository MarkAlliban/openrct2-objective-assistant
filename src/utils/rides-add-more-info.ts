import { TGuestTracker } from "../data/guest-tracker";
import { TObjectiveTarget, TRideInfo } from "../types";
import { rideAddMoreInfo } from "../utils/ride-add-more-info";
import { rideGetMaxPrices } from "./ride-get-max-prices";

export const ridesAddMoreInfo = (
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  types: string[],
  combineStalls = false,
  combineFacilities = false,
) => {
  // Filter and get more info on each of the rides
  const rides: TRideInfo[] = map.rides
    .filter((ride) => types.indexOf(ride.classification) !== -1)
    .map((ride) => rideAddMoreInfo(objective, tracker, ride));

  // Add prices and check for duplicate qualifying rides
  rides.forEach((ride) => {
    rideGetMaxPrices(ride, rides);
    if (!ride.meetsRequirements) return;
    const sameTypes = rides.filter(
      (r) =>
        (r.sameTypeAs || r.typeName) === (ride.sameTypeAs || ride.typeName) &&
        r.meetsRequirements,
    ).length;
    if (sameTypes > 1) ride.duplicateType = true;
  });

  // Combine the stalls
  const stalls: TRideInfo = {
    name: "Stalls",
    id: 1000001,
    type: 0,
    typeName: "-",
    status: "open",
    breakdown: "none",
    guestCount: 0,
    bonusValue: 0,
    valueCalculated: 0,
  };
  if (combineStalls) {
    rides.forEach((ride: TRideInfo) => {
      if (ride.classification === "stall" && ride.status === "open") {
        stalls.guestCount++;
        stalls.bonusValue += ride.bonusValue || 0;
      }
    });
  }
  if (stalls && stalls.guestCount > 0) {
    stalls.typeName = `x${stalls.guestCount}`;
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
    guestCount: 0,
    bonusValue: 0,
    valueCalculated: 0,
  };
  if (combineFacilities) {
    rides.forEach((ride) => {
      if (ride.classification === "facility" && ride.status === "open") {
        facilities.guestCount++;
        facilities.bonusValue = facilities.bonusValue += ride.bonusValue || 0;
      }
    });
  }
  if (facilities && facilities.guestCount > 0) {
    facilities.typeName = `x${facilities.guestCount}`;
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
      guestCount: park.guests,
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
