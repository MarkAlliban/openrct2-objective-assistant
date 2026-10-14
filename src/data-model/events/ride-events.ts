import { TRACK_DESIGN_FLAG } from "../../constants";
import { TGuestCount } from "../guests/update-guest-count";
import { TObjectiveTarget } from "../objective";
import { TRideExtended } from "../rides/get-extended-rides";
import { rideExtend } from "../rides/ride-extend";

export const eventRideCreate = (
  event: GameActionEventArgs,
  rides: TRideExtended[],
  objective: TObjectiveTarget,
  guestCount: TGuestCount[],
): TRideExtended | null => {
  const args = event.args as RideCreateArgs;
  const { result }: { result: RideCreateActionResult } = event;
  if (result.ride === undefined) return null;
  if (((args.flags ?? 0) & TRACK_DESIGN_FLAG) > 0) return null;
  if (rides.find((ride: TRideExtended) => ride.ride.id === result.ride))
    return null;
  const ride = map.rides.find((ride: Ride) => ride.id === result.ride);
  if (!ride) return null;
  return rideExtend(ride, objective, guestCount[ride.id], []);
};

export const eventRideDemolish = (
  event: GameActionEventArgs,
  rides: TRideExtended[],
): number | null => {
  const args = event.args as RideDemolishArgs;
  if (((args.flags ?? 0) & TRACK_DESIGN_FLAG) > 0) return null;
  const rideIndex = rides.findIndex(
    (ride: TRideExtended) => ride.ride.id === args.ride,
  );
  return rideIndex === -1 ? null : rideIndex;
};
