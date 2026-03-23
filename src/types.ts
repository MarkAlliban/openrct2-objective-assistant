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
  tab?: number
};

export type TRideTypeInfo = {
  typeId: number;
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

export type TRideInfo = {
  name: string;
  id: number;
  classification?: string;
  type: number;
  status: string;
  breakdown: string;
  age?: number;
  price?: number[];
  rideLength?: number;
  excitement?: number;
  intensity?: number;
  nausea?: number;
  value?: number;
	flags?: number;

  typeName?: string;
  category?: string;
  bonusValue?: number;
  sameTypeAs?: string;
  ratingsMultipliers?: [number, number, number];
  shopItems?: { id: number; price: number }[];

  valueCalculated?: number | null;
  duplicateType?: boolean;
  meetsExcitementRequirement?: boolean;
  meetsLengthRequirement?: boolean;
  meetsRequirements?: boolean;
  error?: number;
  count?: number;
  incomplete?: boolean;
	agedValues?: number[],
  maxPrices?: number[];
};

export type TRidePrices = {
  id: number;
  age: number;
	currentPrice: number;
  prices: number[];
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
