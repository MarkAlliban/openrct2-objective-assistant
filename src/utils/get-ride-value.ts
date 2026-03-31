import { TRideInfo } from "../types";

export const getRideValue = (ride: TRideInfo) =>
  (ride.value || 0) * ((ride.guestCount || 0) + (ride.bonusValue || 0) * 4);
