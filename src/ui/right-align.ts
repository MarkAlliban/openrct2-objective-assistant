import { label, horizontal } from "openrct2-flexui";

export const rightAlign = (text: any, width: any, maxWidth: number) => {
  return horizontal({
    width: `${maxWidth}px`,
    content: [
      label({
        text,
        width: width,
        padding: { left: "1w" },
      }),
    ],
  });
};
