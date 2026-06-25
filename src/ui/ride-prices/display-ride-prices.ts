import { getAgeCategory } from "../../actions/rides-set-all-prices";
import { TRideExtended, TRideTracker } from "../../data-model/ride-tracker";
import {
  getActualPriceString,
  getAgeName,
  getMaxPriceString,
  getRideName,
} from "../list-elements";
import { TSortTable } from "../open-window";
import { updateWidgetList } from "../../helpers/update-widgets";
import { readValue } from "../../helpers/storage";
import { SAVED_DATA } from "../../constants";

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
  rideTracker: TRideTracker,
  sortBy: TSortTable,
) => {
  // Set the checkbox
  const automatePrices: boolean =
    !!readValue(SAVED_DATA.automatePrices) || false;
  const widget: CheckboxWidget = window.findWidget("optionAutoPrices");
  if (widget.isChecked !== automatePrices) widget.isChecked = automatePrices;

  // Get sorted rides list
  const rides = rideTracker
    .getRides()
    .filter((ride: TRideExtended) => ride.ride.classification === "ride")
    .sort((a: TRideExtended, b: TRideExtended) => {
      if (sortBy.key === "Ride") {
        return a.ride.name > b.ride.name ? sortBy.direction : -sortBy.direction;
      }
      if (sortBy.key === "Age") {
        return a.ride.age > b.ride.age ? sortBy.direction : -sortBy.direction;
      }
      return a.ride.id > b.ride.id ? 1 : -1;
    });

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    rides.map((ride: TRideExtended) => renderRideTableRow(ride)),
  );

  // Return the ride IDs
  return rides.map((ride: TRideExtended) => ({
    id: ride.ride.id,
    price: ride.finances?.maxPrices[getAgeCategory(ride.ride.age)],
  }));
};
