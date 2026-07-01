export type TGuestTracker = {
  getGuestCount: Function;
  getGuestThoughts: Function;
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
type TThoughts = Record<ThoughtType, number>;

const GUEST_TRACKER_TICKS = 40;

export const initGuestTracker = () => {
  const TICKS_TO_KEEP = 2000;
  const TICKS_TO_TRACK = 9600;

  const startTicks = date.ticksElapsed;
  const guestCount: TGuestCount[] = [];

  const thoughts: Partial<TThoughts> = {
    toilet: 0,
    bad_litter: 0,
    path_disgusting: 0,
    vandalism: 0,
    very_clean: 0,
    scenery: 0,
    hungry: 0,
    lost: 0,
    cant_find: 0,
  };

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

  const updateGuestThoughts = () => {
    const guests = map.getAllEntities("guest");
    (Object.keys(thoughts) as Array<ThoughtType>).forEach(
      (key: ThoughtType) => {
        thoughts[key] = 0;
      },
    );
    for (const guest of guests) {
      for (const thought of guest.thoughts) {
        if (thought.freshness <= 5 && thoughts[thought.type] !== undefined) {
          thoughts[thought.type]!++;
        }
      }
    }
  };

  const getGuestThoughts = () => {
    return thoughts;
  };

  // Track guests once per second
  let lastTick = 0;
  context.subscribe("interval.tick", function () {
    if (date.ticksElapsed < lastTick + GUEST_TRACKER_TICKS) return;
    lastTick = date.ticksElapsed;
    updateGuestCount();
    updateGuestThoughts();
  });

  updateGuestCount();
  updateGuestThoughts();

  return { getGuestCount, getGuestThoughts };
};
