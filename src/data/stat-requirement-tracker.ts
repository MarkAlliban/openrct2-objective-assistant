import { TMapData, TRideInfo, TRideRequirement } from "../types";
import { ridesAddMoreInfo } from "./rides-add-more-info";

const DEBOUNCE_TIMER = 1000;

const SPECIAL_PIECES = {
  special: new Set([
    68, // Water coaster straight track
    81, // Water coaster bend L
    82, // Water coaster bend R
    211, // Reverser
    201, // Mini golf hole A
    202, // Mini golf hole B
    203, // Mini golf hole C
    204, // Mini golf hole D
    205, // Mini golf hole E
  ]),

  complete: new Set([
    40, // Vertical loop left
    41, // Vertical loop right
  ]),
  in: new Set([
    52, // Inline twist left (in)
    53, // Inline twist right (in)
    56, // Small half loop (in)
    58, // Corkscrew right (in)
    59, // Corkscrew left (in)
    174, // Barrel roll left (in)
    175, // Barrel roll right (in)
    183, // Large half loop right (in)
    184, // Large half loop left (in)
    207, // Quarter loop (in)
    267, // Large corkscrew right (in)
    268, // Large corkscrew left (in)
    271, // Medium half loop right (in)
    272, // Medium half loop left (in)
    275, // Zero-G roll left (in)
    276, // Zero-G roll right (in)
    279, // Large zero-G roll left (in)
    280, // Large zero-G roll right (in)
  ]),
  out: new Set([
    54, // Inline twist left (out)
    55, // Inline twist right (out)
    57, // Small half loop (out)
    60, // Corkscrew left (out)
    61, // Corkscrew right (out)
    176, // Barrel roll left (out)
    177, // Barrel roll right (out)
    185, // Large half loop left (out)
    186, // Large half loop right (out)
    208, // Quarter loop (out)
    269, // Large corkscrew left (out)
    270, // Large corkscrew right (out)
    273, // Medium half loop left (out)
    274, // Medium half loop right (out)
    277, // Zero-G roll left (out)
    278, // Zero-G roll right (out)
    281, // Large zero-G roll left (out)
    282, // Large zero-G roll right (out)
  ]),
};

export const scanMap = (mapData: TMapData[], ridesToScan: Set<number>) => {
  for (let x = 0; x < map.size.x; x++) {
    for (let y = 0; y < map.size.y; y++) {
      const tile = map.getTile(x, y);
      for (const element of tile.elements) {
        if (element.type === "track" && ridesToScan.has(element.ride)) {
          const surfaceLevel =
            tile.elements.find((el) => el.type === "surface")?.baseHeight || 0;
          if (!mapData[element.ride]) {
            mapData[element.ride] = {
              inversionsComplete: 0,
              inversionsIn: 0,
              inversionsOut: 0,
              underground: 0,
              overground: 0,
              specialTrackPieces: 0,
            };
          }
          if (element.sequence === 0) {
            if (SPECIAL_PIECES.complete.has(element.trackType)) {
              mapData[element.ride].inversionsComplete++;
            }
            if (SPECIAL_PIECES.in.has(element.trackType)) {
              mapData[element.ride].inversionsIn++;
            }
            if (SPECIAL_PIECES.out.has(element.trackType)) {
              mapData[element.ride].inversionsOut++;
            }
            if (
              element.baseHeight < surfaceLevel ||
              tile.elements.some(
                (el) =>
                  el.baseHeight > element.baseHeight &&
                  (el.type === "large_scenery" ||
                    (el.type === "small_scenery" &&
                      el.occupiedQuadrants === 15)),
              )
            ) {
              mapData[element.ride].underground++;
            } else {
              mapData[element.ride].overground++;
            }
            if (
              SPECIAL_PIECES.special.has(element.trackType) &&
              element.sequence === 0
            ) {
              mapData[element.ride].specialTrackPieces++;
            }
          }
        }
      }
    }
  }
};

export const checkStatRequirements = (
  ride: TRideInfo,
  mapData: TMapData,
): TRideRequirement[] => {
  if (!ride.statRequirements) return [];
  const nativeRide = map.rides[ride.id];
  const inversions =
    mapData &&
    mapData.inversionsComplete +
      Math.min(mapData.inversionsIn, mapData.inversionsOut);
  const { underground, overground, specialTrackPieces } = mapData || {};

  const reqs: TRideRequirement[] = [];
  if (ride.statRequirements.highestDropHeight)
    reqs.push({
      type: "highestDropHeight",
      name: "Drop height",
      required: ride.statRequirements.highestDropHeight,
      actual: nativeRide.highestDropHeight,
      met:
        nativeRide.highestDropHeight >= ride.statRequirements.highestDropHeight,
    });
  if (ride.statRequirements.numberOfDrops)
    reqs.push({
      type: "numberOfDrops",
      name: "Number of drops",
      required: ride.statRequirements.numberOfDrops,
      actual: nativeRide.numDrops,
      met: nativeRide.numDrops >= ride.statRequirements.numberOfDrops,
    });
  if (ride.statRequirements.maxSpeed)
    reqs.push({
      type: "maxSpeed",
      name: "Max speed",
      required: ride.statRequirements.maxSpeed,
      actual: nativeRide.maxSpeed,
      met: nativeRide.maxSpeed >= ride.statRequirements.maxSpeed,
    });
  if (ride.statRequirements.maxLateralG)
    reqs.push({
      type: "maxLateralG",
      name: "Lateral G",
      required: ride.statRequirements.maxLateralG,
      actual: nativeRide.maxLateralGs,
      met: nativeRide.maxLateralGs >= ride.statRequirements.maxLateralG,
    });
  if (ride.statRequirements.maxNegativeG)
    reqs.push({
      type: "maxNegativeG",
      name: "Negative vertical G",
      required: ride.statRequirements.maxNegativeG,
      actual: nativeRide.maxNegativeVerticalGs,
      met:
        nativeRide.excitement > -1 &&
        nativeRide.maxNegativeVerticalGs < ride.statRequirements.maxNegativeG,
    });
  // BUG: For Mobius coasters we should count only the length of the first segment, but this isn't exposed by the plugin API.
  if (ride.statRequirements.rideLength)
    reqs.push({
      type: "rideLength",
      name: "Ride length",
      required: ride.statRequirements.rideLength,
      actual: nativeRide.rideLength,
      met: nativeRide.rideLength >= ride.statRequirements.rideLength,
    });
  // BUG: Inversions isn't exposed by the plugin API. We count them by scanning the map but this also includes inversions that the train doesn't make it through.
  if (ride.statRequirements.inversions)
    reqs.push({
      type: "inversions",
      name: "Inversions",
      required: ride.statRequirements.inversions,
      actual: inversions,
      met: inversions >= ride.statRequirements.inversions,
    });
  if (ride.statRequirements.maxUnderground)
    reqs.push({
      type: "maxUnderground",
      name: "Max underground percentage",
      required: ride.statRequirements.maxUnderground,
      actual: (underground * 100) / (underground + overground),
      met:
        (underground * 100) / (underground + overground) <
        ride.statRequirements.maxUnderground,
    });
  if (ride.statRequirements.specialTrackPieces)
    reqs.push({
      type: "specialTrackPieces",
      name: "Special track pieces",
      required: ride.statRequirements.specialTrackPieces,
      actual: specialTrackPieces,
      met: specialTrackPieces >= ride.statRequirements.specialTrackPieces,
    });

  const inversionOverrides = ride.statRequirements.inversionOverrides;
  if (inversionOverrides && inversions) {
    reqs.forEach((req) => {
      if (inversionOverrides.includes(req.type)) {
        req.overridden = true;
      }
    });
  }

  return reqs;
};

const updateAllStatRequirements = (): TRideInfo[] => {
  const rides = ridesAddMoreInfo(null, null, ["ride"]);
  const mapData: TMapData[] = [];
  const ridesToScan = new Set(
    rides
      .filter(
        (ride) =>
          (ride.excitement ?? -1) > -1 &&
          (ride.statRequirements?.inversions ||
            ride.statRequirements?.inversionOverrides ||
            ride.statRequirements?.maxUnderground ||
            ride.statRequirements?.specialTrackPieces),
      )
      .map((ride) => ride.id),
  );
  if (ridesToScan.size) {
    scanMap(mapData, ridesToScan);
  }

  return rides.map((ride) => ({
    ...ride,
    statsCalculated: (ride.excitement ?? -1) > -1,
    statRequirementResults: checkStatRequirements(ride, mapData[ride.id]),
    inversions:
      mapData[ride.id]?.inversionsComplete +
        Math.min(
          mapData[ride.id]?.inversionsIn,
          mapData[ride.id]?.inversionsOut,
        ) || 0,
  }));
};

export const statRequirementTracker = () => {
  let debounceId: number | null = null;
  let statRequirements: TRideInfo[] = [];

  const updateStatRequirements = () => {
    if (!debounceId) {
      debounceId = context.setTimeout(() => {
        statRequirements = updateAllStatRequirements();
        debounceId = null;
      }, DEBOUNCE_TIMER);
    }
  };

  const getStatRequirements = () => statRequirements;

  return { getStatRequirements, updateStatRequirements };
};
