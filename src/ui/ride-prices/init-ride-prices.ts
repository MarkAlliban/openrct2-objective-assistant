import { ridesSetAllPrices } from "../../actions/rides-set-all-prices";
import { readValue, saveValue } from "../../helpers/storage";
import { SAVED_DATA, UI_VALUE_HEIGHT } from "../../constants";
import { TParkProperties } from "../../data-model/park-properties";
import { TRideTracker } from "../../data-model/ride-tracker";
import { TSortTable } from "../open-window";
import { renderRidePriceTable } from "./render-ride-price-table";

const RIDE_PRICING_STRATEGY = {
  0: "Maximum prices",
  1: "Cheap prices",
  2: "All free",
};

export const initRidePrices = (
  rideTracker: TRideTracker,
  ridePricesClick: Function,
  sortBy: TSortTable,
  parkProperties: TParkProperties,
) => {
  const automatePrices: boolean =
    !!readValue(SAVED_DATA.automatePrices) || false;
  const pricingStrategy: number = parseInt(
    readValue(SAVED_DATA.pricingStrategy) || "0",
  );

  return [
    {
      name: "optionAutoPrices",
      type: "checkbox",
      x: 5,
      y: 50,
      width: 100,
      height: UI_VALUE_HEIGHT,
      text: "Auto prices",
      isChecked: automatePrices,
      onChange: (e: boolean) =>
        saveValue(SAVED_DATA.automatePrices, e ? "1" : ""),
    },
    {
      name: "optionAction",
      type: "dropdown",
      x: 250,
      y: 50,
      width: 110,
      height: UI_VALUE_HEIGHT,
      items: Object.values(RIDE_PRICING_STRATEGY),
      selectedIndex: pricingStrategy,
      onChange: (e: number) => {
        saveValue(SAVED_DATA.pricingStrategy, e.toString());
        if (
          (!!readValue(SAVED_DATA.automatePrices) || false) &&
          parkProperties.canSetRidePrices
        ) {
          ridesSetAllPrices(rideTracker.getRides());
        }
      },
    },
    {
      name: "optionActionDo",
      type: "button",
      x: 360,
      y: 50,
      width: 30,
      height: UI_VALUE_HEIGHT,
      text: "Set",
      onClick: () => {
        if (parkProperties.canSetRidePrices) {
          rideTracker.updateAllRideData();
          ridesSetAllPrices(rideTracker.getRides());
        }
      },
    },

    ...renderRidePriceTable(55 + UI_VALUE_HEIGHT, ridePricesClick, sortBy),
  ];
};
