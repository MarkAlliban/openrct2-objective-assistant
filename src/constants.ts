export const TITLE = "Objective Progress";
export const WINDOW_WIDTH = 410;
export const WINDOW_HEIGHT = 200;
export const WINDOW_HEIGHT_MIN = 150;
export const BACKGROUND_COLOR = 3;
export const FOREGROUND_COLOR = 4;

/*
Allowed colours - need to be tested!
BLACK, GREY, WHITE, RED, GREEN, YELLOW, TOPAZ, CELADON, BABYBLUE, PALELAVENDER, PALEGOLD, LIGHTPINK, PEARLAQUA, PALESILVER
*/

export const SUCCESS_COLOUR = 'GREEN';
export const ERROR_COLOUR = 'RED';
export const WARNING_COLOUR = 'YELLOW';
export const UI_VALUE_WIDTH = 100;
export const UI_VALUE_HEIGHT = 12;
export const UI_LINE_LENGTH = 40;

export const WARNING_DAYS = 31;
export const TICKS_PER_MONTH = 65536;
export const TICKS_PER_YEAR = TICKS_PER_MONTH * 8;
export const MONTH_DAYS = [31, 30, 31, 30, 31, 31, 30, 31];
export const DAYS_PER_YEAR = MONTH_DAYS.reduce((a, m) => a + m, 0);

export const ICON_OBJECTIVE: ImageAnimation = {
  frameBase: 5511,
  frameCount: 16,
  frameDuration: 4,
};
export const ICON_CROWD: ImageAnimation = {
  frameBase: 5568,
  frameCount: 8,
  frameDuration: 4,
};
export const ICON_COASTERS: ImageAnimation = {
  frameBase: 5546,
  frameCount: 5,
  frameDuration: 4,
};
export const ICON_CHART: ImageAnimation = {
  frameBase: 5375,
  frameCount: 16,
  frameDuration: 4,
};
export const ICON_RIDES: ImageAnimation = {
  frameBase: 5442,
  frameCount: 16,
  frameDuration: 4,
};
