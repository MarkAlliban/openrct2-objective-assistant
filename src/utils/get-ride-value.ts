import { TRideInfo } from "../ui/update-rides-data";

export const getRideValue = (ride: TRideInfo) =>
  (ride.value || 0) * ((ride.count || 0) + (ride.bonusValue || 0) * 4);
