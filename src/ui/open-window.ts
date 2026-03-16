import { getObjective } from "../utils/get-objective";
import { updateObjectiveValues } from "./update-objective-values";
import { getObjectiveWidgets } from "./get-objective-widgets";
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

export const openWindow = () => {
  for (let i = 0; i < ui.windows; i++) {
    if (ui.getWindow(i).title === TITLE) return;
  }

  const objective = getObjective(UI_LINE_LENGTH);
  const objectiveWidgets = getObjectiveWidgets(objective);

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
        image: ICON_CHART,
        widgets: [],
      },
      {
        image: ICON_COASTERS,
        widgets: [],
      },
      {
        image: ICON_CROWD,
        widgets: [],
      },
      {
        image: ICON_RIDES,
        widgets: [],
      },
    ],
    onUpdate: () => {
      if (window.tabIndex === 0) updateObjectiveValues(window, objective);
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
