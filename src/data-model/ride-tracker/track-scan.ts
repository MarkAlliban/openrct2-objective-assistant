import { TRideTypeData } from "../../data/get-ride-type";

export type TTrackData = {
  length: number;
  inversions: number;
  underground: number;
  specialPieces: number;
};

const TILE_DIVISIONS = 32;
const TILE_DIVISIONS_HEIGHT = 8;

export const trackScan = (
  ride: Ride,
  typeData: TRideTypeData,
): TTrackData[] | undefined => {
  const stations = ride.stations.filter((station) => station.start);

  // We only need to bother scanning the track if there's multiple stations, or the stat requirements have maxUnderground, inversions, inversionOverrides or special pieces.
  if (
    stations.length === 1 &&
    !typeData.statRequirements?.inversions &&
    !typeData.statRequirements?.inversionOverrides &&
    !typeData.statRequirements?.maxUnderground &&
    !typeData.statRequirements?.specialTrackPieces
  ) {
    return undefined;
  }

  const segments: TTrackData[] = [];
  stations.forEach(({ start: { x, y, z } }) => {
    const startTile = map.getTile(x / TILE_DIVISIONS, y / TILE_DIVISIONS);
    const elementIndex = startTile.elements.findIndex(
      (element) =>
        element.type === "track" &&
        element.ride === ride.id &&
        element.baseZ === z,
    );
    const trackIterator = map.getTrackIterator({ x, y }, elementIndex);
    if (!trackIterator) return;

    const newSegment = {
      length: 0,
      inversions: 0,
      underground: 0,
      specialPieces: 0,
    };
    segments.push(newSegment);
    let hasMoreElements = true;
    const positionsChecked: CoordsXYZD[] = [];
    while (trackIterator && hasMoreElements) {
      const { position, segment } = trackIterator;
      // If we've got to the start of a station, or we're going round in a loop, stop iterating
      if (
        newSegment.length > 0 &&
        (stations.some(
          (station) =>
            station.start.x === position.x &&
            station.start.y === position.y &&
            station.start.z === position.z,
        ) ||
          positionsChecked.some(
            (p) =>
              p.x === position.x && p.y === position.y && p.z === position.z,
          ))
      ) {
        break;
      }
      positionsChecked.push(position);
			// BUG: The length here is in 32nds of a tile. Not sure how to convert this to a proper unit as used in the ride window.
      newSegment.length += segment?.length || 0;
      newSegment.inversions += segment?.countsAsInversion ? 1 : 0;
      const tile = map.getTile(
        position.x / TILE_DIVISIONS,
        position.y / TILE_DIVISIONS,
      );
      const surfaceLevel =
        tile.elements.find((el) => el.type === "surface")?.baseHeight || 0;
      newSegment.underground +=
        segment && surfaceLevel > position.z / TILE_DIVISIONS_HEIGHT
          ? segment.length
          : 0;
      if (segment?.countsAsGolfHole) newSegment.specialPieces++; // Golf holes
      if (segment?.type === 68) newSegment.specialPieces++; // Water coaster straight track (kTEDFlatCovered)
      if (segment?.type === 81) newSegment.specialPieces++; // Water coaster bend L (kTEDLeftQuarterTurn5TilesCovered)
      if (segment?.type === 82) newSegment.specialPieces++; // Water coaster bend R (kTEDRightQuarterTurn5TilesCovered)
      if (segment?.type === 211) newSegment.specialPieces++; // Reverser L (kTEDLeftReverser)
      if (segment?.type === 212) newSegment.specialPieces++; // Reverser R (kTEDRightReverser)

      hasMoreElements = trackIterator.next();
    }
  });

  return segments;
};
