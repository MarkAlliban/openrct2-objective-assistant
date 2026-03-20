export const setRidePrice = (
  ride: number,
  price: number,
  isPrimaryPrice: boolean,
) => {
  context.executeAction("ridesetprice", {
    ride,
    price: price > 200 ? 200 : price,
    isPrimaryPrice,
  });
};
