import { shopsSetAllPrices } from "../../actions/shops-set-all-prices";
import { readValue, saveValue } from "../../helpers/storage";
import { ICONS, SAVED_DATA, UI_VALUE_HEIGHT } from "../../constants";
import { renderShopTable } from "./render-shop-table";
import { TObjectiveAssistant } from "../../data-model/objective-assistant";

export const initShopPrices = (
  objectiveAssistant: TObjectiveAssistant,
  clickRow: Function,
) => {
  const automateShopPrices: boolean =
    !!readValue(SAVED_DATA.automateShopPrices) || false;
  const shopPricingStrategy: number = parseInt(
    readValue(SAVED_DATA.shopPricingStrategy) || "0",
  );

  const widgets = [
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
        if (objectiveAssistant.parkProperties.canSetShopPrices) {
          shopsSetAllPrices(objectiveAssistant.rides);
        }
      },
    },
    ...renderShopTable(objectiveAssistant, 55 + UI_VALUE_HEIGHT, clickRow),
  ];

  return {
    image: ICONS.burger,
    widgets,
  };
};
