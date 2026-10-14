import { SUCCESS_COLOUR } from "../../constants";
import { formatCurrency } from "../../helpers/format-currency";
import {
  getRideName,
  getRidersString,
  getValueString,
} from "../../helpers/list-elements";
import {
  updateTimeData,
  updateWidget,
  updateWidgetList,
} from "../../helpers/update-widgets";
import { TObjectiveAssistant } from "../../data-model/objective-assistant";
import { TRideExtended } from "../../data-model/rides/get-extended-rides";

const renderParkValueTableRow = (ride: TRideExtended) => {
  const cols: string[] = [
    getRideName(ride),
    getRidersString(ride),
    `${ride.typeData.bonusValue}`,
    getValueString(ride),
  ];
  return cols;
};

export const displayParkValue = (
  window: Window,
  objectiveAssistant: TObjectiveAssistant,
) => {
  const { objective } = objectiveAssistant;

  const rides = objectiveAssistant.rides.filter(
    (ride) => ride.ride.classification === "ride",
  );

  const guestsRow =
    park.guests > 0
      ? [["{PALEGOLD}Guests", `{PALEGOLD}${park.guests}`, "{PALEGOLD}0", `{PALEGOLD}${formatCurrency(park.guests * 70)}`]]
      : [];

  // Update park value widget
  const text = objective.parkValue
    ? `${park.value >= objective.parkValue ? SUCCESS_COLOUR : ""}${formatCurrency(park.value)} / ${formatCurrency(objective.parkValue)}`
    : `${formatCurrency(park.value)}`;
  updateWidget(window, "textParkValue", text);

  // Update time limit indicator
  updateTimeData(window, objective, true);

  // Update ride list widget
  updateWidgetList(window, "listRides", [
    ...rides.map((ride: TRideExtended) => renderParkValueTableRow(ride)),
    ...guestsRow,
  ]);

  // Return the ride IDs
  return rides.map((ride: TRideExtended) => ride.ride.id);
};
