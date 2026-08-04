/*
COLOUR IDs:
0: Black							1: Gray							2: White							3: Dark purple
4: Light purple				5: Bright purple		6: Dark blue					7: Light blue
8: Icy blue						9: Dark water				10: Light water				11: Saturated green
12: Dark green				13: Moss green			14: Bright green			15: Olive green
16: Dark olive green	17: Bright yellow		18: Yellow						19: Dark yellow
20: Light orange			21: Dark orange			22: Light brown				23: Saturated brown
24: Dark brown				25: Salmon pink			26: Bordeaux red			27: Saturated red
28: Bright red				29: Dark pink				30: Bright pink				31: Light pink

COLOURS THAT CAN BE USED FOR TEXT eg. {RED}:
BLACK					Black							#000
GREY					Grey							#888
WHITE					White							#fff
RED						Red								#f00
GREEN					Green							#0f0
YELLOW				Yellow						#ff0
TOPAZ					Orange						#FFB76B
CELADON				Light green				#AFDBC3
BABYBLUE			Light blue				#8FD3F3
PALELAVENDER	Light purple			#D7C3F3
PALEGOLD			Dirty yellow			#DBC787
LIGHTPINK			Pink							#FFBFBF
PEARLAQUA			Light bluish			#83CFCF
PALESILVER		Grey-yellow				#CFC3AB

TEXT STYLES:
NEWLINE
NEWLINE_SMALLER
TINYFONT
MEDIUMFONT
SMALLFONT
OUTLINE
OUTLINE_OFF
*/

export const TITLE = "Objective Assistant";
export const WINDOW_WIDTH = 410;
export const WINDOW_HEIGHT = 355;
export const WINDOW_HEIGHT_MIN = 150;
export const BACKGROUND_COLOUR = 3;
export const FOREGROUND_COLOUR = 4;

export const TICKS_PER_SECOND = 40;
export const TICKS_PER_MONTH = 65536;
export const TICKS_PER_YEAR = TICKS_PER_MONTH * 8;
export const MONTH_DAYS = [31, 30, 31, 30, 31, 31, 30, 31];
export const DAYS_PER_YEAR = MONTH_DAYS.reduce((a, m) => a + m, 0);
export const TEMP_COLD = 12;
export const TEMP_HOT = 21;

export const SAVED_DATA = {
  automatePrices: "automate-prices",
  pricingStrategy: "pricing-strategy",
  automateShopPrices: "automate-shop-prices",
  shopPricingStrategy: "shop-pricing-strategy",
};

export const SUCCESS_COLOUR = "{GREEN}";
export const ERROR_COLOUR = "{RED}";
export const WARNING_COLOUR = "{TOPAZ}";
export const INFO_COLOUR = "{PALEGOLD}";
export const READABLE_ERROR_COLOUR = "{LIGHTPINK}";
export const UI_VALUE_WIDTH = 100;
export const UI_VALUE_HEIGHT = 12;
export const UI_LINE_LENGTH = 40;
export const WARNING_DAYS = 31;

export const RIDE_LIFECYCLE_NOT_CUSTOM_DESIGN = 1 << 18;
export const TRACK_DESIGN_FLAG = 1 << 5;
export const DAZZLING_COLOURS = [5, 14, 20, 30];
export const API_VERSION_STAFF_FIX = 116;

export const ICONS = {
  objective: {
    frameBase: 5511,
    frameCount: 16,
    frameDuration: 2,
  },
  crowd: {
    frameBase: 5568,
    frameCount: 8,
    frameDuration: 2,
  },
  chart: {
    frameBase: 5375,
    frameCount: 16,
    frameDuration: 2,
  },
  coasters: {
    frameBase: 5546,
    frameCount: 5,
    frameDuration: 2,
  },
  money: {
    frameBase: 5253,
    frameCount: 8,
    frameDuration: 2,
  },
  burger: {
    frameBase: 5351,
    frameCount: 16,
    frameDuration: 2,
  },
  awards: "awards" as IconName,
  stats: {
    frameBase: 5407,
    frameCount: 16,
    frameDuration: 2,
  },
  info: 5129,
  certificate: 5115,
  rosetteRed: 5470,
  rosetteGreen: 5472,
  thumbsDown: 5480,
  rosetteBlue: 5481,
  arrowGreenUp: 5130,
  arrowRedDown: 5131,
  greenLight: 29384,
  redLight: 29376,
  yellowLight: 29380,
};
