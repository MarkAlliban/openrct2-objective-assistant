import { UI_VALUE_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH } from "../constants";

export const getRidesWidgets = (clickRow: Function) => {
  const widgets: any[] = [
    {
      name: "labelParkValue",
      type: "label",
      x: WINDOW_WIDTH / 2 - 60,
      y: 50,
      width: 60,
      height: UI_VALUE_HEIGHT,
      text: "Park value:",
    },
    {
      name: "textParkValue",
      type: "label",
      x: WINDOW_WIDTH / 2,
      y: 50,
      width: WINDOW_WIDTH / 2,
      height: UI_VALUE_HEIGHT,
    },
    {
      name: "listRides",
      type: "listview",
      x: 5,
      y: 70 + UI_VALUE_HEIGHT,
      width: WINDOW_WIDTH - 10,
      height: WINDOW_HEIGHT - 75,
      isStriped: true,
      showColumnHeaders: true,
      canSelect: false,
      columns: [
        {
          header: "Ride",
          width: (WINDOW_WIDTH - 170) / 2,
          canSort: true,
        },
        {
          header: "Type",
          width: (WINDOW_WIDTH - 170) / 2,
          canSort: true,
        },
        // {
        //   header: "Exc",
        //   width: 40,
        // },
        // {
        //   header: "Length",
        //   width: 60,
        // },
        {
          header: "Riders",
          width: 40,
          canSort: true,
        },
        {
          header: "Bonus",
          width: 40,
          canSort: true,
        },
        {
          header: "Value",
          width: 80,
          canSort: true,
        },
      ],
      items: [],
      onClick: (row: number) => clickRow(row),
    },
  ];

  return { widgets };
};
