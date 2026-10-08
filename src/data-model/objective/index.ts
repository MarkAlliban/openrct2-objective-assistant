import { getLengthRequirement } from "./get-length-requirement";
import { formatCurrency } from "../../helpers/format-currency";
import { wrapWords } from "../../helpers/wrap-words";

export interface TObjectiveTarget {
  type: string;
  description: string[];
  year?: number;
  guests?: number;
  rating?: number;
  parkValue?: number;
  rollercoasters?: number;
  rollercoastersToComplete?: number[];
  excitementTarget?: number;
  lengthTarget?: number | null;
  rideIncome?: number;
  stallsIncome?: number;
  loan?: number;
  tab?: number;
}

export const initObjective = (lineLength: number): TObjectiveTarget => {
  const objective = scenario.objective;
  const { type } = objective;
  switch (type) {
    case "guestsBy":
      return {
        type,
        description: wrapWords(
          `To have at least ${objective.guests} guests in your park at the end of October, Year ${objective.year}, with a park rating of at least 600`,
          lineLength,
        ),
        guests: objective.guests,
        rating: 600,
        year: objective.year,
        tab: 1,
      };
    case "guestsAndRating":
      return {
        type,
        description: wrapWords(
          `To have at least ${objective.guests} guests in your park. You must not let the park rating drop below 700 at any time!`,
          lineLength,
        ),
        guests: objective.guests,
        rating: 700,
        tab: 1,
      };
    case "parkValueBy":
      return {
        type,
        description: wrapWords(
          `To achieve a park value of at least ${formatCurrency(objective.parkValue)} at the end of October, Year ${objective.year}`,
          lineLength,
        ),
        parkValue: objective.parkValue,
        year: objective.year,
        tab: 2,
      };
    case "repayLoanAndParkValue":
      return {
        type,
        description: wrapWords(
          `To repay your loan and achieve a park value of at least ${formatCurrency(objective.parkValue)}`,
          lineLength,
        ),
        parkValue: objective.parkValue,
        loan: 0,
        tab: 2,
      };
    case "10Rollercoasters":
      return {
        type,
        description: wrapWords(
          "To have 10 different types of roller coasters operating in your park, each with an excitement value of at least 6.00",
          lineLength,
        ),
        rollercoasters: 10,
        excitementTarget: 600,
        tab: 3,
      };
    case "10RollercoastersLength":
      const lengthRequirement = getLengthRequirement(objective);
      return {
        type,
        description: wrapWords(
          `To have 10 different types of roller coasters operating in your park, each with a minimum length of ${lengthRequirement ? context.formatString("{LENGTH}", lengthRequirement) : "UNKNOWN"}, and an excitement rating of at least 7.00`,
          lineLength,
        ),
        rollercoasters: 10,
        excitementTarget: 700,
        lengthTarget: lengthRequirement,
        tab: 3,
      };
    case "finish5Rollercoasters":
      const excitementTarget = objective.excitement % 65536;
      return {
        type,
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
        type,
        description: wrapWords(
          `To achieve a monthly income from ride tickets of at least ${formatCurrency(objective.monthlyIncome)}`,
          lineLength,
        ),
        rideIncome: objective.monthlyIncome,
        tab: 4,
      };
    case "monthlyFoodIncome":
      return {
        type,
        description: wrapWords(
          `To achieve a monthly profit from food, drink and merchanidise sales of at least ${formatCurrency(objective.monthlyIncome)}`,
          lineLength,
        ),
        stallsIncome: objective.monthlyIncome,
        tab: 5,
      };

    case "haveFun":
      return { type, description: ["Have fun!"] };
    case "buildTheBest":
      return { type, description: ["buildTheBest"] };
    case "none":
      return { type, description: ["None"] };
    default:
      return { type, description: [objective.type || ""] };
  }
};
