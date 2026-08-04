/*
AWARDS:
	Positive ones: guest gen * 1.25
	Negative ones: guest gen * 0.75

	AWARD												CRITERIA																																																																												EXCLUSIONS
	Tidiest											More than 1/64 of guests thinking how tidy the park is, less than 6 thinking it's untidy.																																				Most untidy, most disappointing
	Untidiest										More than 1/16 of guests thinking the park is untidy: "The litter here is really bad", "This path is disgusting" or "The vandalism here is really bad".					Most beautiful, best staff, most tidy
	Best rollercoasters					6 open rollercoasters
	Best value									Extrance fee is 0.1 less than half the "total ride value for money". Not available when no entrance fee or no money.																						Most disappointing, worst value
	Most beautiful							More than 1/128 of guests think "Great scenery!" and less than 16 comment on how untidy it is.																																	Most untidy, most disappointing
	Worst value									Entrance fee is more than the "ride value for money"																																																						Best value
	Safest											Ride satefy setting must be 0. It goes to 8 for a fatal crash and 2 for a non-fatal one. Down by 1 each 2 weeks. No more than 2 think about vandalism.
	Best staff									At least 20 staff, one of each type. One staff per 32 guests. 																																																	Most untidy
	Best food										At least 7 food shops, of 4 types. One food shop per 128 guests and no more than 12 thinking "I'm hungry"																												Worst food?
	Worst food									No more than 2 types of food shops. Less than 1 per 256 guests. More than 15 hungry guests.																																			Best food
	Best restrooms							At least 4 toilets, one per 128 guests, no more than 16 thinking they need the toilet.																																					
	Most disappointing					Rating below 650, half rides popularity below 6. 																																																								Best value
	Best water rides						At least 6 water rides active and haven't crashed recently
	Best custom-designed rides	6 rides custom designed with excitement above 5.5
	Most dazzling								At least 5 TRACKED rides, and more than half are bright. That means the main track is bright purple, bright green, light orange, bring pink.										Most disappointing
	Most confusing park layout	At least 10 guests and 1/64 of guests thinking "I'm lost" or "I can't find X"
	Best gentle rides						At least 10 open gentle rides
*/

import { API_VERSION_STAFF_FIX } from "../constants";
import { arrayToObject } from "../helpers/array-to-object";

export type TAward = {
  name: AwardType;
  text: string;
  positive: boolean;
  requirements: string[];
  exclusion: AwardType[];
};

export const awardsInfo: TAward[] = [
  {
    name: "mostTidy",
    text: "Tidiest park",
    positive: true,
    requirements: [
      "More than 1/64 of guests think how tidy the park is",
      "Fewer than 6 guests think the park is untidy",
    ],
    exclusion: ["mostUntidy", "mostDisappointing"],
  },
  {
    name: "mostUntidy",
    text: "Most untidy park",
    positive: false,
    requirements: [
      "More than 1/16 of guests thinking about litter, vandalism or disgusting path",
    ],
    exclusion: ["mostBeautiful", "bestStaff", "mostTidy"],
  },
  {
    name: "bestRollerCoasters",
    text: "Best rollercoasters",
    positive: true,
    requirements: ["Have 6 open rollercoasters", "No recent crashes"],
    exclusion: [],
  },
  {
    name: "bestValue",
    text: "Best value park",
    positive: true,
    requirements: [
      "Scenario must be using money",
      "Must have a park entrance fee",
      "Entrance fee is 0.1 less than half the total ride value for money",
    ],
    exclusion: ["mostDisappointing", "worstValue"],
  },
  {
    name: "mostBeautiful",
    text: "Most beautiful park",
    positive: true,
    requirements: [
      "More than 1/128 of guests think the scenery is great",
      "Fewer than 16 think how untidy the park is",
    ],
    exclusion: ["mostUntidy", "mostDisappointing"],
  },
  {
    name: "worstValue",
    text: "Worst value park",
    positive: false,
    requirements: [
      "Scenario must be using money",
      "Must have a park entrance fee",
      "Entrance fee is more than the total ride value for money",
    ],
    exclusion: ["bestValue"],
  },
  {
    name: "safest",
    text: "Safest park",
    positive: true,
    requirements: [
      "2 or fewer think the vandalism is bad",
      "No recent crashes",
    ],
    exclusion: [],
  },
  {
    name: "bestStaff",
    text: "Best staff",
    positive: true,
    requirements: [
      "At least 20 staff",
      "One member of staff per 32 guests",
      context.apiVersion >= API_VERSION_STAFF_FIX ? "At least 1 of each staff type" : "",
    ].filter(Boolean),
    exclusion: ["mostUntidy"],
  },
  {
    name: "bestFood",
    text: "Best food",
    positive: true,
    requirements: [
      "At least 7 food shops",
      "4 different types of food shops",
      "One food shop per 128 guests",
      "No more than 12 hungry guests",
    ],
    exclusion: ["worstFood"],
  },
  {
    name: "worstFood",
    text: "Worst food",
    positive: false,
    requirements: [
      "No more than 2 types of food shop",
      "Fewer than 1 food shop per 256 guests",
      "More than 15 hungry guests",
    ],
    exclusion: ["bestFood"],
  },
  {
    name: "bestToilets",
    text: "Best toilets",
    positive: true,
    requirements: [
      "At least 4 toilets",
      "One toilet per 128 guests",
      "No more than 16 guests think they need the toilet",
    ],
    exclusion: [],
  },
  {
    name: "mostDisappointing",
    text: "Most disappointing park",
    positive: false,
    requirements: [
      "Park rating 650 or less",
      "More than half of rides have popularity rating below 6",
    ],
    exclusion: ["bestValue"],
  },
  {
    name: "bestWaterRides",
    text: "Best water rides",
    positive: true,
    requirements: ["At least 6 active water rides", "No recent crashes"],
    exclusion: [],
  },
  {
    name: "bestCustomDesignedRides",
    text: "Best custom rides",
    positive: true,
    requirements: [
      "At least 6 custom built rides with excitement of 5.5 or higher",
      "No recent crashes",
    ],
    exclusion: ["mostDisappointing"],
  },
  {
    name: "mostDazzlingRideColours",
    text: "Most dazzling colours",
    positive: true,
    requirements: [
      "At least 5 tracked rides",
      "More than half of them are bright purple, bright green, light orange or bright pink",
      "colours",
    ],
    exclusion: ["mostDisappointing"],
  },
  {
    name: "mostConfusingLayout",
    text: "Most confusing layout",
    positive: false,
    requirements: [
      "At least 10 guests are lost or can't find a ride",
      "More than 1/64 of guests are lost or can't find a ride",
    ],
    exclusion: [],
  },
  {
    name: "bestGentleRides",
    text: "Best gentle rides",
    positive: true,
    requirements: ["At least 10 open gentle rides"],
    exclusion: [],
  },
];

export const awardNames = arrayToObject(awardsInfo);
