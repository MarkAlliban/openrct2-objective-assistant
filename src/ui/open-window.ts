import { guestTracker } from "../data/guest-tracker";

import { getObjective } from "../utils/get-objective";
import { getObjectiveWidgets } from "./get-objective-widgets";
import { updateObjectiveValues } from "./update-objective-values";

import { getRidesWidgets } from "./get-rides-widgets";
import { updateParkValue } from "./update-park-value";

import { getGuestsWidgets } from "./get-guests-widgets";

import {
  TITLE,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_HEIGHT_MIN,
  UI_LINE_LENGTH,
  BACKGROUND_COLOR,
  FOREGROUND_COLOR,
  ICON_OBJECTIVE,
  ICON_CHART,
  ICON_COASTERS,
  ICON_CROWD,
  ICON_RIDES,
} from "../constants";
import { updateGuestsValues } from "./update-guests-values";

export const openWindow = () => {
  // Only allow one window to be open at a time
  for (let i = 0; i < ui.windows; i++) {
    if (ui.getWindow(i).title === TITLE) {
      ui.geWindow(i).bringToFront();
      return;
    }
  }

  // Initialise guest tracker
  const tracker = guestTracker();
  context.subscribe("interval.day", function () {
    tracker.updateGuestCount();
  });

  // We need to maintain a closure of the ride ID's to make the list clickable
  let clickRideIDs: number[] = [];
  const openRide = (row: number) => {
    // BUG: The API can't open the ride window. Best we can do is move the viewport to it.
    const ride = map.getRide(clickRideIDs[row]);
    if (ride && ride.stations.length > 0) {
      const tile = ride.stations[0].start;
      ui.mainViewport.scrollTo(tile);
    }
  };

  // Get the objective widgets
  const objective = getObjective(UI_LINE_LENGTH);
  const objectiveWidgets = getObjectiveWidgets(objective);

  // Get the rides widgets
  const ridesWidgets = getRidesWidgets(openRide);

  // Get the guests widgets
  const guestsWidgets = getGuestsWidgets(openRide);

  let window: Window;
  window = ui.openWindow({
    classification: "objective.progress",
    title: TITLE,
    width: WINDOW_WIDTH,
    minWidth: WINDOW_WIDTH,
    maxWidth: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minHeight: WINDOW_HEIGHT_MIN,
    colours: [BACKGROUND_COLOR, FOREGROUND_COLOR],
    tabs: [
      {
        image: ICON_OBJECTIVE,
        widgets: [...objectiveWidgets.widgets],
      },
      {
        image: ICON_CROWD,
        widgets: [...guestsWidgets.widgets],
      },
      {
        image: ICON_CHART,
        widgets: [...ridesWidgets.widgets],
      },
      {
        image: ICON_COASTERS,
        widgets: [],
      },
      {
        image: ICON_RIDES,
        widgets: [],
      },
    ],
    onUpdate: () => {
      if (window.tabIndex === 0) updateObjectiveValues(window, objective);
      if (window.tabIndex === 1)
        clickRideIDs = updateGuestsValues(window, objective, tracker);
      if (window.tabIndex === 2)
        clickRideIDs = updateParkValue(window, objective, tracker);
    },
  });
};

/*
0: Black
1: Gray
2: White
3: Dark purple
4: Light purple
5: Bright purple
6: Dark blue
7: Light blue
8: Icy blue
9: Dark water
10: Light water
11: Saturated green
12: Dark green
13: Moss green
14: Bright green
15: Olive green
16: Dark olive green
17: Bright yellow
18: Yellow
19: Dark yellow
20: Light orange
21: Dark orange
22: Light brown
23: Saturated brown
24: Dark brown
25: Salmon pink
26: Bordeaux red
27: Saturated red
28: Bright red
29: Dark pink
30: Bright pink
31: Light pink
*/
