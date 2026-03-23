import { TGuestTracker } from "../data/guest-tracker";
import { getRideInfo } from "../data/ride-info";
import { TObjectiveTarget, TRideInfo } from "../types";
import { getRideValue } from "../utils/get-ride-value";

const rideAddMoreInfo = (
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  ride: Ride,
) => {
  // Add ride type info
  const rideInfo = getRideInfo(ride.type);
  const rideUpdated: TRideInfo = {
    id: ride.id,
    name: ride.name,
    type: ride.type,
    classification: ride.classification,
    status: ride.status,
    breakdown: ride.breakdown,
    age: ride.age,
    price: ride.price,
    rideLength: ride.rideLength,
    excitement: ride.excitement,
    intensity: ride.intensity,
    nausea: ride.nausea,
    value: ride.value,
		lifecycleFlags: ride.flags,
    ...rideInfo,
  };

  rideUpdated.typeName = rideInfo.typeName;
  rideUpdated.category = rideInfo.category;
  rideUpdated.bonusValue = rideInfo.bonusValue;
  if (rideInfo.sameTypeAs) rideUpdated.sameTypeAs = rideInfo.sameTypeAs;
  rideUpdated.ratingsMultipliers = rideInfo.ratingsMultipliers;

  // Add guest tracker numbers
  const trackerInfo = tracker.getGuestCount(rideUpdated.id);
  rideUpdated.count = trackerInfo.count;
  rideUpdated.error = trackerInfo.error;

  // Calculate ride value (park value contribution)
  rideUpdated.valueCalculated = getRideValue(rideUpdated);

  // For shops, parse the items and prices
  if (
    rideUpdated.classification === "stall" ||
    rideUpdated.classification === "facility"
  ) {
    const shopItems = [];
    if (ride.object.shopItem < 255)
      shopItems.push({ id: ride.object.shopItem, price: ride.price[0] });
    if (ride.object.shopItemSecondary < 255)
      shopItems.push({
        id: ride.object.shopItemSecondary,
        price: ride.price[1],
      });
    rideUpdated.shopItems = shopItems;
  }

  // For non-coasters, we're finished here
  if (rideUpdated.category !== "rollercoaster") return rideUpdated;
  // If the objective isn't building coasters, we're finished here
  if (
    !objective.rollercoasters &&
    !objective.excitementTarget &&
    !objective.lengthTarget
  )
    return rideUpdated;

  // Check if the coaster matches the requirements
  if (objective.lengthTarget)
    rideUpdated.meetsLengthRequirement =
      (rideUpdated.rideLength || 0) >= objective.lengthTarget;
  if (objective.excitementTarget)
    rideUpdated.meetsExcitementRequirement =
      (rideUpdated.excitement || 0) >= objective.excitementTarget;
  rideUpdated.meetsRequirements =
    (!objective.lengthTarget || rideUpdated.meetsLengthRequirement) &&
    (!objective.excitementTarget || rideUpdated.meetsExcitementRequirement);

  return rideUpdated;
};

export const updateRidesData = (
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

  // Check for duplicate qualifying rides
  rides.forEach((ride) => {
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

export const updateRidePricesMultiple = (
  ride: TRideInfo,
  rides: TRideInfo[],
): TRideInfo => {
  // Calculate the value (for ticket price)
  const getAgeFactors = (value: number): number[] => [
    Math.floor(value + 30),
    Math.floor(value + 10),
    Math.floor(value),
    Math.floor(value * 0.75),
    Math.floor(value * 0.56),
    Math.floor(value * 0.42),
    Math.floor(value * 0.32),
    Math.floor(value * 0.16),
    Math.floor(value * 0.08),
    Math.floor(value * 0.56),
  ];

  // Initial value of excitement, intensity and nausea values
  let value =
    Math.floor(
      ((ride.excitement || 0) * (ride.ratingsMultipliers?.[0] || 0)) / 1024,
    ) +
    Math.floor(
      ((ride.intensity || 0) * (ride.ratingsMultipliers?.[1] || 0)) / 1024,
    ) +
    Math.floor(
      ((ride.nausea || 0) * (ride.ratingsMultipliers?.[2] || 0)) / 1024,
    );

  // Adjust for age, and reduce by 25% if there are multiple rides of the same type
  const numOfType = rides.filter(
    (r) => (r.sameTypeAs || r.typeName) === (ride.sameTypeAs || ride.typeName),
  ).length;
  let agedValues = getAgeFactors(value).map(
    (value) => value - Math.floor(value * (numOfType === 1 ? 0 : 0.25)),
  );
	// Reduce by 75% if there is an entrance fee
	// (Actually this applies per guest but if some have and some haven't, it's difficult to know whether to apply it or not. We use the current park status for simplicity)
  if (park.entranceFee) {
    agedValues.forEach((value, index) => {
      agedValues[index] = value - Math.floor(value * 0.75);
    });
  }

  // Calculate the max prices from the value
  ride.maxPrices = agedValues.map((value) => value * 2);
  return ride;
};
