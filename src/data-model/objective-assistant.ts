import { ridesSetAllPrices } from "../actions/rides-set-all-prices";
import { setParkEntrance, TParkEntranceFee } from "../actions/set-park-entrance";
import { shopsSetAllPrices } from "../actions/shops-set-all-prices";
import { SAVED_DATA, UI_LINE_LENGTH } from "../constants";
import { readValue } from "../helpers/storage";
import { updateParkEntranceFee } from "./entrance-fee/update-park-entrance-fee";
import { eventRideCreate, eventRideDemolish } from "./events/ride-events";
import { TGuestCount, updateGuestCount } from "./guests/update-guest-count";
import {
  TGuestThoughts,
  updateGuestThoughts,
} from "./guests/update-guest-thoughts";
import { initObjective, TObjectiveTarget } from "./objective";
import { initParkProperties, TParkProperties } from "./park-properties";
import { getExtendedRides, TRideExtended } from "./rides/get-extended-rides";
import { sortRides, TSortTable } from "./rides/sort-rides";

const GUEST_COUNT_TICKS = 40;
const PRICE_UPDATE_TICKS = 40;
const RIDE_UPDATE_TICKS = 40;

export type TObjectiveAssistant = {
  parkProperties: TParkProperties;
  objective: TObjectiveTarget;
  rides: TRideExtended[];
  guestThoughts: TGuestThoughts;
  sortBy: TSortTable;
  setSortBy: Function;
  updateAllRideData: Function;
  parkEntranceFee: TParkEntranceFee;
};

export class ObjectiveAssistant {
  private startTicks = date.ticksElapsed;
  private lastUpdatedGuestCount = 0;
  private lastUpdatedPrices = 0;
  private lastUpdatedRides = 0;
  // BUG / missing feature: guestCount is only necessary for calculating the ride's value. If the API would give us the "number of guests in the last 5 minutes" then we could remove this, and the complex calculations and large data storage necessary for it.
  private guestCount: TGuestCount[] = [];

  parkProperties: TParkProperties;
  objective: TObjectiveTarget;
  rides: TRideExtended[] = [];
  guestThoughts: TGuestThoughts = {};
  sortBy: TSortTable = { key: "Ride", direction: 1 };
  setSortBy = (key: string, direction: number) => {
    this.sortBy.key = key;
    this.sortBy.direction = direction;
    this.rides = sortRides(this.rides, this.sortBy);
  };
  updateAllRideData = () => {
    this.rides = getExtendedRides(this.objective, this.guestCount, this.sortBy);
  };
  parkEntranceFee: TParkEntranceFee;

  constructor() {
    // These values never change during the scenario
    this.parkProperties = initParkProperties();
    this.objective = initObjective(UI_LINE_LENGTH);
    this.parkEntranceFee = updateParkEntranceFee();

    // Actions that happen automatically
    context.subscribe("interval.tick", () => {
      // Update guest counts and thoughts
      if (date.ticksElapsed >= this.lastUpdatedGuestCount + GUEST_COUNT_TICKS) {
        this.lastUpdatedGuestCount = date.ticksElapsed;
        this.guestCount = updateGuestCount(this.guestCount, this.startTicks);
        this.guestThoughts = updateGuestThoughts();
      }

      // Update ride list
      if (date.ticksElapsed >= this.lastUpdatedRides + RIDE_UPDATE_TICKS) {
        this.lastUpdatedRides = date.ticksElapsed;
        this.updateAllRideData();
        this.parkEntranceFee = updateParkEntranceFee();
      }

      // Update ride and shop prices
      if (date.ticksElapsed >= this.lastUpdatedPrices + PRICE_UPDATE_TICKS) {
        this.lastUpdatedPrices = date.ticksElapsed;

        const automatePrices = !!readValue(SAVED_DATA.automatePrices);
        if (automatePrices && this.parkProperties.canSetRidePrices)
          ridesSetAllPrices(this.rides);

        const automateShopPrices = !!readValue(SAVED_DATA.automateShopPrices);
        if (automateShopPrices && this.parkProperties.canSetShopPrices) {
          shopsSetAllPrices(this.rides);
        }

        const automateParkEntrance = !!readValue(
          SAVED_DATA.automateParkEntrance,
        );
        if (automateParkEntrance && this.parkProperties.canSetParkEntrance) {
          setParkEntrance(this.parkEntranceFee);
        }
      }
    });

    // Actions that only happen on user interraction
    context.subscribe("action.execute", (event) => {
      // Create a new ride
      if (event.action === "ridecreate") {
        const newRide = eventRideCreate(
          event,
          this.rides,
          this.objective,
          this.guestCount,
        );
        if (newRide) this.rides.push(newRide);
        this.setSortBy(this.sortBy.key, this.sortBy.direction);
      }

      // Demolish a ride
      if (event.action === "ridedemolish") {
        const rideIndex = eventRideDemolish(event, this.rides);
        if (rideIndex !== null) this.rides.splice(rideIndex, 1);
        this.setSortBy(this.sortBy.key, this.sortBy.direction);
      }
    });
  }
}
