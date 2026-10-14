import { getAgeCategory } from "../../actions/rides-set-all-prices";
import {
  getActualPriceString,
  getAgeName,
  getMaxPriceString,
  getRideName,
} from "../../helpers/list-elements";
import { updateWidgetList } from "../../helpers/update-widgets";
import { readValue } from "../../helpers/storage";
import { SAVED_DATA } from "../../constants";
import { TObjectiveAssistant } from "../../data-model/objective-assistant";
import { TRideExtended } from "../../data-model/rides/get-extended-rides";

const renderRideTableRow = (ride: TRideExtended) => {
  const cols: string[] = [
    getRideName(ride),
    getAgeName(ride),
    getActualPriceString(ride),
    getMaxPriceString(ride),
  ];
  return cols;
};

export const displayRidePrices = (
  window: Window,
  objectiveAssistant: TObjectiveAssistant,
) => {
  // Set the checkbox
  const automatePrices: boolean =
    !!readValue(SAVED_DATA.automatePrices) || false;
  const widget: CheckboxWidget = window.findWidget("optionAutoPrices");
  if (widget.isChecked !== automatePrices) widget.isChecked = automatePrices;

  const rides = objectiveAssistant.rides.filter(
    (ride) => ride.ride.classification === "ride",
  );

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride) => renderRideTableRow(ride)),
  );

  // Return the ride IDs
  return rides.map((ride) => ({
    id: ride.ride.id,
    price: ride.finances?.maxPrices[getAgeCategory(ride.ride.age)],
  }));
};
