export const updateWidget = (
  window: Window,
  name: string,
  text: string | null,
  setVisible: boolean | null = null,
) => {
  const widget: LabelWidget = window.findWidget(name);
  if (!widget) return;
  if (text !== null && widget.text !== text) widget.text = text;
  if (setVisible && !widget.isVisible) widget.isVisible = true;
  if (setVisible === false && widget.isVisible) widget.isVisible = false;
};
