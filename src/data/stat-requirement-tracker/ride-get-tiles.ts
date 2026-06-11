export const rideGetTiles = (ride: Ride) => {
  const stations = ride.stations.filter((station) => station.start);
  const rideTiles: CoordsXY[] = [];
  stations.forEach((station) => {
    const {
      start: { x: startX, y: startY, z: startZ },
    } = station;
    if (
      !rideTiles.some(
        (tile) => tile.x === startX / 32 && tile.y === startY / 32,
      )
    ) {
      rideTiles.push({ x: startX / 32, y: startY / 32 });
    }
    const startTile = map.getTile(startX / 32, startY / 32);
    const elementIndex = startTile.elements.findIndex(
      (element) =>
        element.type === "track" &&
        element.ride === ride.id &&
        element.baseZ === startZ,
    );
    const trackIterator = map.getTrackIterator(
      { x: startX, y: startY },
      elementIndex,
    );
    while (trackIterator?.next()) {
      const position = trackIterator.position;
      if (
        position.x === startX &&
        position.y === startY &&
        position.z === startZ
      )
        break;
      // BUG: We're adding the track piece's initial tile here, but some track pieces cover more than 1 tile. For underground percentage we should be counting all track tiles, but I'm not aware of a way to do this.
      if (
        !rideTiles.some(
          (tile) => tile.x === position.x / 32 && tile.y === position.y / 32,
        )
      ) {
        rideTiles.push({ x: position.x / 32, y: position.y / 32 });
      }
    }
  });

  return rideTiles;
};
