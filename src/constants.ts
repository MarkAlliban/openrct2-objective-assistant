export const TITLE = "Objective Progress";
export const WINDOW_WIDTH = 410;
export const WINDOW_HEIGHT = 200;
export const WINDOW_HEIGHT_MIN = 150;
export const BACKGROUND_COLOUR = 3;
export const FOREGROUND_COLOUR = 4;

export const TICKS_PER_MONTH = 65536;
export const TICKS_PER_YEAR = TICKS_PER_MONTH * 8;
export const MONTH_DAYS = [31, 30, 31, 30, 31, 31, 30, 31];
export const DAYS_PER_YEAR = MONTH_DAYS.reduce((a, m) => a + m, 0);
export const TEMP_COLD = 12;
export const TEMP_HOT = 21;

/*
0: Black							1: Gray							2: White							3: Dark purple
4: Light purple				5: Bright purple		6: Dark blue					7: Light blue
8: Icy blue						9: Dark water				10: Light water				11: Saturated green
12: Dark green				13: Moss green			14: Bright green			15: Olive green
16: Dark olive green	17: Bright yellow		18: Yellow						19: Dark yellow
20: Light orange			21: Dark orange			22: Light brown				23: Saturated brown
24: Dark brown				25: Salmon pink			26: Bordeaux red			27: Saturated red
28: Bright red				29: Dark pink				30: Bright pink				31: Light pink

BLACK
GREY
WHITE
RED
GREEN
YELLOW
TOPAZ					Orange						#FFB76B
CELADON				Light green				#AFDBC3
BABYBLUE			Light blue				#8FD3F3
PALELAVENDER	Light purple			#D7C3F3
PALEGOLD			Dirty yellow			#DBC787
LIGHTPINK			Pink							#FFBFBF
PEARLAQUA			Light bluish			#83CFCF
PALESILVER		Grey-yellow				#CFC3AB
*/

export const SUCCESS_COLOUR = "GREEN";
export const ERROR_COLOUR = "RED";
export const WARNING_COLOUR = "TOPAZ";
export const BUTTON_TEXT_COLOUR = "BLACK";
export const INFO_COLOUR = "PALEGOLD";
export const UI_VALUE_WIDTH = 100;
export const UI_VALUE_HEIGHT = 12;
export const UI_LINE_LENGTH = 40;

export const WARNING_DAYS = 31;

export const ICON_OBJECTIVE: ImageAnimation = {
  frameBase: 5511,
  frameCount: 16,
  frameDuration: 2,
};
export const ICON_CROWD: ImageAnimation = {
  frameBase: 5568,
  frameCount: 8,
  frameDuration: 2,
};
export const ICON_CHART: ImageAnimation = {
  frameBase: 5375,
  frameCount: 16,
  frameDuration: 2,
};
export const ICON_COASTERS: ImageAnimation = {
  frameBase: 5546,
  frameCount: 5,
  frameDuration: 2,
};
export const ICON_MONEY: ImageAnimation = {
  frameBase: 5253,
  frameCount: 8,
  frameDuration: 2,
};
export const ICON_BURGER: ImageAnimation = {
  frameBase: 5351,
  frameCount: 16,
  frameDuration: 2,
};
