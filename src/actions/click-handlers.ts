import { TRidePrices } from "../types";
import { getBestPrice, getLongTermPrice } from "../utils/ride-pricing";
import { openRideWindow } from "./open-ride-window";
import { setRidePrice } from "./set-ride-price";

export const handleRidePrice = (
  window: Window,
  dataRidePrices: TRidePrices[],
  row: number,
  col: number,
) => {
  const modifyWidget: CheckboxWidget = window.findWidget("optionClickModify");
  if (col < 3 || !modifyWidget.isChecked)
    return openRideWindow(dataRidePrices[row].id);
  setRidePrice(
    dataRidePrices[row].id,
    dataRidePrices[row].prices[col - 3],
    true,
  );
};

export const handleSetAllRides = (
  window: Window,
  dataRidePrices: TRidePrices[],
) => {
  const actionWidget: DropdownWidget = window.findWidget("optionAction");
  if (actionWidget.selectedIndex === 1) {
    dataRidePrices.forEach((ride) => {
      if (ride.currentPrice !== 0) {
        const bestPrice = getBestPrice(ride.age, ride.prices);
        setRidePrice(ride.id, bestPrice / 10, true);
      }
    });
  }
  if (actionWidget.selectedIndex === 2) {
    dataRidePrices.forEach((ride) => {
      if (ride.currentPrice !== 0) {
        const bestPrice = getLongTermPrice(ride.age, ride.prices);
        setRidePrice(ride.id, bestPrice / 10, true);
      }
    });
  }
};

export const handleShopPrice = (
  window: Window,
  dataShopPrices: { id: number; price: number; basePrice: number }[],
  row: number,
  col: number,
  modifyOverride: boolean = false,
) => {
  const itemId = dataShopPrices[row].id;
  const modifyWidget: CheckboxWidget = window.findWidget("optionClickModify");
  if (col < 2 || (!modifyWidget.isChecked && !modifyOverride)) return;

  const price =
    col === 2 ? dataShopPrices[row].basePrice : dataShopPrices[row].price;

  map.rides
    .filter(
      (ride: Ride) =>
        ride.classification === "stall" || ride.classification === "facility",
    )
    .forEach((shop: Ride) => {
      if (shop.object.shopItem === itemId)
        setRidePrice(shop.id, Math.round(price * 10), true);

      if (shop.object.shopItemSecondary === itemId)
        setRidePrice(shop.id, Math.round(price * 10), false);
    });
};

export const handleSetAllShops = (
  window: Window,
  dataRidePrices: { id: number; price: number; basePrice: number }[],
) => {
  dataRidePrices.forEach((_, i) =>
    handleShopPrice(window, dataRidePrices, i, 3, true),
  );
};
