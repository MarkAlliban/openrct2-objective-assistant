import { ICONS, UI_VALUE_HEIGHT, WINDOW_WIDTH } from "../constants";
import { awardsInfo } from "../data/awards-info";
import { TAward } from "../types";

const addRequirementLabel = (
  name: string,
  text: string,
  y: number,
): LabelDesc => ({
  name,
  type: "label",
  x: 10,
  y,
  width: WINDOW_WIDTH - 20,
  height: UI_VALUE_HEIGHT,
  text,
});

const addRequirements = (award: TAward, y: number): any => {
  return [
    addRequirementLabel(`labelAward${award.name}`, award.text, y),
    ...award.requirements.map((requirement, index) => {
			return {
				name: `${award.name}Requirement${index}`,
				type: "label",
				x: 140 + index * 58,
				y,
				width: 58,
				height: UI_VALUE_HEIGHT,
				tooltip: requirement,
				text: "432 / 444"
			}
    }),
  ];
};

const addExclusions = (award: TAward, y: number): any =>
  award.exclusion.map((exclusion, index) => {
    return {
      type: "button",
      name: `${award.name}Exclusion${index}`,
      x: 400 - index * 16 - 16,
      y,
      width: 16,
      height: 14,
      tooltip: `Can't win when you have the ${exclusion.replace(/([A-Z])/g, ' $1').toLowerCase()} award`,
      image: ICONS.certificate,
    };
  });

export const getAwardsWidgets = () => {
  const widgets: WidgetDesc[] = [];
  let y: number = 65;

  widgets.push({
    name: "groupPositive",
    type: "groupbox",
    x: 5,
    y: 50,
    width: WINDOW_WIDTH - 10,
    height: awardsInfo.filter((award) => award.positive).length * 15 + 17,
    text: "{CELADON}Positive awards",
  });

  awardsInfo
    .filter((award) => award.positive)
    .forEach((award) => {
      widgets.push(...addRequirements(award, y));
      widgets.push(...addExclusions(award, y));
      y += UI_VALUE_HEIGHT + 3;
    });
  y += 12;

  widgets.push({
    name: "groupNegative",
    type: "groupbox",
    x: 5,
    y,
    width: WINDOW_WIDTH - 10,
    height: awardsInfo.filter((award) => !award.positive).length * 15 + 17,
    text: "{LIGHTPINK}Negative awards",
  });
  y += 15;

  awardsInfo
    .filter((award) => !award.positive)
    .forEach((award) => {
      widgets.push(...addRequirements(award, y));
      y += UI_VALUE_HEIGHT + 3;
    });

  return widgets;
};
