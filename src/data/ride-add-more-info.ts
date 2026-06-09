import { TObjectiveTarget, TRideInfo } from "../types";
import { getRideValue } from "../utils/get-ride-value";
import { getRideType } from "./get-ride-type";
import { TGuestTracker } from "./guest-tracker";

export const rideAddMoreInfo = (
	objective: TObjectiveTarget,
	tracker: TGuestTracker | null,
	ride: Ride,
) => {
	// Add ride type info
	const rideInfo = getRideType(ride.type);
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
		flags: ride.flags,
		mode: ride.mode,
		...rideInfo,
	};

	rideUpdated.typeName = rideInfo.typeName;
	rideUpdated.category = rideInfo.category;
	rideUpdated.bonusValue = rideInfo.bonusValue;
	if (rideInfo.sameTypeAs) rideUpdated.sameTypeAs = rideInfo.sameTypeAs;
	rideUpdated.ratingsMultipliers = rideInfo.ratingsMultipliers;

	// Add guest tracker numbers
	const trackerInfo = tracker?.getGuestCount(rideUpdated.id);
	rideUpdated.guestCount = trackerInfo?.count;
	rideUpdated.guestError = trackerInfo?.error;

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
