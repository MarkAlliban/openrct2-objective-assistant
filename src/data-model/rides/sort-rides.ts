import { TRideExtended } from "./get-extended-rides";

export type TSortTable = {
  key: string;
  direction: number;
};

export const sortRides = (rides: TRideExtended[], sortBy: TSortTable) => {
  return rides.sort((a, b) => {
    if (sortBy.key === "Ride")
      return a.ride.name > b.ride.name ? sortBy.direction : -sortBy.direction;
    if (sortBy.key === "Type" && a.typeData.name !== b.typeData.name)
      return (a.typeData.name || "") > (b.typeData.name || "")
        ? sortBy.direction
        : -sortBy.direction;
    if (
      sortBy.key === "Bonus" &&
      a.typeData.bonusValue !== b.typeData.bonusValue
    )
      return (a.typeData.bonusValue || 0) > (b.typeData.bonusValue || 0)
        ? -sortBy.direction
        : sortBy.direction;
    if (
      sortBy.key === "Riders" &&
      a.guestHistory.count !== b.guestHistory.count
    )
      return (a.guestHistory.count || 0) > (b.guestHistory.count || 0)
        ? -sortBy.direction
        : sortBy.direction;
    if (
      sortBy.key === "Value" &&
      a.finances?.valueCalculated !== b.finances?.valueCalculated
    )
      return (a.finances?.valueCalculated || 0) >
        (b.finances?.valueCalculated || 0)
        ? -sortBy.direction
        : sortBy.direction;
    if (sortBy.key === "Exc" && a.ride.excitement !== b.ride.excitement)
      return (a.ride.excitement || 0) > (b.ride.excitement || 0)
        ? -sortBy.direction
        : sortBy.direction;
    if (sortBy.key === "Length" && a.ride.rideLength !== b.ride.rideLength)
      return (a.ride.rideLength || 0) > (b.ride.rideLength || 0)
        ? -sortBy.direction
        : sortBy.direction;
    if (sortBy.key === "Age") {
      return a.ride.age > b.ride.age ? sortBy.direction : -sortBy.direction;
    }

    return a.ride.id > b.ride.id ? 1 : -1;
  });
};
