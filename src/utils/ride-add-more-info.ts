import { TObjectiveTarget, TRideInfo } from "../types";
import { getRideValue } from "../utils/get-ride-value";
import { TGuestTracker } from "../data/guest-tracker";
import { getRideType } from "../data/ride-type";

export const rideAddMoreInfo = (
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  ride: Ride,
): TRideInfo => {
  // Add ride type info
  const rideTypeInfo = getRideType(ride.type);

  // Add guest tracker numbers
  const trackerInfo = tracker.getGuestCount(ride.id);
  const guestCount = trackerInfo.count;
  const guestError = trackerInfo.error;

  // Calculate ride value (park value contribution)
  const valueCalculated = getRideValue(
    ride,
    rideTypeInfo.bonusValue,
    guestCount,
  );

  // For shops, parse the items and prices
  const shopItems = [];
  if (ride.classification === "stall" || ride.classification === "facility") {
    if (ride.object.shopItem < 255)
      shopItems.push({ id: ride.object.shopItem, price: ride.price[0] });
    if (ride.object.shopItemSecondary < 255)
      shopItems.push({
        id: ride.object.shopItemSecondary,
        price: ride.price[1],
      });
  }

  // Add all the new properties to the ride
  const rideUpdated: TRideInfo = {
    ...ride,
    ...rideTypeInfo,
    guestCount,
    guestError,
    valueCalculated,
    shopItems,
  };

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
