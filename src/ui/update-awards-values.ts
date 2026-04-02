import { TObjectiveTarget } from "../types";
import { TGuestTracker } from "../data/guest-tracker";
import {
  DAZZLING_COLOURS,
  ERROR_COLOUR,
  ICONS,
  INFO_COLOUR,
  RIDE_LIFECYCLE_NOT_CUSTOM_DESIGN,
  SUCCESS_COLOUR,
} from "../constants";
import { ridesAddMoreInfo } from "../data/rides-add-more-info";
import { formatCurrency } from "../utils/format-currency";
import { awardNames, awardsInfo } from "../data/awards-info";
import { countThoughts } from "../utils/count-thoughts";
import { updateWidget } from "./update-widget";

type TAwardQualification = {
  eligible: boolean;
  requirements: string[];
  exclusions: { name: string; has: boolean }[];
};

const getExclusions = (award: AwardType) => {
  const awardInfo = awardsInfo.filter((a) => a.name === award);
  const awardsCurrent = park.awards.map((a) => a.type);
  if (!awardInfo.length) return { excluded: false, list: [] };
  const exclusions = awardInfo[0].exclusion.map((exclusion) => {
    return {
      name: awardNames[exclusion],
      has: awardsCurrent.indexOf(exclusion) !== -1,
    };
  });
  return { excluded: exclusions.some((e) => e.has), list: exclusions };
};

export const updateAwardsValues = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  thoughts: Partial<Record<ThoughtType, number>>,
) => {
  window.height = 355;
  window.minHeight = 355;
  window.maxHeight = 355;

  // Get ride data
  const rides = map.rides.filter((ride) => ride.classification === "ride");
  const openRides = rides.filter((ride) => ride.status === "open");
  const allRides = ridesAddMoreInfo(objective, tracker, [
    "ride",
    "stall",
    "facility",
  ]);

  // Update thoughts count once per second to avoid lag
  if (date.ticksElapsed % 40 === 0) {
    (Object.keys(thoughts) as Array<keyof typeof thoughts>).forEach(
      (key) => (thoughts[key] = 0),
    );
    const guests = map.getAllEntities("guest");
    for (const guest of guests) {
      for (const thought of guest.thoughts) {
        if (thought.freshness <= 5 && thoughts[thought.type] !== undefined) {
          thoughts[thought.type]!++;
        }
      }
    }
  }

  // Most tidy park
  const tidyThoughts = countThoughts(thoughts.very_clean!, 64);
  const untidyThoughts = countThoughts(
    thoughts.bad_litter! + thoughts.path_disgusting! + thoughts.vandalism!,
    null,
    null,
    null,
    6,
  );
  const tidyExclusions = getExclusions("mostTidy");
  const mostTidy: TAwardQualification = {
    eligible:
      tidyThoughts.passed && untidyThoughts.passed && !tidyExclusions.excluded,
    requirements: [
      `${tidyThoughts.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${tidyThoughts.actual} / ${tidyThoughts.required}`,
      `${untidyThoughts.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${untidyThoughts.actual} / ${untidyThoughts.required - 1}`,
    ],
    exclusions: tidyExclusions.list,
  };

  // Best rollercoasters
  const coasters = allRides.filter(
    (ride) => ride.category === "rollercoaster" && ride.status === "open",
  ).length;
  const bestRollerCoasters: TAwardQualification = {
    eligible: coasters >= 6 && park.casualtyPenalty === 0,
    requirements: [
      `${coasters >= 6 ? SUCCESS_COLOUR : ERROR_COLOUR}${coasters} / 6`,
      park.casualtyPenalty === 0 ? `${SUCCESS_COLOUR}OK` : `${ERROR_COLOUR}No`,
    ],
    exclusions: [],
  };

  // Best value park
  const bestValueExclusions = getExclusions("bestValue");
  const bestValue: TAwardQualification = {
    eligible:
      !park.getFlag("noMoney") &&
      !park.getFlag("freeParkEntry") &&
      park.entranceFee + 0.1 < park.totalRideValueForMoney / 2 &&
      !bestValueExclusions.excluded,
    requirements: [
      park.getFlag("freeParkEntry") || park.entranceFee === 0
        ? `${ERROR_COLOUR}None`
        : `${SUCCESS_COLOUR}Yes`,
      park.getFlag("noMoney") ? `${ERROR_COLOUR}No` : `${SUCCESS_COLOUR}Yes`,
      `${park.entranceFee + 0.1 < park.totalRideValueForMoney / 2 ? SUCCESS_COLOUR : ERROR_COLOUR}${formatCurrency(park.entranceFee)}/${formatCurrency(park.totalRideValueForMoney / 2)}`,
    ],
    exclusions: bestValueExclusions.list,
  };

  // Most beautiful park
  const beautifultidyThoughts = countThoughts(thoughts.scenery!, 128);
  const unbeautifulThoughts = countThoughts(
    thoughts.bad_litter! + thoughts.path_disgusting! + thoughts.vandalism!,
    null,
    null,
    null,
    16,
  );
  const mostBeautifulExclusions = getExclusions("mostBeautiful");
  const mostBeautiful: TAwardQualification = {
    eligible:
      beautifultidyThoughts.passed &&
      unbeautifulThoughts.passed &&
      !mostBeautifulExclusions.excluded,
    requirements: [
      `${beautifultidyThoughts.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${beautifultidyThoughts.actual} / ${beautifultidyThoughts.required}`,
      `${unbeautifulThoughts.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${unbeautifulThoughts.actual} / ${unbeautifulThoughts.required - 1}`,
    ],
    exclusions: mostBeautifulExclusions.list,
  };

  // Safest park
  const vandalismThoughts = countThoughts(
    thoughts.vandalism!,
    null,
    null,
    null,
    3,
  );
  const safest: TAwardQualification = {
    eligible: vandalismThoughts.passed && park.casualtyPenalty === 0,
    requirements: [
      `${vandalismThoughts.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${vandalismThoughts.actual} / ${vandalismThoughts.required - 1}`,
      park.casualtyPenalty === 0 ? `${SUCCESS_COLOUR}OK` : `${ERROR_COLOUR}No`,
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
  const staffTypes = (
    Object.keys(staffBreakdown) as (keyof typeof staffBreakdown)[]
  ).filter((key: StaffType) => staffBreakdown[key] > 0).length;
  const bestStaffExclusions = getExclusions("bestStaff");
  const bestStaff: TAwardQualification = {
    eligible:
      staff.length >= 20 &&
      staffTypes === 4 &&
      staff.length >= Math.floor(park.guests / 32) &&
      !bestStaffExclusions.excluded,
    requirements: [
      `${staff.length >= 20 ? SUCCESS_COLOUR : ERROR_COLOUR}${staff.length} / 20`,
      `${staffTypes === 4 ? SUCCESS_COLOUR : ERROR_COLOUR}${staffTypes} / 4`,
      `${staff.length >= Math.floor(park.guests / 32) ? SUCCESS_COLOUR : ERROR_COLOUR}${staff.length} / ${Math.floor(park.guests / 32)}`,
    ],
    exclusions: bestStaffExclusions.list,
  };

  // Best food
  const foodStalls = map.rides.filter(
    (ride) => ride.type === 28 && ride.status === "open",
  );
  const foodTypes: number[] = foodStalls.reduce((a: number[], r) => {
    if (a.indexOf(r.object.shopItem) === -1) a.push(r.object.shopItem);
    return a;
  }, []);
  const hungryGuests = countThoughts(thoughts.hungry!, null, null, null, 13);
  const bestFoodExclusions = getExclusions("bestFood");
  const bestFood: TAwardQualification = {
    eligible:
      foodStalls.length >= 7 &&
      foodStalls.length >= Math.floor(park.guests / 128) &&
      foodTypes.length >= 4 &&
      hungryGuests.passed &&
      !bestFoodExclusions.excluded,
    requirements: [
      `${foodStalls.length >= 7 ? SUCCESS_COLOUR : ERROR_COLOUR}${foodStalls.length} / 7`,
      `${foodTypes.length >= 4 ? SUCCESS_COLOUR : ERROR_COLOUR}${foodTypes.length} / 4`,
      `${foodStalls.length >= Math.floor(park.guests / 128) ? SUCCESS_COLOUR : ERROR_COLOUR}${foodStalls.length} / ${Math.floor(park.guests / 128)}`,
      `${hungryGuests.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${hungryGuests.actual} / 12`,
    ],
    exclusions: bestFoodExclusions.list,
  };

  // Best toilets
  const toilets = map.rides.filter(
    (ride) => ride.type === 36 && ride.status === "open",
  ).length;
  const needToilet = countThoughts(thoughts.toilet!, null, null, null, 17);
  const bestToilets: TAwardQualification = {
    eligible:
      toilets >= 4 &&
      toilets >= Math.floor(park.guests / 128) &&
      needToilet.passed,
    requirements: [
      `${toilets >= 4 ? SUCCESS_COLOUR : ERROR_COLOUR}${toilets} / 4`,
      `${toilets >= Math.floor(park.guests / 128) ? SUCCESS_COLOUR : ERROR_COLOUR}${toilets} / ${Math.floor(park.guests / 128)}`,
      `${needToilet.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${needToilet.actual} / ${needToilet.required - 1}`,
    ],
    exclusions: [],
  };

  // Best water rides
  const waterRides = allRides.filter(
    (ride) => ride.category === "water" && ride.status === "open",
  ).length;
  const bestWaterRides: TAwardQualification = {
    eligible: waterRides >= 6 && park.casualtyPenalty === 0,
    requirements: [
      `${waterRides >= 6 ? SUCCESS_COLOUR : ERROR_COLOUR}${waterRides} / 6`,
      park.casualtyPenalty === 0 ? `${SUCCESS_COLOUR}OK` : `${ERROR_COLOUR}No`,
    ],
    exclusions: [],
  };

  // Best custom designed rides
  const customRides = allRides.filter(
    (ride) =>
      (ride.excitement || 0) >= 550 &&
      !(ride.flags! & RIDE_LIFECYCLE_NOT_CUSTOM_DESIGN) &&
      ride.status === "open",
  ).length;
  const bestCustomDesignedRides: TAwardQualification = {
    eligible: customRides >= 6 && park.casualtyPenalty === 0,
    requirements: [
      `${customRides >= 6 ? SUCCESS_COLOUR : ERROR_COLOUR}${customRides} / 6`,
      park.casualtyPenalty === 0 ? `${SUCCESS_COLOUR}OK` : `${ERROR_COLOUR}No`,
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
  const mostDazzlingExclusions = getExclusions("mostDazzlingRideColours");
  const mostDazzlingRideColours: TAwardQualification = {
    eligible:
      openRides.length >= 5 &&
      2 * dazzlingRides >= openRides.length &&
      !mostDazzlingExclusions.excluded,
    requirements: [
      `${openRides.length >= 5 ? SUCCESS_COLOUR : ERROR_COLOUR}${openRides.length} / 5`,
      `${2 * dazzlingRides >= openRides.length ? SUCCESS_COLOUR : ERROR_COLOUR}${dazzlingRides} / ${Math.ceil(openRides.length / 2)}`,
    ],
    exclusions: mostDazzlingExclusions.list,
  };

  // Best gentle rides
  const gentleRides = allRides.filter(
    (ride) => ride.category === "gentle" && ride.status === "open",
  ).length;
  const bestGentleRides: TAwardQualification = {
    eligible: gentleRides >= 10,
    requirements: [
      `${gentleRides >= 10 ? SUCCESS_COLOUR : ERROR_COLOUR}${gentleRides} / 10`,
    ],
    exclusions: [],
  };

  // Most untidy park
  const untidyThoughts2 = countThoughts(
    thoughts.bad_litter! + thoughts.path_disgusting! + thoughts.vandalism!,
    16,
  );
  const untidyExclusions = getExclusions("mostUntidy");
  const mostUntidy: TAwardQualification = {
    eligible: untidyThoughts2.passed && !untidyExclusions.excluded,
    requirements: [
      `${untidyThoughts2.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${untidyThoughts2.actual} / ${untidyThoughts2.required}`,
    ],
    exclusions: untidyExclusions.list,
  };

  // Worst value park
  const worstValueExclusions = getExclusions("worstValue");
  const worstValue: TAwardQualification = {
    eligible:
      !park.getFlag("freeParkEntry") &&
			park.entranceFee > 0 &&
      park.entranceFee + 0.1 > park.totalRideValueForMoney &&
      !worstValueExclusions.excluded,
    requirements: [
      park.getFlag("freeParkEntry") || park.entranceFee === 0
        ? `${ERROR_COLOUR}None`
        : `${SUCCESS_COLOUR}Yes`,
      `${park.entranceFee > park.totalRideValueForMoney ? SUCCESS_COLOUR : ERROR_COLOUR}${formatCurrency(park.entranceFee)}/${formatCurrency(park.totalRideValueForMoney)}`,
    ],
    exclusions: worstValueExclusions.list,
  };

  // Worst food
  const hungryGuests2 = countThoughts(thoughts.hungry!, null, 16);
  const worstFoodExclusions = getExclusions("worstFood");
  const worstFood: TAwardQualification = {
    eligible:
      foodTypes.length <= 2 &&
      foodStalls.length < Math.floor(park.guests / 256) &&
      hungryGuests2.passed &&
      !worstFoodExclusions.excluded,
    requirements: [
      `${foodTypes.length <= 2 ? SUCCESS_COLOUR : ERROR_COLOUR}${foodTypes.length} / 2`,
      `${foodStalls.length < Math.floor(park.guests / 256) ? SUCCESS_COLOUR : ERROR_COLOUR}${foodStalls.length} / ${Math.floor(park.guests / 256)}`,
      `${hungryGuests2.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${hungryGuests2.actual} / 16`,
    ],
    exclusions: worstFoodExclusions.list,
  };

  // Most disappointing
  // BUG: https://github.com/OpenRCT2/OpenRCT2/issues/26266
  // This should be based on popularity, not satisfaction. Popularity is not exposed by the API.
  const disappointingRides = rides.filter(
    (ride) => ride.satisfaction < 6,
  ).length;
  const disappointingExclusions = getExclusions("mostDisappointing");
  const mostDisappointing: TAwardQualification = {
    eligible:
      park.rating <= 650 &&
      2 * disappointingRides > rides.length &&
      !disappointingExclusions.excluded,
    requirements: [
      `${park.rating <= 650 ? SUCCESS_COLOUR : ERROR_COLOUR}${park.rating} / 650`,
      `${2 * disappointingRides > rides.length ? SUCCESS_COLOUR : ERROR_COLOUR}${disappointingRides} / ${Math.floor(rides.length / 2)}`,
    ],
    exclusions: disappointingExclusions.list,
  };

  // Most confusing layout
  const lostGuests = countThoughts(
    thoughts.lost! + thoughts.cant_find!,
    null,
    10,
  );
  const lostGuests2 = countThoughts(thoughts.lost! + thoughts.cant_find!, 64);
  const mostConfusingLayout: TAwardQualification = {
    eligible: lostGuests.passed && lostGuests2.passed,
    requirements: [
      `${lostGuests.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${lostGuests.actual} / ${lostGuests.required}`,
      `${lostGuests2.passed ? SUCCESS_COLOUR : ERROR_COLOUR}${lostGuests2.actual} / ${lostGuests2.required}`,
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
    mostUntidy,
    worstValue,
    worstFood,
    mostDisappointing,
    mostConfusingLayout,
  };
  awardsInfo.forEach((award) => {
    if (!awards[award.name]) return;
    updateWidget(
      window,
      `labelAward${award.name}`,
      `${park.awards.filter((a) => a.type === award.name).length ? INFO_COLOUR : awards[award.name].eligible ? SUCCESS_COLOUR : ""}${award.text}`,
    );
    awards[award.name].requirements.forEach((req, index) => {
      updateWidget(window, `${award.name}Requirement${index}`, req);
    });
    awards[award.name].exclusions.forEach((exc, index) => {
      const w: ButtonWidget = window.findWidget(
        `${award.name}Exclusion${index}`,
      );
      w.image = exc.has ? ICONS.arrowRedDown : ICONS.certificate;
    });
  });
};
