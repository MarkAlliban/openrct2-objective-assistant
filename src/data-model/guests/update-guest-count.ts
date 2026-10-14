const TICKS_TO_KEEP = 2000;
const TICKS_TO_TRACK = 9600;

type TGuestDataPoint = {
  customers: number;
  time: number;
};
export type TGuestCount = {
  list: TGuestDataPoint[];
  tracker?: number | null;
  count?: number;
  error?: number;
};

export const updateGuestCount = (
  guestCount: TGuestCount[],
  startTicks: number,
) => {
  return map.rides.map((ride) => {
    const list = guestCount[ride.id]
      ? guestCount[ride.id].list.filter(
          (data) =>
            data.time >= date.ticksElapsed - TICKS_TO_TRACK - TICKS_TO_KEEP,
        )
      : [];
    list.push({
      customers: ride.totalCustomers,
      time: date.ticksElapsed,
    });

    // Get the closest data point to 5 minutes ago
    const closest = list.reduce((a: TGuestDataPoint | null, data) => {
      if (!a) return data;
      return Math.abs(date.ticksElapsed - data.time - TICKS_TO_TRACK) <
        Math.abs(date.ticksElapsed - a.time - TICKS_TO_TRACK)
        ? data
        : a;
    }, null);
    // Set the tracker to the weighted average
    const tracker =
      closest && date.ticksElapsed > closest.time
        ? (ride.totalCustomers - closest.customers) *
          (TICKS_TO_TRACK / (date.ticksElapsed - closest.time))
        : null;
    const count = guestCount[ride.id]?.tracker || 0;
    const error = Math.max(
      startTicks + TICKS_TO_TRACK / 2 - date.ticksElapsed,
      0,
    );

    return { list, tracker, count, error };
  });
};
