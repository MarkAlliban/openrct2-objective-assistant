export const getLengthRequirement = (objective: ScenarioObjective): number | null => {
  if (objective.length) return objective.length;

  // BUG: https://github.com/OpenRCT2/OpenRCT2/issues/26200
  // objective.length is declared, but not provided at time of coding.
  // If it's fixed in a future release of OpenRCT2 then we will pick it up here.
  // Until then, there are only 4 official scenarios that use this objective:
  if (scenario.name === "Octagon Park") return 1200;
  if (scenario.name === "Nevermore Park") return 1400;
  if (scenario.name === "Ghost Town") return 1200;
  if (scenario.name === "Rollercoaster Heaven") return 1000;

  return null;
};
