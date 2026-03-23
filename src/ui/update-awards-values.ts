import { TObjectiveTarget } from "../types";
import { TGuestTracker } from "../data/guest-tracker";
import {
  DAZZLING_COLOURS,
  ERROR_COLOUR,
  INFO_COLOUR,
  RIDE_LIFECYCLE_CRASHED,
  RIDE_LIFECYCLE_NOT_CUSTOM_DESIGN,
  SUCCESS_COLOUR,
} from "../constants";
import { updateRidesData } from "./update-rides-data";
import { formatCurrency } from "../utils/format-currency";
import { awardsInfo } from "../data/awards-info";

type TAwardQualification = {
  eligible: boolean;
  requirements: string[];
  exclusions: string[];
};

const countThoughts = (
  numThinking: number,
  minProportion: number | null = null,
  minTotal: number | null = null,
  maxProportion: number | null = null,
  maxTotal: number | null = null,
) => {
  if (minProportion) {
    return {
      passed: numThinking > Math.floor(park.guests / minProportion),
      required: Math.floor(park.guests / minProportion),
      actual: numThinking,
    };
  }
  if (minTotal) {
    return {
      passed: numThinking > minTotal,
      required: minTotal,
      actual: numThinking,
    };
  }
  if (maxProportion) {
    return {
      passed: numThinking < Math.floor(park.guests / maxProportion),
      required: Math.floor(park.guests / maxProportion),
      actual: numThinking,
    };
  }
  if (maxTotal) {
    return {
      passed: numThinking < maxTotal,
      required: maxTotal,
      actual: numThinking,
    };
  }
  return { passed: true, required: 0 };
};

const getExclusions = (award: string) => {
  const awardInfo = awardsInfo.filter((a) => a.name === award);
  const awardsCurrent = park.awards.map((a) => a.type);
  if (!awardInfo.length) return [];
  const exclusions = awardInfo[0].exclusion.map((exclusion) => {
    return { name: exclusion, has: awardsCurrent.indexOf(exclusion) !== -1 };
  });
  console.log(exclusions);
  return exclusions;
};

export const updateAwardsValues = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
) => {
  window.height = 355;
  window.minHeight = 355;
  window.maxHeight = 355;

  // Get ride data
  const openRides = map.rides.filter(
    (ride) => ride.classification === "ride" && ride.status === "open",
  );
  const allRides = updateRidesData(objective, tracker, [
    "ride",
    "stall",
    "facility",
  ]);

  // Count the guests thoughts that we're interested in
  const thoughts: any = {
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
  const guests = map.getAllEntities("guest");
  for (const guest of guests) {
    for (const thought of guest.thoughts) {
      if (thought.freshness <= 5 && thoughts[thought.type] !== undefined) {
        thoughts[thought.type]++;
      }
    }
  }

  // Most tidy park
  const tidyThoughts = countThoughts(thoughts.very_clean, 64);
  const untidyThoughts = countThoughts(
    thoughts.bad_litter + thoughts.path_disgusting + thoughts.vandalism,
    null,
    null,
    null,
    6,
  );
  const tidyExclusions = getExclusions("mostTidy");
  const mostTidy: TAwardQualification = {
    eligible: tidyThoughts.passed && untidyThoughts.passed,
    requirements: [
      `${tidyThoughts.passed ? `{${SUCCESS_COLOUR}}` : `{${ERROR_COLOUR}}`}${tidyThoughts.actual} / ${tidyThoughts.required}`,
      `${untidyThoughts.passed ? `{${SUCCESS_COLOUR}}` : `{${ERROR_COLOUR}}`}${untidyThoughts.actual} / ${untidyThoughts.required}`,
    ],
    exclusions: [],
  };

  // Best rollercoasters
  const coasters = allRides.filter(
    (ride) =>
      ride.category === "rollercoaster" &&
      ride.status === "open" &&
      !((ride.lifecycleFlags || 0) & RIDE_LIFECYCLE_CRASHED),
  ).length;
  const bestRollerCoasters: TAwardQualification = {
    eligible: coasters >= 6,
    requirements: [
      `${coasters >= 6 ? `{${SUCCESS_COLOUR}}` : `{${ERROR_COLOUR}}`}${coasters} / 6`,
    ],
    exclusions: [],
  };

  // Best value park
  const bestValue: TAwardQualification = {
    eligible:
      !park.getFlag("noMoney") &&
      !park.getFlag("freeParkEntry") &&
      park.entranceFee + 0.1 > park.totalRideValueForMoney / 2,
    requirements: [
      park.getFlag("freeParkEntry") || park.entranceFee === 0
        ? `{${ERROR_COLOUR}}None`
        : `{${SUCCESS_COLOUR}}Yes`,
      park.getFlag("noMoney")
        ? `{${ERROR_COLOUR}}No`
        : `{${SUCCESS_COLOUR}}Yes`,
      `${park.entranceFee + 0.1 > park.totalRideValueForMoney / 2 ? `{${ERROR_COLOUR}}` : `{${SUCCESS_COLOUR}}`}${formatCurrency(park.entranceFee)}/${formatCurrency(park.totalRideValueForMoney / 2)}`,
    ],
    exclusions: [],
  };

  // Most beautiful park
  const beautifultidyThoughts = countThoughts(thoughts.scenery, 128);
  const unbeautifulThoughts = countThoughts(
    thoughts.bad_litter + thoughts.path_disgusting + thoughts.vandalism,
    null,
    null,
    null,
    16,
  );
  const mostBeautiful: TAwardQualification = {
    eligible: beautifultidyThoughts.passed && unbeautifulThoughts.passed,
    requirements: [
      `${beautifultidyThoughts.passed ? `{${SUCCESS_COLOUR}}` : `{${ERROR_COLOUR}}`}${beautifultidyThoughts.actual} / ${beautifultidyThoughts.required}`,
      `${unbeautifulThoughts.passed ? `{${SUCCESS_COLOUR}}` : `{${ERROR_COLOUR}}`}${unbeautifulThoughts.actual} / ${unbeautifulThoughts.required}`,
    ],
    exclusions: [],
  };

  // Safest park
  const vandalismThoughts = countThoughts(
    thoughts.vandalism,
    null,
    null,
    null,
    3,
  );
  const recentCrashes = allRides.filter(
    (ride) =>
      ride.classification === "ride" &&
      (ride.lifecycleFlags || 0) & RIDE_LIFECYCLE_CRASHED,
  ).length;
  const safest: TAwardQualification = {
    eligible: vandalismThoughts.passed && recentCrashes === 0,
    requirements: [
      `{${vandalismThoughts.passed ? SUCCESS_COLOUR : ERROR_COLOUR}}${vandalismThoughts.actual} / ${vandalismThoughts.required}`,
      `{${recentCrashes === 0 ? SUCCESS_COLOUR : ERROR_COLOUR}}${recentCrashes}`,
    ],
    exclusions: [],
  };

  // Best staff
  const staff = map.getAllEntities("staff");
  const staffBreakdown: Record<StaffType, number> = staff.reduce(
    (a, p) => {
      a[p.staffType]++;
      return a;
    },
    { handyman: 0, entertainer: 0, security: 0, mechanic: 0 },
  );
  const staffTypes =
    (staffBreakdown.handyman > 0 ? 1 : 0) +
    (staffBreakdown.mechanic > 0 ? 1 : 0) +
    (staffBreakdown.security > 0 ? 1 : 0) +
    (staffBreakdown.entertainer > 0 ? 1 : 0);
  const bestStaff: TAwardQualification = {
    eligible:
      staff.length >= 20 &&
      staffTypes === 4 &&
      staff.length >= Math.floor(park.guests / 32),
    requirements: [
      `{${staff.length >= 20 ? SUCCESS_COLOUR : ERROR_COLOUR}}${staff.length} / 20`,
      `{${staffTypes === 4 ? SUCCESS_COLOUR : ERROR_COLOUR}}${staffTypes} / 4`,
      `{${staff.length >= Math.floor(park.guests / 32) ? SUCCESS_COLOUR : ERROR_COLOUR}}${staff.length} / ${Math.floor(park.guests / 32)}`,
    ],
    exclusions: [],
  };

  // Best food
  const foodStalls = map.rides.filter(
    (ride) => ride.type === 28 && ride.status === "open",
  );
  const foodTypes: number[] = foodStalls.reduce((a: number[], r) => {
    if (a.indexOf(r.object.shopItem) === -1) a.push(r.object.shopItem);
    return a;
  }, []);
  const hungryGuests = countThoughts(thoughts.hungry, null, null, null, 13);
  const bestFood: TAwardQualification = {
    eligible:
      foodStalls.length >= 7 &&
      foodStalls.length >= Math.floor(park.guests / 128) &&
      foodTypes.length >= 4 &&
      hungryGuests.passed,
    requirements: [
      `{${foodStalls.length >= 7 ? SUCCESS_COLOUR : ERROR_COLOUR}}${foodStalls.length} / 7`,
      `{${foodTypes.length >= 4 ? SUCCESS_COLOUR : ERROR_COLOUR}}${foodTypes.length} / 4`,
      `{${foodStalls.length >= Math.floor(park.guests / 128) ? SUCCESS_COLOUR : ERROR_COLOUR}}${foodStalls.length} / ${Math.floor(park.guests / 128)}`,
      `{${hungryGuests.passed ? SUCCESS_COLOUR : ERROR_COLOUR}}${hungryGuests.actual} / 12`,
    ],
    exclusions: [],
  };

  // Best toilets
  const toilets = map.rides.filter(
    (ride) => ride.type === 36 && ride.status === "open",
  ).length;
  const needToilet = countThoughts(thoughts.toilet, null, null, 128);
  const bestToilets: TAwardQualification = {
    eligible:
      toilets >= 4 &&
      toilets >= Math.floor(park.guests / 128) &&
      needToilet.passed,
    requirements: [
      `{${toilets >= 4 ? SUCCESS_COLOUR : ERROR_COLOUR}}${toilets} / 4`,
      `{${toilets >= Math.floor(park.guests) / 128 ? SUCCESS_COLOUR : ERROR_COLOUR}}${toilets} / ${Math.floor(park.guests / 128)}`,
      `{${needToilet.passed ? SUCCESS_COLOUR : ERROR_COLOUR}}${needToilet.actual} / ${needToilet.required}`,
    ],
    exclusions: [],
  };

  // Best water rides
  const waterRides = allRides.filter(
    (ride) =>
      ride.category === "water" &&
      ride.status === "open" &&
      !((ride.lifecycleFlags || 0) & RIDE_LIFECYCLE_CRASHED),
  ).length;
  const bestWaterRides: TAwardQualification = {
    eligible: waterRides >= 6,
    requirements: [
      `{${waterRides >= 6 ? SUCCESS_COLOUR : ERROR_COLOUR}}${waterRides} / 6`,
    ],
    exclusions: [],
  };

  // Best custom designed rides
  const customRides = allRides.filter(
    (ride) =>
      (ride.excitement || 0) >= 5.5 &&
      !((ride.lifecycleFlags || 0) & RIDE_LIFECYCLE_NOT_CUSTOM_DESIGN) &&
      ride.status === "open" &&
      !((ride.lifecycleFlags || 0) & RIDE_LIFECYCLE_CRASHED),
  ).length;
  const bestCustomDesignedRides: TAwardQualification = {
    eligible: customRides >= 6,
    requirements: [
      `{${customRides >= 6 ? SUCCESS_COLOUR : ERROR_COLOUR}}${customRides} / 6`,
    ],
    exclusions: [],
  };

  // Most dazzling colours
  const dazzlingRides = openRides.filter(
    (ride) =>
      ride.status === "open" &&
      ride.colourSchemes.some(
        (scheme) => DAZZLING_COLOURS.indexOf(scheme.main) !== -1,
      ),
  ).length;
  const mostDazzlingRideColours: TAwardQualification = {
    eligible: openRides.length >= 5 && 2 * dazzlingRides >= openRides.length,
    requirements: [
      `{${openRides.length >= 5 ? SUCCESS_COLOUR : ERROR_COLOUR}}${openRides.length} / 5`,
      `{${2 * dazzlingRides >= openRides.length ? SUCCESS_COLOUR : ERROR_COLOUR}}${dazzlingRides} / ${Math.ceil(openRides.length / 2)}`,
    ],
    exclusions: [],
  };

  // Best gentle rides
  const gentleRides = allRides.filter(
    (ride) => ride.category === "gentle" && ride.status === "open",
  ).length;
  const bestGentleRides: TAwardQualification = {
    eligible: gentleRides >= 10,
    requirements: [
      `{${gentleRides >= 10 ? SUCCESS_COLOUR : ERROR_COLOUR}}${gentleRides} / 10`,
    ],
    exclusions: [],
  };

  // Render awards
  const awards: Record<AwardType, TAwardQualification> = {
    mostTidy,
    bestRollerCoasters,
    bestValue,
    mostBeautiful,
    safest,
    bestStaff,
    bestFood,
    bestToilets,
    bestWaterRides,
    bestCustomDesignedRides,
    mostDazzlingRideColours,
    bestGentleRides,
  };
  awardsInfo.forEach((award) => {
    if (!awards[award.name]) return;
    updateWidget(
      window,
      `labelAward${award.name}`,
      `${!!park.awards.filter((a) => a.type === award.name).length ? `{${INFO_COLOUR}}` : awards[award.name].eligible ? `{${SUCCESS_COLOUR}}` : ""}${award.text}`,
    );
    awards[award.name].requirements.forEach((req, index) => {
      updateWidget(window, `${award.name}Requirement${index}`, req);
    });
  });
};

const updateWidget = (window: Window, name: string, text: string) => {
  const widget: LabelWidget = window.findWidget(name);
  if (!widget) return;
  if (widget.text !== text) widget.text = text;
};
