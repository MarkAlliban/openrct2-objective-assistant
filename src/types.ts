export type TSortTable = {
  key: string;
  direction: number;
  set: Function;
};

export type TObjectiveTarget = {
  description: string[];
  guests?: number;
  parkValue?: number;
  rating?: number;
  year?: number;
  rollercoasters?: number;
  rollercoastersToComplete?: number[];
  excitementTarget?: number;
  lengthTarget?: number | null;
  rideIncome?: number;
  stallsIncome?: number;
  loan?: number;
  tab?: number;
};

export type TRideTypeInfo = {
  type: number;
  typeName: string;
  identifier: string;
  bonusValue: number;
  category:
    | "rollercoaster"
    | "gentle"
    | "water"
    | "thrill"
    | "transport"
    | "shop"
    | "none";
  ratingsMultipliers: [number, number, number];
  sameTypeAs?: string;
};

export type TRideInfo = Ride &
  TRideTypeInfo & {
    guestError: number;
    guestCount: number;
    valueCalculated: number | null;
    shopItems: { id: number; price: number }[];
    meetsLengthRequirement?: boolean;
    meetsExcitementRequirement?: boolean;
    meetsRequirements?: boolean;
    duplicateType?: boolean;
    maxPrices?: (number | null)[];
  };

export type TRidePrices = {
  id: number;
  age: number;
  currentPrice: number;
  prices: (number | null)[];
};

export type TItemData = {
  id: number;
  minPrice: number;
  maxPrice: number;
  data: TShopItem;
};

export type TShopItem = {
  itemId: number;
  basePrice: number;
  hotPrice: number;
  coldPrice: number;
  tempAdjustedPrice?: number;
  recommendedPrice?: number;
  name: string;
  oneOff?: boolean;
};

export type TAward = {
  name: AwardType;
  text: string;
  positive: boolean;
  requirements: string[];
  exclusion: AwardType[];
};
