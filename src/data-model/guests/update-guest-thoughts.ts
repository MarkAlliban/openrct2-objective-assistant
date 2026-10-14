export type TGuestThoughts = Partial<Record<ThoughtType, number>>;

export const updateGuestThoughts = () => {
  const guestThoughts: TGuestThoughts = {
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

  for (const guest of map.getAllEntities("guest")) {
    for (const thought of guest.thoughts) {
      if (thought.freshness <= 5 && thought.type in guestThoughts) {
        guestThoughts[thought.type]!++;
      }
    }
  }

  return guestThoughts;
};
