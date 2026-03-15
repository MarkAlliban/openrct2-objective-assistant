import {
  groupbox,
  label,
  tab,
  LayoutDirection,
  flexible,
  tabwindow,
  box,
} from "openrct2-flexui";
import { getObjective, TObjectiveRequirements } from "./utils/get-objective";

export const TITLE = "Objective Progress";

const spiralSlideIcon: ImageAnimation = {
  frameBase: 5442,
  frameCount: 16,
  frameDuration: 4,
};

const openWindow = () => {
  const objective: TObjectiveRequirements = getObjective(40);

  return tabwindow({
    title: TITLE,
    width: { value: 500, min: 410, max: 10000 },
    height: { value: 300, min: 200, max: 10000 },
    // padding: { top: 35, left: 5, right: 5 },
    tabs: [
      tab({
        image: spiralSlideIcon,
        // height: 140,
        content: [
          groupbox({
            text: "Objective",
            direction: LayoutDirection.Horizontal,
            content: [
              label({
                text: objective.description.join('\n'),
                height: 10 * objective.description.length + 5,
              }),
              flexible({
                content: objective.requirements.map((req) =>
                  flexible({
                    direction: LayoutDirection.Horizontal,
                    content: [
                      label({
                        text: `${req.text}:`,
                        width: "90px",
                      }),
                      label({ text: req.requiredText, width: "75px" }),
                    ],
                  }),
                ),
              }),
            ],
          }),
          box({
            content: label({
              width: "100px",
              padding: { left: "1w" },
              text: "This is a right aligned label",
            }),
          }),
          label({ text: "test 1" }),
          label({ text: "test 2" }),
          label({ text: "test 3" }),
          label({ text: "test 4" }),
          label({ text: "test 5" }),
        ],
      }),
    ],
  });
};

export function startup() {
  if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () => openWindow().open());
  }
}
