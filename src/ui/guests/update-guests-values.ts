import { TGuestTracker } from "../../data/guest-tracker";
import { TObjectiveTarget } from "../../types";
import { renderRideTableRow } from "../helpers/render-ride-table-row";
import { ridesAddMoreInfo } from "../../data/rides-add-more-info";
import { SUCCESS_COLOUR } from "../../constants";
import { updateTimeData } from "../helpers/update-time-data";
import { updateWidget, updateWidgetList } from "../helpers/update-widget";

export const updateGuestsValues = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  sortBy: any,
) => {
  // Get ride info and sort
  const rides = ridesAddMoreInfo(
    objective,
    tracker,
    ["ride", "stall", "facility"],
    true,
    true,
  ).sort((a, b) => {
    if (sortBy.key === "Ride")
      return a.name > b.name ? sortBy.direction : -sortBy.direction;
    if (sortBy.key === "Type" && a.typeName !== b.typeName)
      return (a.typeName || "") > (b.typeName || "")
        ? sortBy.direction
        : -sortBy.direction;
    if (sortBy.key === "Bonus" && a.bonusValue !== b.bonusValue)
      return (a.bonusValue || 0) > (b.bonusValue || 0)
        ? -sortBy.direction
        : sortBy.direction;
    return a.id > b.id ? 1 : -1;
  });

  // Calculate soft guest cap
  let softGuestCapPotential = rides.reduce(
    (a, ride) => a + (ride.bonusValue || 0),
    0,
  );
  let softGuestCapRealtime = rides.reduce(
    (a, ride) =>
      ride.status === "open" && ride.breakdown === "none"
        ? a + (ride.bonusValue || 0)
        : a,
    0,
  );
  // Harder guest generation
  const harderWidget: LabelWidget = window.findWidget("labelHarder");
  if (park.getFlag("difficultGuestGeneration")) {
    if (!harderWidget.isVisible) harderWidget.isVisible = true;
    if (softGuestCapPotential > 1000) {
      softGuestCapPotential = 1000;
      softGuestCapRealtime = 1000;
    }
    rides.forEach((ride) => {
      // BUG: For Mobius coasters we should use the length of the first segment, but this isn't exposed by the plugin API.
      if ((ride.rideLength || 0) >= 600 && (ride.excitement || 0) >= 600) {
        softGuestCapPotential += (ride.bonusValue || 0) * 2;
        if (ride.status === "open" && ride.breakdown === "none")
          softGuestCapRealtime += (ride.bonusValue || 0) * 2;
      }
    });
  } else if (harderWidget.isVisible) harderWidget.isVisible = false;

  // Update current guests
  const colour =
    objective.guests && park.guests >= objective.guests ? SUCCESS_COLOUR : "";
  updateWidget(
    window,
    "textGuests",
    `${colour}${park.guests}${objective.guests ? ` / ${objective.guests}` : ""}`,
  );

  // Update the soft guest caps
  updateWidget(
    window,
    "textSoftGuestCap",
    `${park.suggestedGuestMaximum} / ${softGuestCapPotential}${softGuestCapRealtime === park.suggestedGuestMaximum ? "" : ` => ${softGuestCapRealtime}`}`,
  );

  // Update time limit indicator
  updateTimeData(window, objective, !!objective.guests);

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride) => renderRideTableRow(ride, ["name", "type", "bonus"])),
  );

  // Return the ride IDs
  return rides.map((ride) => ride.id);
};
