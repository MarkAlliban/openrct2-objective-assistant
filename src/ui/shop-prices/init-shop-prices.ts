import { shopsSetAllPrices } from "../../actions/shops-set-all-prices";
import { readValue, saveValue } from "../../helpers/storage";
import { SAVED_DATA, UI_VALUE_HEIGHT } from "../../constants";
import { TParkProperties } from "../../data-model/park-properties";
import { TRideTracker } from "../../data-model/ride-tracker";
import { TSortTable } from "../open-window";
import { renderShopTable } from "./render-shop-table";

export const initShopPrices = (
  rideTracker: TRideTracker,
  clickRow: Function,
  sortBy: TSortTable,
  parkProperties: TParkProperties,
) => {
  const automateShopPrices: boolean =
    !!readValue(SAVED_DATA.automateShopPrices) || false;
  const shopPricingStrategy: number = parseInt(
    readValue(SAVED_DATA.shopPricingStrategy) || "0",
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
      isChecked: automateShopPrices,
      onChange: (checked: boolean) =>
        saveValue(SAVED_DATA.automateShopPrices, checked ? "1" : ""),
    },
    {
      name: "optionStrategy",
      type: "dropdown",
      x: 250,
      y: 50,
      width: 110,
      height: UI_VALUE_HEIGHT,
      items: ["Dynamic", "Recommended", "Sell more", "Price gouge"],
      selectedIndex: shopPricingStrategy,
      onChange: (value: number) =>
        saveValue(SAVED_DATA.shopPricingStrategy, value.toString()),
    },
    {
      name: "optionStrategyDo",
      type: "button",
      x: 360,
      y: 50,
      width: 30,
      height: UI_VALUE_HEIGHT,
      text: "Set",
      onClick: () => {
        if (parkProperties.canSetShopPrices) {
          shopsSetAllPrices(rideTracker.getRides());
        }
      },
    },
    ...renderShopTable(55 + UI_VALUE_HEIGHT, clickRow, sortBy),
  ];
};
