export const setRidePrice = (
  ride: number,
  price: number | null,
  isPrimaryPrice: boolean,
) => {
  if (price !== null) {
    context.executeAction("ridesetprice", {
      ride,
      price: price > 200 ? 200 : price,
      isPrimaryPrice,
    });
  }
};
