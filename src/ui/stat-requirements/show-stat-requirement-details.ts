import {
  ICONS,
  INFO_COLOUR,
  READABLE_ERROR_COLOUR,
  UI_VALUE_HEIGHT,
  WINDOW_WIDTH,
} from "../../constants";
import {
  TRideExtended,
  TStatRequirementResult,
} from "../../data-model/ride-tracker";
import { updateWidget } from "../../helpers/update-widgets";
import { wrapWords } from "../../helpers/wrap-words";
import {
  ICON_SIZE,
  MAX_STAT_REQUIREMENTS,
  REQUIREMENT_DETAILS_WIDTH,
} from "./init-stat-requirements";

const TEXT_LENGTH = 20;
const TEXT_SEPARATION = UI_VALUE_HEIGHT * 2.5;

export const showStatRequirementDetails = (
  ride: TRideExtended,
  window: Window,
) => {
  const {
    statRequirementResults,
    ride: { name },
    tested,
  } = ride;
  const numStatRequirements = statRequirementResults?.length || 0;

  // Update the ride name
  const nameWrapped = wrapWords(tested ? name : `${name} (untested)`, 24);
  updateWidget(window, "labelRideName", nameWrapped.join("\n"), true, {
    x: WINDOW_WIDTH - REQUIREMENT_DETAILS_WIDTH,
    y: 88 - ((nameWrapped.length - 1) * UI_VALUE_HEIGHT) / 2,
    width: REQUIREMENT_DETAILS_WIDTH - 10,
    height: UI_VALUE_HEIGHT * nameWrapped.length,
  });

  // List the requirements
  for (
    let requirementIndex = 0;
    requirementIndex < MAX_STAT_REQUIREMENTS;
    requirementIndex++
  ) {
    const {
      type = "",
      name = "",
      actual,
      required,
      met,
      overridden,
    } = statRequirementResults?.[requirementIndex] || {};
    const text = numStatRequirements === 0 ? "No stat requirements" : name;
    const visible =
      requirementIndex === 0 || requirementIndex < numStatRequirements;
    const image =
      met || overridden
        ? ICONS.greenLight
        : !tested
          ? ICONS.yellowLight
          : ICONS.redLight;
    const colour =
      met || numStatRequirements === 0
        ? ""
        : !tested || overridden
          ? INFO_COLOUR
          : READABLE_ERROR_COLOUR;

    const textWrapped = visible ? wrapWords(text, TEXT_LENGTH) : [""];
    if (visible) {
      const units: any = {
        highestDropHeight: (v: number) => context.formatString("{LENGTH}", v),
        maxSpeed: (v: number) =>
          parseInt(context.formatString("{VELOCITY}", v)),
        rideLength: (v: number) => context.formatString("{LENGTH}", v),
        maxUnderground: (v: number) => `${v.toFixed(0)}%`,
      };

      if (actual !== undefined) {
        textWrapped.push(
          `${tested ? (units[type] ? units[type](actual) : actual) : "?"} (target ${units[type] ? units[type](required) : required})${overridden ? " *" : ""}`,
        );
      }
    }

    updateWidget(
      window,
      `labelRequirement${requirementIndex + 1}`,
      `${colour}${textWrapped.join("\n")}`,
      visible,
      {
        x: WINDOW_WIDTH - REQUIREMENT_DETAILS_WIDTH + ICON_SIZE,
        y:
          118 +
          TEXT_SEPARATION * requirementIndex -
          ((textWrapped.length - 1) * UI_VALUE_HEIGHT) / 2,
        height: UI_VALUE_HEIGHT * textWrapped.length,
      },
    );

    const buttonWidget: ButtonWidget = window.findWidget(
      `iconRequirement${requirementIndex + 1}`,
    );
    const buttonVisible = visible && numStatRequirements > 0;
    if (buttonWidget.isVisible !== buttonVisible)
      buttonWidget.isVisible = buttonVisible;
    if (buttonWidget.image !== image) buttonWidget.image = image;
    const imageY = 115 + TEXT_SEPARATION * requirementIndex;
    if (buttonWidget.y !== imageY) buttonWidget.y = imageY;
  }

  // Show length bug note
  updateWidget(
    window,
    "lengthNote",
    null,
    !!(
      ride.trackData?.length &&
      ride.statRequirementResults.find((req) => req.type === "rideLength")
    ),
  );

  // Show inversion note
  updateWidget(
    window,
    "overrideNote",
    null,
    statRequirementResults?.some((r: TStatRequirementResult) => r.overridden),
    { y: window.height - 30 },
  );

  // Update the box
  updateWidget(window, "groupDetails", null, true, {
    height: numStatRequirements
      ? 50 + numStatRequirements * TEXT_SEPARATION
      : 80,
  });
};
