import { TRideExtended, TRideTracker } from "../../data-model/ride-tracker";
import {
  getCurrentPrice,
  getItemName,
  getRideName,
  getRidersString,
} from "../../helpers/list-elements";
import { TSortTable } from "../open-window";
import { updateWidgetList } from "../../helpers/update-widgets";
import { getShopItem } from "../../data/get-shop-item";
import {
  getPhotoPrice,
  getRecommendedPrice,
} from "../../data/recommended-price";
import { formatCurrency2dp } from "../../helpers/format-currency";
import {
  getShopStrategy,
  TShopPricingStrategy,
} from "../../data/get-shop-strategy";
import { readValue } from "../../helpers/storage";
import { SAVED_DATA } from "../../constants";

type TShopItemData = {
  ride: TRideExtended;
  itemName: string;
  price: number;
  recommendedPrice: number;
  isPrimary: boolean;
  oneOff: boolean;
  sales: number;
};

const renderItemTableRow = (item: TShopItemData) => [
  getRideName(item.ride),
  getItemName(item.itemName, item.oneOff || false),
  getCurrentPrice(item.price, item.recommendedPrice),
  formatCurrency2dp((item.recommendedPrice || 0) * 10),
  getRidersString(item.ride),
];

const addShopItem = (
  ride: TRideExtended,
  itemId: number,
  isPrimary: boolean,
  strategy: TShopPricingStrategy,
): TShopItemData => {
  const shopItem = getShopItem(itemId);
  const recommendedPrice = getRecommendedPrice(
    shopItem,
    strategy.temperature,
    strategy.mood,
    strategy.foodBuy,
    strategy.merchBuy,
  );
  return {
    ride,
    itemName: shopItem.name,
    price: ride.ride.price[isPrimary ? 0 : 1],
    isPrimary,
    oneOff: shopItem.oneOff || false,
    recommendedPrice,
    sales: 0,
  };
};

export const displayShopPrices = (
  window: Window,
  rideTracker: TRideTracker,
  sortBy: TSortTable,
) => {
  // Set the checkbox
  const automateShopPrices = !!readValue(SAVED_DATA.automateShopPrices);
  const widget: CheckboxWidget = window.findWidget("optionAutoPrices");
  if (widget.isChecked !== automateShopPrices)
    widget.isChecked = automateShopPrices;

  // Get shop list
  const shops = rideTracker
    .getRides()
    .filter((ride: TRideExtended) =>
      ["stall", "facility"].includes(ride.ride.classification),
    );

  // Get pricing strategy
  const strategy = getShopStrategy();

  // Build shop and item list
  const rows: TShopItemData[] = [];
  shops.forEach((ride: TRideExtended) => {
    if (ride.ride.object.shopItem !== 255) {
      rows.push(addShopItem(ride, ride.ride.object.shopItem, true, strategy));
    }
    if (ride.ride.object.shopItemSecondary !== 255) {
      rows.push(
        addShopItem(ride, ride.ride.object.shopItemSecondary, false, strategy),
      );
    }
  });

  // Add on-ride photos
  const ridesWithPhotos = rideTracker
    .getRides()
    .filter(
      (ride: TRideExtended) =>
        ride.ride.classification === "ride" && ride.ride.price.length > 1,
    );
  if (ridesWithPhotos.length) {
    ridesWithPhotos.forEach((ride: TRideExtended) => {
      rows.push({
        ride,
        itemName: "On-ride Photo",
        price: ride.ride.price[1],
        recommendedPrice: getPhotoPrice(strategy),
        isPrimary: false,
        oneOff: true,
        sales: 0,
      });
    });
  }

  // Sort the list
  const rowsSorted = rows.sort((a: TShopItemData, b: TShopItemData) => {
    if (sortBy.key === "Name") {
      return a.ride.ride.name > b.ride.ride.name
        ? sortBy.direction
        : -sortBy.direction;
    }
    if (sortBy.key === "Item") {
      return a.itemName > b.itemName ? sortBy.direction : -sortBy.direction;
    }
    return a.ride.ride.id > b.ride.ride.id ? 1 : -1;
  });

  // Update the widget
  updateWidgetList(
    window,
    "listShops",
    rowsSorted.map((item) => renderItemTableRow(item)),
  );

  return rowsSorted.map((item) => ({
    id: item.ride.ride.id,
    price: item.recommendedPrice,
    isPrimary: item.isPrimary,
  }));
};
