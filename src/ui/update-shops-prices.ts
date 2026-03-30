import { TGuestTracker } from "../data/guest-tracker";
import { getShopItem } from "../data/shop-info";
import { TItemData, TObjectiveTarget, TSortTable } from "../types";
import { getRecommendedPrice } from "../utils/price-adjustment";
import { renderItemTableRow } from "./render-ride-table-row";
import { ridesAddMoreInfo } from "../utils/rides-add-more-info";
import { updateWidgetList, getWidgetDropdownValue } from "./update-widget";

export const updateShopsPrices = (
  window: Window,
  objective: TObjectiveTarget,
  tracker: TGuestTracker,
  sortBy: TSortTable,
) => {
  const rides = ridesAddMoreInfo(objective, tracker, ["stall", "facility"]);

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

  const itemsSorted = items.sort((a, b) => {
    if (sortBy.key === "Name")
      return a.data.name > b.data.name ? sortBy.direction : -sortBy.direction;
    return a.id > b.id ? 1 : -1;
  });
  // Update ride list widget
  updateWidgetList(
    window,
    "listRides",
    itemsSorted.map((item) => renderItemTableRow(item)),
  );

  // Return the item IDs and recommended prices
  return itemsSorted.map((item) => ({
    id: item.id,
    price: item.data.recommendedPrice || 0,
    basePrice: item.data.basePrice,
  }));
};
