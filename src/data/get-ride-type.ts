import { ERROR_COLOUR } from "../constants";

type TStatRequirements = {
  highestDropHeight?: number;
  numberOfDrops?: number;
  maxSpeed?: number;
  maxNegativeG?: number;
  maxLateralG?: number;
  rideLength?: number;
  maxUnderground?: number;
  inversions?: number;
  inversionOverrides?: string[];
  specialTrackPieces?: number;
};

export type TRideTypeData = {
  name: string;
  category: RideResearchCategory | undefined;
  ratingsMultipliers: [number, number, number];
  bonusValue: number;
  identifier: string;
  sameTypeAs?: string;
  statRequirements?: TStatRequirements;
};

const rideDataTable: { type: number; data: TRideTypeData }[] = [
  {
    type: 0,
    data: {
      name: "Spiral Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 85,
      identifier: "spiral_rc",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversionOverrides: ["numberOfDrops", "maxNegativeG"],
      },
    },
  },
  {
    type: 1,
    data: {
      name: "Stand-up Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 90,
      identifier: "stand_up_rc",
      statRequirements: {
        highestDropHeight: 9,
        maxSpeed: 22,
        maxNegativeG: 0.5,
      },
    },
  },
  {
    type: 2,
    data: {
      name: "Suspended Swinging Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 90,
      identifier: "suspended_swinging_rc",
      statRequirements: {
        highestDropHeight: 6,
        maxSpeed: 26,
        rideLength: 370,
        maxNegativeG: 0.6,
        maxLateralG: 1.5,
      },
    },
  },
  {
    type: 3,
    data: {
      name: "Inverted Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 100,
      identifier: "inverted_rc",
      statRequirements: {
        highestDropHeight: 9,
        maxSpeed: 22,
        maxNegativeG: 0.3,
        inversionOverrides: ["highestDropHeight", "maxNegativeG"],
      },
    },
  },
  {
    type: 4,
    data: {
      name: "Junior Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 60,
      identifier: "junior_rc",
      statRequirements: {
        highestDropHeight: 4,
        numberOfDrops: 1,
        maxSpeed: 16,
      },
    },
  },
  {
    type: 5,
    data: {
      name: "Miniature Railway",
      category: "transport",
      ratingsMultipliers: [70, 6, -10],
      bonusValue: 50,
      identifier: "miniature_railway",
      statRequirements: {
        rideLength: 200,
        maxUnderground: 50,
      },
    },
  },
  {
    type: 6,
    data: {
      name: "Monorail",
      category: "transport",
      ratingsMultipliers: [70, 6, -10],
      bonusValue: 60,
      identifier: "monorail",
      statRequirements: {
        rideLength: 170,
        maxUnderground: 50,
      },
    },
  },
  {
    type: 7,
    data: {
      name: "Mini Suspended Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 50,
      identifier: "mini_suspended_rc",
      statRequirements: {
        highestDropHeight: 4,
        maxSpeed: 17,
        rideLength: 200,
        maxLateralG: 1.3,
      },
    },
  },
  {
    type: 8,
    data: {
      name: "Boat Hire",
      category: "water",
      ratingsMultipliers: [70, 6, 0],
      bonusValue: 40,
      identifier: "boat_hire",
    },
  },
  {
    type: 9,
    data: {
      name: "Wooden Wild Mouse",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 30],
      bonusValue: 55,
      identifier: "wooden_wild_mouse",
      statRequirements: {
        highestDropHeight: 6,
        numberOfDrops: 3,
        maxSpeed: 16,
        rideLength: 170,
        maxNegativeG: 0.1,
        maxLateralG: 1.5,
      },
    },
  },
  {
    type: 10,
    data: {
      name: "Steeplechase",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 60,
      identifier: "steeplechase",
      statRequirements: {
        highestDropHeight: 3,
        numberOfDrops: 2,
        maxSpeed: 17,
        rideLength: 240,
        maxNegativeG: 0.5,
      },
    },
  },
  {
    type: 11,
    data: {
      name: "Car Ride",
      category: "gentle",
      ratingsMultipliers: [70, 10, 10],
      bonusValue: 50,
      identifier: "car_ride",
      statRequirements: {
        rideLength: 200,
      },
    },
  },
  {
    type: 12,
    data: {
      name: "Launched Freefall",
      category: "thrill",
      ratingsMultipliers: [50, 50, 10],
      bonusValue: 65,
      identifier: "launched_freefall",
    },
  },
  {
    type: 13,
    data: {
      name: "Bobsleigh Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 75,
      identifier: "bobsleigh_rc",
      statRequirements: {
        maxSpeed: 26,
        rideLength: 370,
        maxLateralG: 1.2,
      },
    },
  },
  {
    type: 14,
    data: {
      name: "Observation Tower",
      category: "gentle",
      ratingsMultipliers: [80, 10, 0],
      bonusValue: 45,
      identifier: "observation_tower",
    },
  },
  {
    type: 15,
    data: {
      name: "Looping Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 95,
      identifier: "looping_rc",
      statRequirements: {
        highestDropHeight: 10,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.1,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 16,
    data: {
      name: "Dinghy Slide",
      category: "water",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 55,
      identifier: "dinghy_slide",
      statRequirements: {
        highestDropHeight: 9,
        maxSpeed: 16,
        rideLength: 140,
      },
    },
  },
  {
    type: 17,
    data: {
      name: "Mine Train Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 85,
      identifier: "mine_train_rc",
      statRequirements: {
        highestDropHeight: 6,
        numberOfDrops: 2,
        maxSpeed: 22,
        rideLength: 370,
        maxNegativeG: 0.1,
      },
    },
  },
  {
    type: 18,
    data: {
      name: "Chairlift",
      category: "transport",
      ratingsMultipliers: [70, 10, 0],
      bonusValue: 55,
      identifier: "chairlift",
      statRequirements: {
        rideLength: 150,
        maxUnderground: 50,
      },
    },
  },
  {
    type: 19,
    data: {
      name: "Corkscrew Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 100,
      identifier: "corkscrew_rc",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 20,
    data: {
      name: "Maze",
      category: "gentle",
      ratingsMultipliers: [50, 0, 0],
      bonusValue: 40,
      identifier: "maze",
    },
  },
  {
    type: 21,
    data: {
      name: "Spiral Slide",
      category: "gentle",
      ratingsMultipliers: [50, 10, 0],
      bonusValue: 40,
      identifier: "spiral_slide",
    },
  },
  {
    type: 22,
    data: {
      name: "Go-Karts",
      category: "thrill",
      ratingsMultipliers: [120, 20, 0],
      bonusValue: 55,
      identifier: "go_karts",
      statRequirements: {
        maxUnderground: 25,
      },
    },
  },
  {
    type: 23,
    data: {
      name: "Log Flume",
      category: "water",
      ratingsMultipliers: [80, 34, 6],
      bonusValue: 65,
      identifier: "log_flume",
      statRequirements: {
        highestDropHeight: 4,
      },
    },
  },
  {
    type: 24,
    data: {
      name: "River Rapids",
      category: "water",
      ratingsMultipliers: [72, 26, 6],
      bonusValue: 70,
      identifier: "river_rapids",
      statRequirements: {
        highestDropHeight: 1,
        rideLength: 200,
      },
    },
  },
  {
    type: 25,
    data: {
      name: "Dodgems",
      category: "gentle",
      ratingsMultipliers: [40, 20, 0],
      bonusValue: 35,
      identifier: "dodgems",
    },
  },
  {
    type: 26,
    data: {
      name: "Swinging Ship",
      category: "thrill",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 35,
      identifier: "swinging_ship",
    },
  },
  {
    type: 27,
    data: {
      name: "Swinging Inverter Ship",
      category: "thrill",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 35,
      identifier: "swinging_inverter_ship",
    },
  },
  {
    type: 28,
    data: {
      name: "Food Stall",
      category: "shop",
      ratingsMultipliers: [0, 0, 0],
      bonusValue: 15,
      identifier: "food_stall",
    },
  },
  {
    type: 30,
    data: {
      name: "Drink Stall",
      category: "shop",
      ratingsMultipliers: [0, 0, 0],
      bonusValue: 15,
      identifier: "drink_stall",
    },
  },
  {
    type: 32,
    data: {
      name: "Shop",
      category: "shop",
      ratingsMultipliers: [0, 0, 0],
      bonusValue: 15,
      identifier: "shop",
    },
  },
  {
    type: 33,
    data: {
      name: "Merry-Go-Round",
      category: "gentle",
      ratingsMultipliers: [50, 10, 0],
      bonusValue: 45,
      identifier: "merry_go_round",
    },
  },
  {
    type: 35,
    data: {
      name: "Information Kiosk",
      category: "shop",
      ratingsMultipliers: [0, 0, 0],
      bonusValue: 15,
      identifier: "information_kiosk",
    },
  },
  {
    type: 36,
    data: {
      name: "Toilets",
      category: "shop",
      ratingsMultipliers: [0, 0, 0],
      bonusValue: 5,
      identifier: "toilets",
    },
  },
  {
    type: 37,
    data: {
      name: "Ferris Wheel",
      category: "gentle",
      ratingsMultipliers: [60, 20, 10],
      bonusValue: 45,
      identifier: "ferris_wheel",
    },
  },
  {
    type: 38,
    data: {
      name: "Motion Simulator",
      category: "thrill",
      ratingsMultipliers: [24, 20, 10],
      bonusValue: 45,
      identifier: "motion_simulator",
    },
  },
  {
    type: 39,
    data: {
      name: "3D Cinema",
      category: "thrill",
      ratingsMultipliers: [20, 10, 0],
      bonusValue: 45,
      identifier: "3d_cinema",
    },
  },
  {
    type: 40,
    data: {
      name: "Top Spin",
      category: "thrill",
      ratingsMultipliers: [24, 20, 10],
      bonusValue: 55,
      identifier: "top_spin",
    },
  },
  {
    type: 41,
    data: {
      name: "Space Rings",
      category: "gentle",
      ratingsMultipliers: [12, 4, 4],
      bonusValue: 30,
      identifier: "space_rings",
    },
  },
  {
    type: 42,
    data: {
      name: "Reverse Freefall Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [44, 66, 10],
      bonusValue: 70,
      identifier: "reverse_freefall_rc",
      statRequirements: {
        highestDropHeight: 25,
      },
    },
  },
  {
    type: 43,
    data: {
      name: "Lift",
      category: "transport",
      ratingsMultipliers: [80, 10, 0],
      bonusValue: 45,
      identifier: "lift",
    },
  },
  {
    type: 44,
    data: {
      name: "Vertical Drop Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [52, 38, 10],
      bonusValue: 95,
      identifier: "vertical_drop_rc",
      statRequirements: {
        highestDropHeight: 15,
        numberOfDrops: 1,
        maxSpeed: 22,
        maxNegativeG: 0.1,
      },
    },
  },
  {
    type: 45,
    data: {
      name: "Cash Machine",
      category: "shop",
      ratingsMultipliers: [0, 0, 0],
      bonusValue: 5,
      identifier: "cash_machine",
    },
  },
  {
    type: 46,
    data: {
      name: "Twist",
      category: "thrill",
      ratingsMultipliers: [40, 20, 10],
      bonusValue: 40,
      identifier: "twist",
    },
  },
  {
    type: 47,
    data: {
      name: "Haunted House",
      category: "gentle",
      ratingsMultipliers: [20, 10, 0],
      bonusValue: 22,
      identifier: "haunted_house",
    },
  },
  {
    type: 48,
    data: {
      name: "First Aid Room",
      category: "shop",
      ratingsMultipliers: [0, 0, 0],
      bonusValue: 5,
      identifier: "first_aid",
    },
  },
  {
    type: 49,
    data: {
      name: "Circus",
      category: "gentle",
      ratingsMultipliers: [20, 10, 0],
      bonusValue: 39,
      identifier: "circus",
    },
  },
  {
    type: 50,
    data: {
      name: "Ghost Train",
      category: "gentle",
      ratingsMultipliers: [70, 10, 10],
      bonusValue: 50,
      identifier: "ghost_train",
      statRequirements: { rideLength: 180 },
    },
  },
  {
    type: 51,
    data: {
      name: "Twister Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [52, 36, 10],
      bonusValue: 120,
      identifier: "twister_rc",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 52,
    data: {
      name: "Wooden Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [52, 33, 8],
      bonusValue: 105,
      identifier: "wooden_rc",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 22,
        rideLength: 370,
        maxNegativeG: 0.1,
      },
    },
  },
  {
    type: 53,
    data: {
      name: "Side-Friction Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [48, 28, 7],
      bonusValue: 65,
      identifier: "side_friction_rc",
      statRequirements: {
        highestDropHeight: 4,
        numberOfDrops: 2,
        maxSpeed: 11,
        rideLength: 250,
      },
    },
  },
  {
    type: 54,
    data: {
      name: "Steel Wild Mouse",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 30],
      bonusValue: 55,
      identifier: "steel_wild_mouse",
      statRequirements: {
        highestDropHeight: 4,
        numberOfDrops: 2,
        maxSpeed: 16,
        rideLength: 170,
        maxLateralG: 1.5,
      },
    },
  },
  {
    type: 55,
    data: {
      name: "Multi-Dimension Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 100,
      identifier: "multi_dimension_rc",
      statRequirements: {
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversions: 1,
        inversionOverrides: ["numberOfDrops", "maxNegativeG"],
      },
    },
  },
  {
    type: 57,
    data: {
      name: "Flying Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 100,
      identifier: "flying_rc",
      statRequirements: {
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversions: 1,
        inversionOverrides: ["maxNegativeG"],
      },
    },
  },
  {
    type: 59,
    data: {
      name: "Virginia Reel",
      category: "rollercoaster",
      ratingsMultipliers: [30, 15, 25],
      bonusValue: 50,
      identifier: "virginia_reel",
      statRequirements: {
        numberOfDrops: 2,
        rideLength: 210,
      },
    },
  },
  {
    type: 60,
    data: {
      name: "Splash Boats",
      category: "water",
      ratingsMultipliers: [80, 34, 6],
      bonusValue: 65,
      identifier: "splash_boats",
      statRequirements: {
        highestDropHeight: 4,
      },
    },
  },
  {
    type: 61,
    data: {
      name: "Mini Helicopters",
      category: "gentle",
      ratingsMultipliers: [70, 10, 10],
      bonusValue: 45,
      identifier: "mini_helicopters",
      statRequirements: {
        rideLength: 160,
      },
    },
  },
  {
    type: 62,
    data: {
      name: "Lay-down Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 100,
      identifier: "lay_down_rc",
      statRequirements: {
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversions: 1,
        inversionOverrides: ["numberOfDrops", "maxNegativeG"],
      },
    },
  },
  {
    type: 63,
    data: {
      name: "Suspended Monorail",
      category: "transport",
      ratingsMultipliers: [70, 6, -10],
      bonusValue: 60,
      identifier: "suspended_monorail",
      statRequirements: {
        rideLength: 170,
        maxUnderground: 50,
      },
    },
  },
  {
    type: 65,
    data: {
      name: "Reverser Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [48, 28, 7],
      bonusValue: 65,
      identifier: "reverser_rc",
      statRequirements: {
        numberOfDrops: 2,
        rideLength: 200,
        specialTrackPieces: 1,
      },
    },
  },
  {
    type: 66,
    data: {
      name: "Heartline Twister Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 70,
      identifier: "heartline_twister_rc",
      statRequirements: {
        numberOfDrops: 1,
        inversions: 1,
      },
    },
  },
  {
    type: 67,
    data: {
      name: "Mini Golf",
      category: "gentle",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 23,
      identifier: "mini_golf",
      statRequirements: {
        specialTrackPieces: 1,
      },
    },
  },
  {
    type: 68,
    data: {
      name: "Giga Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [51, 32, 10],
      bonusValue: 120,
      identifier: "giga_rc",
      statRequirements: {
        highestDropHeight: 12,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 69,
    data: {
      name: "Roto-Drop",
      category: "thrill",
      ratingsMultipliers: [50, 50, 10],
      bonusValue: 45,
      identifier: "roto_drop",
    },
  },
  {
    type: 70,
    data: {
      name: "Flying Saucers",
      category: "gentle",
      ratingsMultipliers: [50, 25, 0],
      bonusValue: 35,
      identifier: "flying_saucers",
    },
  },
  {
    type: 71,
    data: {
      name: "Crooked House",
      category: "gentle",
      ratingsMultipliers: [15, 8, 0],
      bonusValue: 22,
      identifier: "crooked_house",
    },
  },
  {
    type: 72,
    data: {
      name: "Monorail Cycles",
      category: "gentle",
      ratingsMultipliers: [50, 10, 10],
      bonusValue: 45,
      identifier: "monorail_cycles",
      statRequirements: {
        rideLength: 140,
      },
    },
  },
  {
    type: 73,
    data: {
      name: "Compact Inverted Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 80,
      identifier: "compact_inverted_rc",
      sameTypeAs: "Inverted Roller Coaster",
      statRequirements: {
        highestDropHeight: 9,
        maxSpeed: 22,
        maxNegativeG: 0.3,
        inversionOverrides: ["highestDropHeight", "maxNegativeG"],
      },
    },
  },
  {
    type: 74,
    data: {
      name: "Water Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 60,
      identifier: "water_coaster",
      statRequirements: {
        highestDropHeight: 6,
        numberOfDrops: 1,
        maxSpeed: 16,
        specialTrackPieces: 1,
      },
    },
  },
  {
    type: 75,
    data: {
      name: "Air Powered Vertical Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [44, 66, 10],
      bonusValue: 70,
      identifier: "air_powered_vertical_rc",
      statRequirements: {
        highestDropHeight: 25,
      },
    },
  },
  {
    type: 76,
    data: {
      name: "Inverted Hairpin Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 30],
      bonusValue: 55,
      identifier: "inverted_hairpin_rc",
      statRequirements: {
        highestDropHeight: 6,
        numberOfDrops: 3,
        maxSpeed: 16,
        rideLength: 170,
        maxNegativeG: 0.1,
        maxLateralG: 1.5,
      },
    },
  },
  {
    type: 77,
    data: {
      name: "Magic Carpet",
      category: "thrill",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 35,
      identifier: "magic_carpet",
    },
  },
  {
    type: 78,
    data: {
      name: "Submarine Ride",
      category: "water",
      ratingsMultipliers: [70, 6, 0],
      bonusValue: 40,
      identifier: "submarine_ride",
    },
  },
  {
    type: 79,
    data: {
      name: "River Rafts",
      category: "water",
      ratingsMultipliers: [80, 34, 6],
      bonusValue: 65,
      identifier: "river_rafts",
    },
  },
  {
    type: 81,
    data: {
      name: "Enterprise",
      category: "thrill",
      ratingsMultipliers: [50, 10, 0],
      bonusValue: 45,
      identifier: "enterprise",
    },
  },
  {
    type: 86,
    data: {
      name: "Inverted Impulse Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 75,
      identifier: "inverted_impulse_rc",
      statRequirements: {
        highestDropHeight: 15,
        maxSpeed: 22,
      },
    },
  },
  {
    type: 87,
    data: {
      name: "Mini Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 60,
      identifier: "mini_rc",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 16,
        maxNegativeG: 0.5,
      },
    },
  },
  {
    type: 88,
    data: {
      name: "Mine Ride",
      category: "rollercoaster",
      ratingsMultipliers: [60, 20, 10],
      bonusValue: 70,
      identifier: "mine_ride",
      statRequirements: {
        rideLength: 270,
      },
    },
  },
  {
    type: 90,
    data: {
      name: "LIM Launched Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 55,
      identifier: "lim_launched_rc",
      statRequirements: {
        highestDropHeight: 7,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.1,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 91,
    data: {
      name: "Hypercoaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 100,
      identifier: "hypercoaster",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 92,
    data: {
      name: "Hyper-Twister",
      category: "rollercoaster",
      ratingsMultipliers: [52, 36, 10],
      bonusValue: 120,
      identifier: "hyper_twister",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 93,
    data: {
      name: "Monster Trucks",
      category: "gentle",
      ratingsMultipliers: [70, 10, 10],
      bonusValue: 50,
      identifier: "monster_trucks",
      statRequirements: {
        rideLength: 200,
      },
    },
  },
  {
    type: 94,
    data: {
      name: "Spinning Wild Mouse",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 30],
      bonusValue: 55,
      identifier: "spinning_wild_mouse",
      statRequirements: {
        highestDropHeight: 4,
        numberOfDrops: 2,
        maxSpeed: 16,
        rideLength: 170,
        maxLateralG: 1.5,
      },
    },
  },
  {
    type: 95,
    data: {
      name: "Classic Mini Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 60,
      identifier: "classic_mini_rc",
      statRequirements: {
        highestDropHeight: 4,
        maxSpeed: 16,
        numberOfDrops: 2,
      },
    },
  },
  {
    type: 96,
    data: {
      name: "Hybrid Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [52, 36, 10],
      bonusValue: 120,
      identifier: "hybrid_rc",
      statRequirements: {
        highestDropHeight: 10,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 97,
    data: {
      name: "Single Rail Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [52, 36, 10],
      bonusValue: 80,
      identifier: "single_rail_rc",
      statRequirements: {
        highestDropHeight: 10,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.4,
        inversionOverrides: [
          "highestDropHeight",
          "numberOfDrops",
          "maxNegativeG",
        ],
      },
    },
  },
  {
    type: 98,
    data: {
      name: "Alpine Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 65,
      identifier: "alpine_rc",
      statRequirements: {
        maxSpeed: 11,
        rideLength: 370,
        maxNegativeG: 0.4,
      },
    },
  },
  {
    type: 99,
    data: {
      name: "Classic Wooden Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [52, 33, 4],
      bonusValue: 105,
      identifier: "classic_wooden_rc",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 22,
        rideLength: 370,
        maxNegativeG: 0.1,
      },
    },
  },
  {
    type: 100,
    data: {
      name: "Classic Stand-up Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [50, 30, 10],
      bonusValue: 90,
      identifier: "classic_stand_up_rc",
      statRequirements: {
        highestDropHeight: 9,
        maxSpeed: 22,
        maxNegativeG: 0.5,
      },
    },
  },
  {
    type: 101,
    data: {
      name: "LSM Launched Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [51, 32, 10],
      bonusValue: 120,
      identifier: "lsm_rc",
      statRequirements: {
        highestDropHeight: 7,
        numberOfDrops: 2,
        maxSpeed: 22,
        maxNegativeG: 0.1,
      },
    },
  },
  {
    type: 102,
    data: {
      name: "Classic Wooden Twister Roller Coaster",
      category: "rollercoaster",
      ratingsMultipliers: [52, 33, 4],
      bonusValue: 105,
      identifier: "classic_wooden_twister_rc",
      statRequirements: {
        highestDropHeight: 9,
        numberOfDrops: 2,
        maxSpeed: 22,
        rideLength: 370,
        maxNegativeG: 0.1,
      },
    },
  },
];

/*
	UNKNOWN RIDE TYPES:
  {
    category: "none",
    ratingsMultipliers: [50, 30, 10],
    bonusValue: 100,
    identifier: "flying_rc_alt",
  },
  {
    category: "none",
    ratingsMultipliers: [50, 30, 10],
    bonusValue: 100,
    identifier: "lay_down_rc_alt",
  },
  {
    category: "none",
    ratingsMultipliers: [50, 30, 10],
    bonusValue: 100,
    identifier: "multi_dimension_rc_alt",
  },
*/

export function getRideType(type: number): TRideTypeData {
  const info = rideDataTable.find((r) => r.type === type)?.data;
  return (
    info || {
      name: `${ERROR_COLOUR}Unknown ride type ${type}`,
      category: undefined,
      ratingsMultipliers: [0, 0, 0],
      bonusValue: 0,
      identifier: "none",
    }
  );
}
