import { TRACK_DESIGN_FLAG } from "../../constants";
import { TRideInfo } from "../../types";
import { rideAddMoreInfo } from "../ride-add-more-info";
import { ridesAddMoreInfo } from "../rides-add-more-info";
import { rideCheckStatRequirements } from "./ride-check-stat-requirements";

const ACTIONS_CAN_AFFECT_UNDERGROUND_PERCENTAGE = new Set([
  "largesceneryplace",
  "largesceneryremove",
  "smallsceneryplace",
  "smallsceneryremove",
  "landsetheight",
  "footpathplace",
  "footpathremove",
]);

export const statRequirementTracker = (): Function => {
  let statRequirements: TRideInfo[] = [];

  const updateAllStatRequirements = () => {
    statRequirements = ridesAddMoreInfo(null, null, ["ride"]);
    statRequirements.forEach((ride) => {
      const nativeRide = map.rides.find((r) => r.id === ride.id);
      if (!nativeRide) return;
      ride.statsCalculated = (ride.excitement ?? -1) > -1;
      ride.statRequirementResults = rideCheckStatRequirements(ride, nativeRide);
    });
  };

  const createNewRide = (rideId: number) => {
    if (statRequirements.some((ride) => ride.id === rideId)) return;
    const nativeRide = map.rides.find((ride) => ride.id === rideId);
    if (nativeRide) {
      const ride = rideAddMoreInfo(null, null, nativeRide);
      ride.statsCalculated = (ride.excitement ?? -1) > -1;
      ride.statRequirementResults = rideCheckStatRequirements(ride, nativeRide);
      statRequirements.push(ride);
    }
  };

  const demolishRide = (rideId: number) => {
    statRequirements = statRequirements.filter((ride) => ride.id !== rideId);
  };

  const updateStatRequirements = (
    { rideId, excitement, intensity, nausea }: RideRatingsCalculateArgs,
    force: boolean = false,
  ) => {
    let currentRideIndex = statRequirements.findIndex(
      (ride) => ride.id === rideId,
    );
    const currentRide = statRequirements[currentRideIndex];
    const nativeRide = map.rides.find((ride) => ride.id === rideId);
    if (
      currentRide &&
      nativeRide &&
      (force ||
        currentRide.excitement !== excitement ||
        currentRide.intensity !== intensity ||
        currentRide.nausea !== nausea)
    ) {
      const ride = rideAddMoreInfo(null, null, nativeRide);
      ride.statsCalculated = (ride.excitement ?? -1) > -1;
      ride.statRequirementResults = rideCheckStatRequirements(ride, nativeRide);
      statRequirements[currentRideIndex] = ride;
    }
  };

  const getStatRequirements = () => statRequirements;

  context.subscribe("action.execute", (event) => {
    if (event.action === "ridecreate") {
      const args = event.args as RideCreateArgs;
      const { result }: { result: RideCreateActionResult } = event;
      if (
        result.ride === undefined ||
        ((args.flags ?? 0) & TRACK_DESIGN_FLAG) > 0
      )
        return;
      createNewRide(result.ride);
    }
    if (event.action === "ridedemolish") {
      const args = event.args as RideDemolishArgs;
      if (((args.flags ?? 0) & TRACK_DESIGN_FLAG) > 0) return;
      demolishRide(args.ride);
    }
    if (event.action === "ridesetstatus") {
      const args = event.args as RideSetStatusArgs;
      updateStatRequirements(
        { rideId: args.ride, excitement: 0, intensity: 0, nausea: 0 },
        true,
      );
    }
    if (ACTIONS_CAN_AFFECT_UNDERGROUND_PERCENTAGE.has(event.action)) {
      const args = event.args as TrackPlaceArgs;
      const flags = (args.flags || 0) % 2147483648;
      if (flags !== 0) return;
      const { x, y, z } = args;
      const tile = map.getTile(x / 32, y / 32);
      const elements = tile.elements.filter(
        (element) => element.type === "track" && element.baseZ < z,
      );
      const rideIds = new Set(
        elements.map((element) => (element as TrackElement).ride),
      );
      rideIds.forEach((rideId) =>
        updateStatRequirements(
          { rideId, excitement: 0, intensity: 0, nausea: 0 },
          true,
        ),
      );
    }
  });

  context.subscribe("ride.ratings.calculate", (event) => {
    updateStatRequirements(event);
  });

  updateAllStatRequirements();

  return getStatRequirements;
};
