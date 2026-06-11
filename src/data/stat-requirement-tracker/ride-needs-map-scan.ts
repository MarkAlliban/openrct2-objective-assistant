import { TRideInfo } from "../../types";

export const rideNeedsMapScan = (ride: TRideInfo) =>
  (ride.excitement ?? -1) > -1 &&
  !!(
    ride.statRequirements?.inversions ||
    ride.statRequirements?.inversionOverrides ||
    ride.statRequirements?.maxUnderground ||
    ride.statRequirements?.specialTrackPieces
  );
