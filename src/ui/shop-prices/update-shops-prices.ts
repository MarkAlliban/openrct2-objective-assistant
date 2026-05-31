import { TGuestTracker } from "../../data/guest-tracker";
import { TObjectiveTarget, TSortTable } from "../../types";
import { renderItemTableRow } from "../helpers/render-ride-table-row";
import { ridesAddMoreInfo } from "../../data/rides-add-more-info";
import { updateWidgetList } from "../helpers/update-widget";
import { getShopStrategy, shopGetItems } from "../../data/shop-get-items";

export const updateShopsPrices = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  sortBy: TSortTable,
) => {
  const rides = ridesAddMoreInfo(objective, tracker, ["stall", "facility"]);
  const strategy = getShopStrategy();
  const items = shopGetItems(
    rides,
    strategy.temperature,
    strategy.mood,
    strategy.foodBuy,
    strategy.merchBuy,
  );

  const itemsSorted = items.sort((a, b) => {
    if (sortBy.key === "Name")
      return a.data.name > b.data.name ? sortBy.direction : -sortBy.direction;
    return a.id > b.id ? 1 : -1;
  });

  updateWidgetList(
    window,
    "listRides",
    itemsSorted.map((item) => renderItemTableRow(item)),
  );

  return itemsSorted.map((item) => ({
    id: item.id,
    price: item.data.recommendedPrice || 0,
    basePrice: item.data.basePrice,
  }));
};
