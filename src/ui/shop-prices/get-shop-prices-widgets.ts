import { readValue, saveValue } from "../../actions/shared-storage";
import { UI_VALUE_HEIGHT } from "../../constants";
import { TSortTable } from "../../types";
import { renderRideTable } from "../helpers/render-ride-table";

export const getShopPricesWidgets = (
  clickRow: Function,
  sortBy: TSortTable,
  clickAction: Function,
  automateShopPrices: Boolean,
) => [
  {
    name: "optionClickModify",
    type: "checkbox",
    x: 5,
    y: 50,
    width: 115,
    height: UI_VALUE_HEIGHT,
    text: "Click prices to set",
    isChecked: false,
  },
  {
    name: "optionAutoPrices",
    type: "checkbox",
    x: 140,
    y: 50,
    width: 100,
    height: UI_VALUE_HEIGHT,
    text: "Auto prices",
    isChecked: automateShopPrices,
    onChange: (e: boolean) => {
      automateShopPrices = e;
      saveValue("automateShopPrices", e ? 1 : 0);
    },
  },
  {
    name: "optionStrategy",
    type: "dropdown",
    x: 250,
    y: 50,
    width: 110,
    height: UI_VALUE_HEIGHT,
    items: ["Dynamic", "Recommended", "Sell more", "Price gouge"],
    selectedIndex: readValue("shops.strategy"),
    onChange: (value: number) => saveValue("shops.strategy", value),
  },
  {
    name: "optionStrategyDo",
    type: "button",
    x: 360,
    y: 50,
    width: 30,
    height: UI_VALUE_HEIGHT,
    text: "Set",
    onClick: clickAction,
  },
  ...renderRideTable(55 + UI_VALUE_HEIGHT, ["Shops"], clickRow, sortBy),
];
