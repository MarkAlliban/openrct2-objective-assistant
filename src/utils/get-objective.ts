import { getLengthRequirement } from "./get-length-requirement";

export type TObjectiveRequirements = {
  description: string[];
  requirements: {
    text: string;
    required: number | null;
    requiredText: string;
  }[];
};

export type TObjectiveTarget = {
  description: string[];
  guests?: number;
  year?: number;
  parkValue?: number;
  rollercoasters?: number;
  excitementTarget?: number;
  rating?: number;
  rideIncome?: number;
  lengthTarget?: number;
  stallsIncome?: number;
  loan?: number;
};

const wrapWords = (text: string, lineLength: number): string[] => {
  const words: string[] = text.split(" ");
  return words
    .reduce((a: string[], word: string) => {
      if (!a.length) return [word];
      if (a[a.length - 1].length + word.length > lineLength)
        return [...a, word];
      a[a.length - 1] += ` ${word}`;
      return a;
    }, []);
};

export const getObjective = (lineLength: number): TObjectiveRequirements => {
  const type = scenario.objective.type;
  switch (type) {
    case "guestsBy":
      return {
        description: wrapWords(
          `To have at least ${scenario.objective.guests} guests in your park at the end of October, Year ${scenario.objective.year}, with a park rating of at least 600`,
          lineLength,
        ),
        requirements: [
          {
            text: "Guests",
            required: scenario.objective.guests,
            requiredText: `${scenario.objective.guests}`,
          },
          {
            text: "By",
            required: scenario.objective.year,
            requiredText: `End of year ${scenario.objective.year}`,
          },
        ],
      };
    case "guestsAndRating":
      return {
        description: wrapWords(
          `To have at least ${scenario.objective.guests} guests in your park. You must not let the park rating drop below 700 at any time!`,
          lineLength,
        ),
        requirements: [
          {
            text: "Guests",
            required: scenario.objective.guests,
            requiredText: `${scenario.objective.guests}`,
          },
          { text: "Park rating", required: 700, requiredText: "700" },
        ],
      };
    case "parkValueBy":
      return {
        description: wrapWords(
          `To achieve a park value of at least ${context.formatString("{CURRENCY2DP}", scenario.objective.parkValue).split(".")[0]} at the end of October, Year ${scenario.objective.year}`,
          lineLength,
        ),
        requirements: [
          {
            text: "Park value",
            required: scenario.objective.parkValue,
            requiredText: context
              .formatString("{CURRENCY2DP}", scenario.objective.parkValue)
              .split(".")[0],
          },
          {
            text: "By",
            required: scenario.objective.year,
            requiredText: `End of year ${scenario.objective.year}`,
          },
        ],
      };
    case "repayLoanAndParkValue":
      return {
        description: wrapWords(
          `To repay your loan and achieve a park value of at least ${context.formatString("{CURRENCY2DP}", scenario.objective.parkValue).split(".")[0]}`,
          lineLength,
        ),
        requirements: [
          {
            text: "Park value",
            required: scenario.objective.parkValue,
            requiredText: context
              .formatString("{CURRENCY2DP}", scenario.objective.parkValue)
              .split(".")[0],
          },
          {
            text: "Bank loan",
            required: 0,
            requiredText: context
              .formatString("{CURRENCY2DP}", scenario.objective.parkValue)
              .split(".")[0],
          },
        ],
      };
    case "10Rollercoasters":
      return {
        description: wrapWords(
          "To have 10 different types of roller coasters operating in your park, each with an excitement value of at least 6.00",
          lineLength,
        ),
        requirements: [
          { text: "Rollercoasters", required: 10, requiredText: "10" },
          { text: "Excitement", required: 6, requiredText: "6.00" },
        ],
      };
    case "10RollercoastersLength":
      return {
        description: wrapWords(
          `To have 10 different types of roller coasters operating in your park, each with a minimum length of ${context.formatString("{LENGTH}", getLengthRequirement(scenario.objective))}, and an excitement rating of at least 7.00`,
          lineLength,
        ),
        requirements: [
          { text: "Rollercoasters", required: 10, requiredText: "10" },
          { text: "Excitement", required: 7, requiredText: "7.00" },
          {
            text: "Length",
            required: getLengthRequirement(scenario.objective),
            requiredText: context.formatString(
              "{LENGTH}",
              getLengthRequirement(scenario.objective),
            ),
          },
        ],
      };
    case "finish5Rollercoasters":
      return {
        description: wrapWords(
          `To finish building all 5 of the partially built roller coasters in this park, designing them to achieve excitement ratings of at least ${(scenario.objective.excitement / 100).toFixed(2)}`,
          lineLength,
        ),
        requirements: [
          { text: "Rollercoasters", required: 5, requiredText: "5" },
          {
            text: "Excitement",
            required: scenario.objective.excitement,
            requiredText: `${(scenario.objective.excitement / 100).toFixed(2)}`,
          },
        ],
      };
    case "monthlyRideIncome":
      return {
        description: wrapWords(
          `To achieve a monthly income from ride tickets of at least ${context.formatString("{CURRENCY2DP}", scenario.objective.monthlyIncome).split(".")[0]}`,
          lineLength,
        ),
        requirements: [
          {
            text: "Ride income",
            required: scenario.objective.monthlyIncome,
            requiredText: context
              .formatString("{CURRENCY2DP}", scenario.objective.monthlyIncome)
              .split(".")[0],
          },
        ],
      };
    case "monthlyFoodIncome":
      return {
        description: wrapWords(
          `To achieve a monthly profit from food, drink and merchanidise sales of at least ${context.formatString("{CURRENCY2DP}", scenario.objective.monthlyIncome).split(".")[0]}`,
          lineLength,
        ),
        requirements: [
          {
            text: "Stalls income",
            required: scenario.objective.monthlyIncome,
            requiredText: context
              .formatString("{CURRENCY2DP}", scenario.objective.monthlyIncome)
              .split(".")[0],
          },
        ],
      };

    case "haveFun":
      return { description: ["Have fun!"], requirements: [] };
    case "buildTheBest":
      return { description: ["buildTheBest"], requirements: [] }; // TODO: What is this?
    case "none":
      return { description: ["None"], requirements: [] };
    default:
      return { description: [scenario.objective.type], requirements: [] };
  }
};
