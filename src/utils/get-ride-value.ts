export const getRideValue = (
  ride: Ride,
  bonusValue: number,
  guestCount: number,
) => (ride.value || 0) * (guestCount + bonusValue * 4);
