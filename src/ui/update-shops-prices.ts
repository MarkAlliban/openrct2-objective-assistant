import { TGuestTracker } from "../data/guest-tracker";
import { getShopItem } from "../data/shop-info";
import { TItemData, TObjectiveTarget, TSortTable } from "../types";
import { getRecommendedPrice } from "../utils/price-adjustment";
import { fitListToWindow } from "./fit-list-to-window";
import { renderItemTableRow } from "./render-ride-table-row";
import { updateRidesData } from "./update-rides-data";

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

  const boxTemp: DropdownWidget = window.findWidget("optionTemperature");
  const optionTemperature = boxTemp.selectedIndex;
  const boxGuestMood: DropdownWidget = window.findWidget("optionGuestMood");
  const optionGuestMood = boxGuestMood.selectedIndex;
  const boxGreediness: DropdownWidget = window.findWidget("optionGreediness");
  const optionGreediness = boxGreediness.selectedIndex;

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
          optionGreediness,
        );

        items[newIndex - 1].data.recommendedPrice = recommendedPrice;
      } else {
        if (i[0].minPrice > item.price) i[0].minPrice = item.price;
        if (i[0].maxPrice < item.price) i[0].maxPrice = item.price;
      }
    });
  });

	// Update ride list widget
  const listview: ListViewWidget = window.findWidget("listRides");
  listview.items = items.map((item) => renderItemTableRow(item));
  fitListToWindow(window, listview, items.length);

  // Return the item IDs and recommended prices
  return items.map((item) => ({
    id: item.id,
    price: item.data.recommendedPrice || 0,
    basePrice: item.data.basePrice,
  }));
};
