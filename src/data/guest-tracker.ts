export type TGuestTracker = {
  updateGuestCount: Function;
  getGuestCount: Function;
};
type TGuestMoment = {
  customers: number;
  time: number;
};
type TGuestCount = {
  list: TGuestMoment[];
  time?: number;
  tracker?: number | null;
};

export const guestTracker = () => {
  const TICKS_TO_KEEP = 2000;
  const TICKS_TO_TRACK = 9600;

  const startTicks = date.ticksElapsed;
  const guestCount: TGuestCount[] = [];

  const updateGuestCount = () => {
    map.rides.forEach((ride) => {
      // Add the latest data
      if (guestCount[ride.id]) {
        guestCount[ride.id].list.push({
          customers: ride.totalCustomers,
          time: date.ticksElapsed,
        });
      } else {
        guestCount[ride.id] = {
          list: [{ customers: ride.totalCustomers, time: date.ticksElapsed }],
        };
      }

      // Delete old data
      guestCount[ride.id].list = guestCount[ride.id].list.filter(
        (data) =>
          data.time >= date.ticksElapsed - TICKS_TO_TRACK - TICKS_TO_KEEP,
      );

      // Get the closest data point to 5 minutes ago
      const closest = guestCount[ride.id].list.reduce(
        (a: TGuestMoment | null, data) => {
          if (!a) return data;
          return Math.abs(date.ticksElapsed - data.time - TICKS_TO_TRACK) <
            Math.abs(date.ticksElapsed - a.time - TICKS_TO_TRACK)
            ? data
            : a;
        },
        null,
      );
      // Set the tracker to the weighted average
      guestCount[ride.id].tracker =
        closest && date.ticksElapsed > closest.time
          ? (ride.totalCustomers - closest.customers) *
            (TICKS_TO_TRACK / (date.ticksElapsed - closest.time))
          : null;
    });
  };

  const getGuestCount = (
    rideId: number,
  ): { count: number | null; error: number } => ({
    count: guestCount[rideId]?.tracker || 0,
    error: Math.max(startTicks + TICKS_TO_TRACK / 2 - date.ticksElapsed, 0),
  });

  context.subscribe("interval.day", function () {
    // Track guests once per day
    updateGuestCount();
  });

  return { updateGuestCount, getGuestCount };
};
