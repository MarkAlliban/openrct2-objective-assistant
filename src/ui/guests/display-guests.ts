import { SUCCESS_COLOUR } from "../../constants";
import { TObjectiveTarget } from "../../data-model/objective";
import { TRideExtended, TRideTracker } from "../../data-model/ride-tracker";
import { getRideName, getTypeName } from "../../helpers/list-elements";
import { TSortTable } from "../open-window";
import {
  updateTimeData,
  updateWidget,
  updateWidgetList,
} from "../../helpers/update-widgets";

const renderGuestsTableRow = (ride: TRideExtended) => {
  const cols: string[] = [
    getRideName(ride),
    getTypeName(ride),
    `${ride.typeData.bonusValue}`,
  ];
  return cols;
};

export const displayGuests = (
  window: Window,
  objective: TObjectiveTarget,
  rideTracker: TRideTracker,
  sortBy: TSortTable,
) => {
  // Get sorted ride list
  const rides = rideTracker
    .getRides()
    .sort((a: TRideExtended, b: TRideExtended) => {
      if (sortBy.key === "Ride")
        return a.ride.name > b.ride.name ? sortBy.direction : -sortBy.direction;
      if (sortBy.key === "Type" && a.typeData.name !== b.typeData.name)
        return (a.typeData.name || "") > (b.typeData.name || "")
          ? sortBy.direction
          : -sortBy.direction;
      if (
        sortBy.key === "Bonus" &&
        a.typeData.bonusValue !== b.typeData.bonusValue
      )
        return (a.typeData.bonusValue || 0) > (b.typeData.bonusValue || 0)
          ? -sortBy.direction
          : sortBy.direction;
      return a.ride.id > b.ride.id ? 1 : -1;
    });

  // Calculate soft guest cap
  let softGuestCapPotential = rides.reduce(
    (a: number, ride: TRideExtended) => a + (ride.typeData.bonusValue || 0),
    0,
  );
  let softGuestCapRealtime = rides.reduce(
    (a: number, ride: TRideExtended) =>
      ride.ride.status === "open" && ride.breakdown === "none"
        ? a + (ride.typeData.bonusValue || 0)
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
    rides.forEach((ride: TRideExtended) => {
      // BUG: For Mobius coasters we should use the length of the first segment, but this isn't exposed by the plugin API.
      if (
        (ride.ride.rideLength || 0) >= 600 &&
        (ride.ride.excitement || 0) >= 600
      ) {
        softGuestCapPotential += (ride.typeData.bonusValue || 0) * 2;
        if (ride.ride.status === "open" && ride.breakdown === "none")
          softGuestCapRealtime += (ride.typeData.bonusValue || 0) * 2;
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
  const capColour =
    objective.guests && park.suggestedGuestMaximum >= objective.guests
      ? SUCCESS_COLOUR
      : "";
  updateWidget(
    window,
    "textSoftGuestCap",
    `${capColour}${park.suggestedGuestMaximum} / ${softGuestCapPotential}${softGuestCapRealtime === park.suggestedGuestMaximum ? "" : ` => ${softGuestCapRealtime}`}`,
  );

  // Update time limit indicator
  updateTimeData(window, objective, true);

  // Combine stalls and facilities into one line each
  const { stallCount, stallBonus, facilityCount, facilityBonus } = rides.reduce(
    (
      a: {
        stallCount: number;
        stallBonus: number;
        facilityCount: number;
        facilityBonus: number;
      },
      ride: TRideExtended,
    ) => ({
      stallCount: a.stallCount + (ride.ride.classification === "stall" ? 1 : 0),
      stallBonus:
        a.stallBonus +
        (ride.ride.classification === "stall" ? ride.typeData.bonusValue : 0),
      facilityCount:
        a.facilityCount + (ride.ride.classification === "facility" ? 1 : 0),
      facilityBonus:
        a.facilityBonus +
        (ride.ride.classification === "facility"
          ? ride.typeData.bonusValue
          : 0),
    }),
    { stallCount: 0, stallBonus: 0, facilityCount: 0, facilityBonus: 0 },
  );
  const stallsRow = stallCount
    ? ["Stalls", `x${stallCount}`, `${stallBonus}`]
    : null;
  const facilitiesRow = facilityCount
    ? ["Facilities", `x${facilityCount}`, `${facilityBonus}`]
    : null;

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    [
      ...rides
        .filter(
          (ride: TRideExtended) =>
            !["stall", "facility"].includes(ride.ride.classification),
        )
        .map((ride: TRideExtended) => renderGuestsTableRow(ride)),
      stallsRow,
      facilitiesRow,
    ].filter(Boolean),
  );

  // Return the ride IDs
  return rides.map((ride: TRideExtended) => ride.ride.id);
};
