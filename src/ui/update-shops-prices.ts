import { TGuestTracker } from "../data/guest-tracker";
import { getShopItem } from "../data/shop-info";
import { TItemData, TObjectiveTarget, TSortTable } from "../types";
import { getRecommendedPrice } from "../utils/price-adjustment";
import { renderItemTableRow } from "./render-ride-table-row";
import { updateRidesData } from "./update-rides-data";
import { updateWidgetList } from "./update-widget-list";

const getWidgetDropdownValue = (window: Window, name: string): number => {
  const box: DropdownWidget = window.findWidget(name);
  return box ? box.selectedIndex : 0;
};

export const updateShopsPrices = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  sortBy: TSortTable,
) => {
  const rides = updateRidesData(objective, tracker, ["stall", "facility"]).sort(
    (a, b) => {
      if (sortBy.key === "Ride")
        return a.name > b.name ? sortBy.direction : -sortBy.direction;
      return a.id > b.id ? 1 : -1;
    },
  );

  const optionTemperature = getWidgetDropdownValue(window, "optionTemperature");
  const optionGuestMood = getWidgetDropdownValue(window, "optionGuestMood");
  const optionFoodBuy = getWidgetDropdownValue(window, "optionFoodBuy");
  const optionMerchBuy = getWidgetDropdownValue(window, "optionMerchBuy");

  // Get a list of the items for sale
  const items: TItemData[] = [];
  rides.forEach((ride) => {
    ride.shopItems?.forEach((item) => {
      const i = items.filter((i) => i.id === item.id);
      if (i.length === 0) {
        const shopItem = getShopItem(item.id);
        const newIndex = items.push({
          id: item.id,
          minPrice: item.price,
          maxPrice: item.price,
          data: getShopItem(item.id),
        });
        const recommendedPrice = getRecommendedPrice(
          shopItem,
          optionTemperature,
          optionGuestMood,
          optionFoodBuy,
          optionMerchBuy,
        );

        items[newIndex - 1].data.recommendedPrice = recommendedPrice;
      } else {
        if (i[0].minPrice > item.price) i[0].minPrice = item.price;
        if (i[0].maxPrice < item.price) i[0].maxPrice = item.price;
      }
    });
  });

  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    items.map((item) => renderItemTableRow(item)),
  );

  // Return the item IDs and recommended prices
  return items.map((item) => ({
    id: item.id,
    price: item.data.recommendedPrice || 0,
    basePrice: item.data.basePrice,
  }));
};
