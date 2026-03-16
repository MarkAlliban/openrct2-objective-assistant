import { TGuestTracker } from "../data/guest-tracker";
import { TObjectiveTarget } from "../utils/get-objective";
import { renderRideTableRow } from "./render-ride-table-row";
import { updateRidesData } from "./update-rides-data";
import { fitListToWindow } from "./fit-list-to-window";
import { SUCCESS_COLOUR, WARNING_COLOUR } from "../constants";

export const updateGuestsValues = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
) => {
  const rides = updateRidesData(objective, tracker, [
    "ride",
    "stall",
    "facility",
  ], true, true).sort((a, b) => (a.name > b.name ? 1 : -1));

  // Calculate soft guest cap
  const softGuestCapPotential = rides.reduce(
    (a, ride) => a + (ride.bonusValue || 0),
    0,
  );
  const softGuestCapRealtime = rides.reduce((a, ride) => {
    if (ride.status === "open" && ride.breakdown === "none")
      return a + (ride.bonusValue || 0);
    return a;
  }, 0);

  // Update current guests
  const textGuests: TextBoxWidget = window.findWidget("textGuests");
  const colour =
    objective.guests &&
    (park.guests >= objective.guests
      ? SUCCESS_COLOUR
      : park.guests >= objective.guests * 0.9
        ? WARNING_COLOUR
        : "");
  textGuests.text = `${colour ? `{${colour}}` : ""}${park.guests}${objective.guests ? ` / ${objective.guests}` : ""}`;

  // Update the soft guest caps
  const textSoftGuestCapPotential: TextBoxWidget =
    window.findWidget("textSoftGuestCap");
  textSoftGuestCapPotential.text = `${park.suggestedGuestMaximum} / ${softGuestCapPotential}${softGuestCapRealtime === park.suggestedGuestMaximum ? "" : ` {${WARNING_COLOUR}}(${softGuestCapRealtime})`}`;

  // Update ride list widget
  const listview: ListViewWidget = window.findWidget("listRides");
  listview.items = rides.map((ride) =>
    renderRideTableRow(ride, ["name", "type", "bonus"]),
  );
  fitListToWindow(window, listview, rides.length);

  // Return the ride IDs
  return rides.map((ride) => ride.id);
};
