import { getLengthRequirement } from "./get-length-requirement";
import { formatCurrency } from "./format-currency";
import { TObjectiveTarget } from "../types";

const wrapWords = (text: string, lineLength: number): string[] => {
  const words: string[] = text.split(" ");
  return words.reduce((a: string[], word: string) => {
    if (!a.length) return [word];
    if (a[a.length - 1].length + word.length > lineLength) return [...a, word];
    a[a.length - 1] += ` ${word}`;
    return a;
  }, []);
};

export const getObjective = (lineLength: number): TObjectiveTarget => {
  const type = scenario.objective.type;
  switch (type) {
    case "guestsBy":
      return {
        description: wrapWords(
          `To have at least ${scenario.objective.guests} guests in your park at the end of October, Year ${scenario.objective.year}, with a park rating of at least 600`,
          lineLength,
        ),
        guests: scenario.objective.guests,
        year: scenario.objective.year,
        rating: 600,
        tab: 1,
      };
    case "guestsAndRating":
      return {
        description: wrapWords(
          `To have at least ${scenario.objective.guests} guests in your park. You must not let the park rating drop below 700 at any time!`,
          lineLength,
        ),
        guests: scenario.objective.guests,
        rating: 700,
        tab: 1,
      };
    case "parkValueBy":
      return {
        description: wrapWords(
          `To achieve a park value of at least ${formatCurrency(scenario.objective.parkValue)} at the end of October, Year ${scenario.objective.year}`,
          lineLength,
        ),
        parkValue: scenario.objective.parkValue,
        year: scenario.objective.year,
        tab: 2,
      };
    case "repayLoanAndParkValue":
      return {
        description: wrapWords(
          `To repay your loan and achieve a park value of at least ${formatCurrency(scenario.objective.parkValue)}`,
          lineLength,
        ),
        parkValue: scenario.objective.parkValue,
        loan: 0,
        tab: 2,
      };
    case "10Rollercoasters":
      return {
        description: wrapWords(
          "To have 10 different types of roller coasters operating in your park, each with an excitement value of at least 6.00",
          lineLength,
        ),
        rollercoasters: 10,
        excitementTarget: 600,
        tab: 3,
      };
    case "10RollercoastersLength":
      return {
        description: wrapWords(
          `To have 10 different types of roller coasters operating in your park, each with a minimum length of ${context.formatString("{LENGTH}", getLengthRequirement(scenario.objective))}, and an excitement rating of at least 7.00`,
          lineLength,
        ),
        rollercoasters: 10,
        excitementTarget: 700,
        lengthTarget: getLengthRequirement(scenario.objective),
        tab: 3,
      };
    case "finish5Rollercoasters":
      // BUG: scenario.objective.excitement is 65536 too much on custom scenarios
      const excitementTarget = scenario.objective.excitement % 65536;
      return {
        description: wrapWords(
          `To finish building all 5 of the partially built roller coasters in this park, designing them to achieve excitement ratings of at least ${(excitementTarget / 100).toFixed(2)}`,
          lineLength,
        ),
        rollercoasters: 5,
        rollercoastersToComplete: map.rides
          .filter(
            (ride) =>
              ride.classification === "ride" &&
              ride.object.carsPerFlatRide === 255,
          )
          .slice(0, 5)
          .map((ride) => ride.id),
        excitementTarget,
        tab: 3,
      };
    case "monthlyRideIncome":
      return {
        description: wrapWords(
          `To achieve a monthly income from ride tickets of at least ${formatCurrency(scenario.objective.monthlyIncome)}`,
          lineLength,
        ),
        rideIncome: scenario.objective.monthlyIncome,
        tab: 4,
      };
    case "monthlyFoodIncome":
      return {
        description: wrapWords(
          `To achieve a monthly profit from food, drink and merchanidise sales of at least ${formatCurrency(scenario.objective.monthlyIncome)}`,
          lineLength,
        ),
        stallsIncome: scenario.objective.monthlyIncome,
        tab: 5,
      };

    case "haveFun":
      return { description: ["Have fun!"] };
    case "buildTheBest":
      return { description: ["buildTheBest"] }; // TODO: What is this?
    case "none":
      return { description: ["None"] };
    default:
      return { description: [scenario.objective.type || ""] };
  }
};
