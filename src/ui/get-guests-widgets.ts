import {
  UI_VALUE_HEIGHT,
  UI_VALUE_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from "../constants";

export const getGuestsWidgets = (clickRow: Function) => {
  const widgets: any[] = [
    {
      name: "labelGuests",
      type: "label",
      x: 75,
      y: 50,
      width: 42,
      height: UI_VALUE_HEIGHT,
      text: "Guests:",
    },
    {
      name: "textGuests",
      type: "label",
      x: 75 + 42 + 3,
      y: 50,
      width: UI_VALUE_WIDTH,
      height: UI_VALUE_HEIGHT,
    },
    {
      name: "labelSoftGuestCap",
      type: "label",
      x: 275 - 48 - 3,
      y: 50,
      width: 48,
      height: UI_VALUE_HEIGHT,
      text: "Soft cap:",
    },
    {
      name: "textSoftGuestCap",
      type: "label",
      x: 275,
      y: 50,
      width: UI_VALUE_WIDTH * 2,
      height: UI_VALUE_HEIGHT,
    },
    {
      name: "listRides",
      type: "listview",
      x: 5,
      y: 55 + UI_VALUE_HEIGHT,
      width: WINDOW_WIDTH - 10,
      height: WINDOW_HEIGHT - 60,
      isStriped: true,
      showColumnHeaders: true,
      canSelect: false,
      columns: [
        {
          header: "Ride",
          width: (WINDOW_WIDTH - 60) / 2,
          canSort: true,
        },
        {
          header: "Type",
          width: (WINDOW_WIDTH - 60) / 2,
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
        // {
        // 	header: "Riders",
        // 	width: 40,
        // 	canSort: true,
        // },
        {
          header: "Bonus",
          width: 50,
          canSort: true,
        },
        // {
        // 	header: "Value",
        // 	width: 80,
        // 	canSort: true,
        // },
      ],
      items: [],
      onClick: (row: number) => clickRow(row),
    },
  ];

  return { widgets };
};
