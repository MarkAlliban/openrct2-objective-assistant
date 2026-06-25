// BUG: The API can't open the ride window. Best we can do is move the viewport to it.
export const openRideWindow = (rideId: number) => {
  const ride = map.getRide(rideId);
  if (ride && ride.stations.length > 0) {
    const tile = ride.stations[0].start;
    ui.mainViewport.scrollTo(tile);
  }
};
