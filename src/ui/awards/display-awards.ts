import {
  DAZZLING_COLOURS,
  ERROR_COLOUR,
  ICONS,
  INFO_COLOUR,
  RIDE_LIFECYCLE_NOT_CUSTOM_DESIGN,
	SUCCESS_COLOUR,
} from "../../constants";
import { TGuestTracker } from "../../data-model/guest-tracker";
import { TRideExtended, TRideTracker } from "../../data-model/ride-tracker";
import { awardNames, awardsInfo } from "../../data/awards-info";
import { formatCurrency } from "../../helpers/format-currency";
import { updateWidget } from "../../helpers/update-widgets";

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
      has: awardsCurrent.includes(exclusion),
    };
  });
  return { excluded: exclusions.some((e) => e.has), list: exclusions };
};

export const displayAwards = (
  window: Window,
  rideTracker: TRideTracker,
  guestTracker: TGuestTracker,
) => {
  // Get guest thoughts
  const thoughts = guestTracker.getGuestThoughts();

  // Get ride data
  const allRides = rideTracker.getRides();
  const rides = allRides.filter(
    (ride: TRideExtended) => ride.ride.classification === "ride",
  );
  const openRides = rides.filter(
    (ride: TRideExtended) => ride.ride.status === "open",
  );
  const trackedRides = openRides.filter(
    (ride: TRideExtended) => ride.ride.rideLength > 0,
  );

  // BUG: https://github.com/OpenRCT2/OpenRCT2/issues/26266
  // This should be based on popularity, not satisfaction. Popularity is not exposed by the API.
  const disappointingRides = rides.filter(
    (ride: TRideExtended) => ride.ride.satisfaction < 6,
  ).length;
  const dazzlingRides = trackedRides.filter((ride: TRideExtended) =>
    ride.ride.colourSchemes.some((scheme) =>
      DAZZLING_COLOURS.includes(scheme.main),
    ),
  );
  const coasters = openRides.filter(
    (ride: TRideExtended) => ride.typeData.category === "rollercoaster",
  ).length;
  const waterRides = openRides.filter(
    (ride: TRideExtended) => ride.typeData.category === "water",
  ).length;
  const customRides = openRides.filter(
    (ride: TRideExtended) =>
      (ride.ride.excitement || 0) >= 550 &&
      !(ride.ride.flags! & RIDE_LIFECYCLE_NOT_CUSTOM_DESIGN),
  ).length;
  const gentleRides = openRides.filter(
    (ride: TRideExtended) => ride.typeData.category === "gentle",
  ).length;
  const foodStalls = allRides.filter(
    (ride: TRideExtended) =>
      ride.ride.type === 28 && ride.ride.status === "open",
  );
  const toilets = allRides.filter(
    (ride: TRideExtended) =>
      ride.ride.type === 36 && ride.ride.status === "open",
  );

  // Do some calculations
  const tidyThoughts = thoughts.very_clean!;
  const untidyThoughts =
    thoughts.bad_litter! + thoughts.path_disgusting! + thoughts.vandalism!;
  const sceneryThoughts = thoughts.scenery!;
  const vandalismThoughts = thoughts.vandalism!;
  const hungryThoughts = thoughts.hungry!;
  const toiletThoughts = thoughts.toilet!;
  const lostThoughts = thoughts.lost! + thoughts.cant_find!;
  const foodTypes = new Set(
    foodStalls.map((ride: TRideExtended) => ride.ride.object.shopItem),
  ).size;
  const staff = map.getAllEntities("staff");
  const staffTypes = new Set(staff.map((s) => s.staffType)).size;

  // Most untidy park: more than 1/16 of the total guests must be thinking untidy thoughts
  const untidyExclusions = getExclusions("mostUntidy");
  const mostUntidy: TAwardQualification = {
    eligible: untidyThoughts > park.guests / 16 && !untidyExclusions.excluded,
    requirements: [
      `${untidyThoughts > Math.floor(park.guests / 16) ? SUCCESS_COLOUR : ERROR_COLOUR}${untidyThoughts} / ${Math.floor(park.guests / 16) + 1}`,
    ],
    exclusions: untidyExclusions.list,
  };

  // Most tidy park: more than 1/64 of the total guests must be thinking tidy thoughts and fewer than 6 guests thinking untidy thoughts
  const tidyExclusions = getExclusions("mostTidy");
  const mostTidy: TAwardQualification = {
    eligible:
      tidyThoughts > park.guests / 64 &&
      untidyThoughts < 6 &&
      !tidyExclusions.excluded,
    requirements: [
      `${tidyThoughts > Math.floor(park.guests / 64) ? SUCCESS_COLOUR : ERROR_COLOUR}${tidyThoughts} / ${Math.floor(park.guests / 64) + 1}`,
      `${untidyThoughts < 6 ? SUCCESS_COLOUR : ERROR_COLOUR}${untidyThoughts} / 5`,
    ],
    exclusions: tidyExclusions.list,
  };

  // Best rollercoasters: at least 6 open roller coasters and no crashes
  const bestRollerCoasters: TAwardQualification = {
    eligible: coasters >= 6 && park.casualtyPenalty === 0,
    requirements: [
      `${coasters >= 6 ? SUCCESS_COLOUR : ERROR_COLOUR}${coasters} / 6`,
      park.casualtyPenalty === 0 ? `${SUCCESS_COLOUR}OK` : `${ERROR_COLOUR}No`,
    ],
    exclusions: [],
  };

  // Best value park: entrance fee is 0.10 less than half of the total ride value
  const bestValueExclusions = getExclusions("bestValue");
  const entranceFeeTarget = Math.max(park.totalRideValueForMoney / 2 - 1, 0);
  const bestValue: TAwardQualification = {
    eligible:
      !park.getFlag("noMoney") &&
      !park.getFlag("freeParkEntry") &&
      park.entranceFee > 0 &&
      park.entranceFee <= entranceFeeTarget &&
      !bestValueExclusions.excluded,
    requirements: [
      park.getFlag("noMoney") ? `${ERROR_COLOUR}No` : `${SUCCESS_COLOUR}Yes`,
      park.getFlag("freeParkEntry") || park.entranceFee === 0
        ? `${ERROR_COLOUR}No`
        : `${SUCCESS_COLOUR}Yes`,
      `${park.entranceFee <= entranceFeeTarget ? SUCCESS_COLOUR : ERROR_COLOUR}${formatCurrency(park.entranceFee)}/${formatCurrency(10 * Math.floor(entranceFeeTarget / 10))}`,
    ],
    exclusions: bestValueExclusions.list,
  };

  // Most beautiful park: more than 1/128 of the total guests must be thinking scenic thoughts and fewer than 16 untidy thoughts
  const mostBeautifulExclusions = getExclusions("mostBeautiful");
  const mostBeautiful: TAwardQualification = {
    eligible:
      sceneryThoughts > park.guests / 128 &&
      untidyThoughts < 16 &&
      !mostBeautifulExclusions.excluded,
    requirements: [
      `${sceneryThoughts > park.guests / 128 ? SUCCESS_COLOUR : ERROR_COLOUR}${sceneryThoughts} / ${Math.floor(park.guests / 128) + 1}`,
      `${untidyThoughts < 16 ? SUCCESS_COLOUR : ERROR_COLOUR}${untidyThoughts} / 15`,
    ],
    exclusions: mostBeautifulExclusions.list,
  };

  // Worst value park: entrance fee is more than total ride value
  const worstValueExclusions = getExclusions("worstValue");
  const worstValue: TAwardQualification = {
    eligible:
      !park.getFlag("noMoney") &&
      !park.getFlag("freeParkEntry") &&
      park.entranceFee > 0 &&
      park.entranceFee > park.totalRideValueForMoney &&
      !worstValueExclusions.excluded,
    requirements: [
      park.getFlag("noMoney") ? `${ERROR_COLOUR}No` : `${SUCCESS_COLOUR}Yes`,
      park.getFlag("freeParkEntry") || park.entranceFee === 0
        ? `${ERROR_COLOUR}No`
        : `${SUCCESS_COLOUR}Yes`,
      `${park.entranceFee > park.totalRideValueForMoney ? SUCCESS_COLOUR : ERROR_COLOUR}${formatCurrency(park.entranceFee)}/${formatCurrency(park.totalRideValueForMoney)}`,
    ],
    exclusions: worstValueExclusions.list,
  };

  // Safest park: no more than 2 people who think the vandalism is bad and no crashes
  const safestEligible = vandalismThoughts <= 2 && park.casualtyPenalty === 0;
  const safest: TAwardQualification = {
    eligible: safestEligible,
    requirements: [
      `${vandalismThoughts <= 2 ? SUCCESS_COLOUR : ERROR_COLOUR}${vandalismThoughts} / 2`,
      park.casualtyPenalty === 0 ? `${SUCCESS_COLOUR}OK` : `${ERROR_COLOUR}No`,
    ],
    exclusions: [],
  };

  // Best staff: all staff types, at least 20 staff, one staff per 32 peeps
  const bestStaffExclusions = getExclusions("bestStaff");
  const bestStaff: TAwardQualification = {
    eligible:
      staff.length >= 20 &&
      staffTypes === 4 &&
      staff.length >= park.guests / 32 &&
      !bestStaffExclusions.excluded,
    requirements: [
      `${staff.length >= 20 ? SUCCESS_COLOUR : ERROR_COLOUR}${staff.length} / 20`,
      `${staffTypes === 4 ? SUCCESS_COLOUR : ERROR_COLOUR}${staffTypes} / 4`,
      `${staff.length >= park.guests / 32 ? SUCCESS_COLOUR : ERROR_COLOUR}${staff.length} / ${Math.ceil(park.guests / 32)}`,
    ],
    exclusions: bestStaffExclusions.list,
  };

  // Best food: at least 7 shops, 4 unique, one shop per 128 guests and no more than 12 hungry guests
  const bestFoodExclusions = getExclusions("bestFood");
  const bestFood: TAwardQualification = {
    eligible:
      foodStalls.length >= 7 &&
      foodTypes >= 4 &&
      foodStalls.length >= park.guests / 128 &&
      hungryThoughts <= 12 &&
      !bestFoodExclusions.excluded,
    requirements: [
      `${foodStalls.length >= 7 ? SUCCESS_COLOUR : ERROR_COLOUR}${foodStalls.length} / 7`,
      `${foodTypes >= 4 ? SUCCESS_COLOUR : ERROR_COLOUR}${foodTypes} / 4`,
      `${foodStalls.length >= park.guests / 128 ? SUCCESS_COLOUR : ERROR_COLOUR}${foodStalls.length} / ${Math.ceil(park.guests / 128)}`,
      `${hungryThoughts <= 12 ? SUCCESS_COLOUR : ERROR_COLOUR}${hungryThoughts} / 12`,
    ],
    exclusions: bestFoodExclusions.list,
  };

  // Worst food: no more than 2 unique shops, less than one shop per 256 guests and more than 15 hungry guests
  const worstFoodExclusions = getExclusions("worstFood");
  const worstFood: TAwardQualification = {
    eligible:
      foodTypes <= 2 &&
      foodStalls.length <= park.guests / 256 &&
      hungryThoughts > 15 &&
      !worstFoodExclusions.excluded,
    requirements: [
      `${foodTypes <= 2 ? SUCCESS_COLOUR : ERROR_COLOUR}${foodTypes} / 2`,
      `${foodStalls.length <= park.guests / 256 ? SUCCESS_COLOUR : ERROR_COLOUR}${foodStalls.length} / ${Math.floor(park.guests / 256)}`,
      `${hungryThoughts > 15 ? SUCCESS_COLOUR : ERROR_COLOUR}${hungryThoughts} / 16`,
    ],
    exclusions: worstFoodExclusions.list,
  };

  // Best toilets: at least 4 toilets, 1 toilet per 128 guests and no more than 16 guests who think they need the toilet
  const bestToilets: TAwardQualification = {
    eligible:
      toilets.length >= 4 &&
      toilets.length >= park.guests / 128 &&
      toiletThoughts <= 16,
    requirements: [
      `${toilets.length >= 4 ? SUCCESS_COLOUR : ERROR_COLOUR}${toilets.length} / 4`,
      `${toilets.length >= park.guests / 128 ? SUCCESS_COLOUR : ERROR_COLOUR}${toilets.length} / ${Math.ceil(park.guests / 128)}`,
      `${toiletThoughts <= 16 ? SUCCESS_COLOUR : ERROR_COLOUR}${toiletThoughts} / 16`,
    ],
    exclusions: [],
  };

  // Most disappointing: more than half of the rides have popularity <= 6 and park rating <= 650
  const disappointingExclusions = getExclusions("mostDisappointing");
  const mostDisappointing: TAwardQualification = {
    eligible:
      park.rating <= 650 &&
      disappointingRides >= rides.length / 2 &&
      !disappointingExclusions.excluded,
    requirements: [
      `${park.rating <= 650 ? SUCCESS_COLOUR : ERROR_COLOUR}${park.rating} / 650`,
      `${disappointingRides >= rides.length / 2 ? SUCCESS_COLOUR : ERROR_COLOUR}${disappointingRides} / ${Math.floor(rides.length / 2)}`,
    ],
    exclusions: disappointingExclusions.list,
  };

  // Best water rides: at least 6 open water rides
  const bestWaterRides: TAwardQualification = {
    eligible: waterRides >= 6 && park.casualtyPenalty === 0,
    requirements: [
      `${waterRides >= 6 ? SUCCESS_COLOUR : ERROR_COLOUR}${waterRides} / 6`,
      park.casualtyPenalty === 0 ? `${SUCCESS_COLOUR}OK` : `${ERROR_COLOUR}No`,
    ],
    exclusions: [],
  };

  // Best custom designed rides: at least 6 custom designed rides
  const customExclusions = getExclusions("bestCustomDesignedRides");
  const bestCustomDesignedRides: TAwardQualification = {
    eligible:
      customRides >= 6 &&
      park.casualtyPenalty === 0 &&
      !customExclusions.excluded,
    requirements: [
      `${customRides >= 6 ? SUCCESS_COLOUR : ERROR_COLOUR}${customRides} / 6`,
      park.casualtyPenalty === 0 ? `${SUCCESS_COLOUR}OK` : `${ERROR_COLOUR}No`,
    ],
    exclusions: [],
  };

  // Most dazzling colours: at least 5 colourful rides and more than half of the rides are colourful
  const mostDazzlingExclusions = getExclusions("mostDazzlingRideColours");
  const mostDazzlingRideColours: TAwardQualification = {
    eligible:
      trackedRides.length >= 5 &&
      dazzlingRides.length >= trackedRides.length / 2 &&
      !mostDazzlingExclusions.excluded,
    requirements: [
      `${trackedRides.length >= 5 ? SUCCESS_COLOUR : ERROR_COLOUR}${trackedRides.length} / 5`,
      `${dazzlingRides.length >= trackedRides.length / 2 ? SUCCESS_COLOUR : ERROR_COLOUR}${dazzlingRides.length} / ${Math.ceil(trackedRides.length / 2)}`,
    ],
    exclusions: mostDazzlingExclusions.list,
  };

  // Most confusing layout: at least 10 peeps and more than 1/64 of total guests are lost or can't find something
  const mostConfusingLayout: TAwardQualification = {
    eligible: lostThoughts >= 10 && lostThoughts >= park.guests / 64,
    requirements: [
      `${lostThoughts >= 10 ? SUCCESS_COLOUR : ERROR_COLOUR}${lostThoughts} / 10`,
      `${lostThoughts >= park.guests / 64 ? SUCCESS_COLOUR : ERROR_COLOUR}${lostThoughts} / ${Math.floor(park.guests / 64) + 1}`,
    ],
    exclusions: [],
  };

  // Best gentle rides: at least 10 open gentle rides
  const bestGentleRides: TAwardQualification = {
    eligible: gentleRides >= 10,
    requirements: [
      `${gentleRides >= 10 ? SUCCESS_COLOUR : ERROR_COLOUR}${gentleRides} / 10`,
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
