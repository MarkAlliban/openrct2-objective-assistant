export const setRidePrice = (
  ride: number,
  price: number | null,
  isPrimaryPrice: boolean,
) => {
	console.log("Setting ride ", ride, price);
  if (price !== null) {
    context.executeAction("ridesetprice", {
      ride,
      price: price > 200 ? 200 : price,
      isPrimaryPrice,
    });
  }
};
