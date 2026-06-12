import { SPECIAL_PIECES } from "./constants";
import { rideGetTiles } from "./ride-get-tiles";

export const rideGetSpecialData = (
  ride: Ride,
  needsTrackScan: boolean,
): { inversions: number; underground: number; specialPieces: number } => {
  if (!needsTrackScan)
    return { inversions: 0, underground: 0, specialPieces: 0 };
  let inversions = 0;
  let underground = 0;
  let overground = 0;
  let specialPieces = 0;
  const rideTiles: CoordsXY[] = rideGetTiles(ride);
  rideTiles.forEach(({ x, y }) => {
    const tile = map.getTile(x, y);
    for (const element of tile.elements) {
      if (element.type === "track" && element.ride === ride.id) {
        // Count inversions
        if (
          element.sequence === 0 &&
          SPECIAL_PIECES.inversions.has(element.trackType)
        ) {
          inversions++;
        }
        // Count underground / overground / covered pieces
        const surfaceLevel =
          tile.elements.find((el) => el.type === "surface")?.baseHeight || 0;
        if (
          element.baseHeight < surfaceLevel ||
          tile.elements.some(
            (el) =>
              el.baseHeight > element.baseHeight &&
              (el.type === "footpath" ||
                el.type === "large_scenery" ||
                (el.type === "small_scenery" && el.occupiedQuadrants === 15)),
          )
        ) {
          underground++;
        } else {
          overground++;
        }
        // Count special pieces
        if (
          element.sequence === 0 &&
          SPECIAL_PIECES.special.has(element.trackType)
        ) {
          specialPieces++;
        }
      }
    }
  });

  return {
    inversions,
    underground: (underground * 100) / (underground + overground || 1),
    specialPieces,
  };
};
