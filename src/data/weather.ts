type TTemperatures = {
  averageTemperature: number;
  monthlyAverages: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  baseTemperatures: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  weatherChances: [
    // sunny, partiallyCloudy, cloudy, rain, heavyRain, thunder
    [number, number, number, number, number, number],
    [number, number, number, number, number, number],
    [number, number, number, number, number, number],
    [number, number, number, number, number, number],
    [number, number, number, number, number, number],
    [number, number, number, number, number, number],
    [number, number, number, number, number, number],
    [number, number, number, number, number, number],
  ];
};
type TClimate = {
  cold: TTemperatures;
  coolAndWet: TTemperatures;
  warm: TTemperatures;
  hotAndDry: TTemperatures;
};

const weather: TClimate = {
  cold: {
    averageTemperature: 11.340083,
    monthlyAverages: [
      7.277778, 7.8, 11.058824, 12.722222, 15.391304, 15.608696, 12.736842,
      8.125,
    ],
    baseTemperatures: [4, 5, 7, 9, 10, 11, 9, 6],
    weatherChances: [
      [4, 5, 7, 1, 1, 0],
      [4, 4, 9, 1, 1, 1],
      [4, 7, 4, 1, 1, 0],
      [4, 7, 4, 2, 1, 0],
      [10, 6, 5, 1, 1, 0],
      [6, 10, 4, 1, 1, 1],
      [5, 5, 6, 1, 1, 1],
      [2, 4, 6, 2, 1, 1],
    ],
  },
  coolAndWet: {
    averageTemperature: 17.427962,
    monthlyAverages: [
      9.166667, 10.428571, 16.941176, 21.176471, 24.391304, 23.826087,
      18.368421, 15.125,
    ],
    baseTemperatures: [8, 10, 14, 17, 19, 20, 16, 13],
    weatherChances: [
      [1, 5, 7, 3, 2, 0],
      [0, 5, 9, 3, 3, 1],
      [3, 6, 4, 3, 1, 0],
      [4, 7, 4, 2, 0, 0],
      [10, 6, 5, 1, 1, 0],
      [6, 8, 4, 1, 3, 1],
      [3, 5, 6, 2, 2, 1],
      [2, 4, 6, 2, 1, 1],
    ],
  },
  warm: {
    averageTemperature: 22.031735,
    monthlyAverages: [
      16.095238, 16.636364, 21.176471, 24.166667, 27.590909, 28.882353,
      23.294118, 18.411765,
    ],
    baseTemperatures: [12, 13, 16, 19, 21, 22, 19, 16],
    weatherChances: [
      [5, 8, 7, 0, 1, 0],
      [5, 6, 9, 1, 0, 1],
      [6, 6, 4, 1, 0, 0],
      [6, 7, 4, 1, 0, 0],
      [10, 9, 3, 0, 0, 0],
      [9, 5, 2, 0, 0, 1],
      [5, 5, 6, 1, 0, 0],
      [2, 5, 9, 0, 1, 0],
    ],
  },
  hotAndDry: {
    averageTemperature: 25.049621,
    monthlyAverages: [
      17.2, 20.25, 23.272727, 27.333333, 29.846154, 31.090909, 28.25, 23.153846,
    ],
    baseTemperatures: [12, 14, 16, 19, 21, 22, 21, 16],
    weatherChances: [
      [4, 8, 2, 1, 0, 0],
      [5, 5, 2, 0, 0, 0],
      [6, 4, 1, 0, 0, 0],
      [6, 3, 0, 0, 0, 0],
      [10, 3, 0, 0, 0, 0],
      [9, 2, 0, 0, 0, 0],
      [7, 3, 1, 0, 0, 1],
      [8, 3, 1, 1, 0, 0],
    ],
  },
};

export const getAverageTemperature = () =>
  weather[climate.type].averageTemperature;
export const getAverageMonthlyTemperatures = () =>
  weather[climate.type].monthlyAverages;

// These functions are used to calculate averageTemperature and monthlyAverages from the climate data.
// They aren't really needed for the plugin but they are useful if the climate data changes in the future.

// sunny, partiallyCloudy, cloudy, rain, heavyRain, thunder, snow, heavySnow, blizzard
//const tempModifiers = [10, 5, 0, -2, -4, 2, -5, -10, -20];
// const getTempThisMonth = () => {
//   const baseTemperature = weather[climate.type].baseTemperatures[date.month];
//   const weatherChances = weather[climate.type].weatherChances[date.month];
//   const climateTotal = weatherChances.reduce((a, t) => a + t, 0);
//   const averageTemp = weatherChances.reduce((a, chance, i) => {
//     const tempModifier = (chance / climateTotal) * tempModifiers[i];
//     return a + tempModifier;
//   }, 0);
//   return baseTemperature + averageTemp;
// };
// const calcAverageTemperature = () => {
//   const climateData = weather[climate.type];
//   const modifiedTemperatures = climateData.baseTemperatures.map(
//     (temp: number, month: number) => {
//       const weatherChances = climateData.weatherChances[month];
//       const climateTotal = weatherChances.reduce((a, t) => a + t, 0);
//       const averageTemp = weatherChances.reduce((a, chance, i) => {
//         const tempModifier = (chance / climateTotal) * tempModifiers[i];
//         return a + tempModifier;
//       }, 0);
//       return temp + averageTemp;
//     },
//   );
//   return modifiedTemperatures.reduce((a, t) => a + t, 0) / 8;
// };
