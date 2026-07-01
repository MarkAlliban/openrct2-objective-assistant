import { ICONS } from "../constants";
import { TObjectiveTarget } from "../data-model/objective";
import { TParkProperties } from "../data-model/park-properties";
import { TRideTracker } from "../data-model/ride-tracker";
import { initAwards } from "./awards/init-awards";
import { initCoasters } from "./coasters/init-coasters";
import { initGuests } from "./guests/init-guests";
import { initObjectiveWindow } from "./objective/init-objective-window";
import { TSortTable } from "./open-window";
import { initParkValue } from "./park-value/init-park-value";
import { initRidePrices } from "./ride-prices/init-ride-prices";
import { initShopPrices } from "./shop-prices/init-shop-prices";
import { initStatRequirements } from "./stat-requirements/init-stat-requirements";

export const initTabs = (
  parkProperties: TParkProperties,
  objective: TObjectiveTarget,
  rideTracker: TRideTracker,
  sortBy: TSortTable,
	goToObjectiveTab: Function,
  clickRideList: Function,
  ridePriceClick: Function,
  shopPriceClick: Function,
  changeColourBack: Function,
  clickStatList: Function,
) => {
  return [
    {
      image: ICONS.objective,
      widgets: initObjectiveWindow(objective, goToObjectiveTab),
    },
    {
      image: ICONS.crowd,
      widgets: initGuests(clickRideList, sortBy),
    },
    {
      image: ICONS.chart,
      widgets: initParkValue(clickRideList, sortBy, objective),
    },
    {
      image: ICONS.coasters,
      widgets: initCoasters(clickRideList, sortBy, objective),
    },
    {
      image: ICONS.money,
      widgets: initRidePrices(
        rideTracker,
        ridePriceClick,
        sortBy,
        parkProperties,
      ),
    },
    {
      image: ICONS.burger,
      widgets: initShopPrices(
        rideTracker,
        shopPriceClick,
        sortBy,
        parkProperties,
      ),
    },
    {
      image: ICONS.awards,
      widgets: initAwards(changeColourBack),
    },
    {
      image: ICONS.stats,
      widgets: initStatRequirements(clickStatList, sortBy),
    },
  ];
};
